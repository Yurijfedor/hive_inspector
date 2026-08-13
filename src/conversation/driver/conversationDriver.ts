import {getFlow} from '../registry/flowRegistry';
import {executeStep, resolveStep} from '../../flows/flowRuntime';

import {ConversationResult, RuntimeState, FlowInstance} from '../types';

import {EventBus} from './eventBus';
import {ConversationEvent} from './events';

import {RuntimePersistence} from './runtimePersistence';
import {detectFlowIntent} from '../intents/flowIntents';
import {detectControlIntent} from '../intents/controlIntents';
import {mapFlowEffectToEvent} from '../../domain/mappers/mapFlowEffectToEvent';
import {detectDomainIntent} from '../intents/domainIntent';
import {HiveContext} from '../../types/hive';
import {HiveContextRepository} from '../../persistence/hiveContextRepository';
import {resolveMessage} from '../../localization/conversation/resolveMessage';
import {StepDefinition} from '../../flows/conversationFlow';
import type {VoiceLanguage} from '../../voice/language/VoiceLanguagePack';

export class ConversationDriver {
  private bus: EventBus<ConversationEvent>;
  private persistence: RuntimePersistence;

  private state: RuntimeState = {mode: 'IDLE'};

  private generation = 0;

  private mutationQueue: Promise<void> = Promise.resolve();

  private hiveContexts: HiveContext[] = [];

  private hiveRepo = new HiveContextRepository();

  constructor(
    bus: EventBus<ConversationEvent>,
    persistence: RuntimePersistence,
    private userId: string,
    private language: VoiceLanguage,
  ) {
    this.bus = bus;
    this.persistence = persistence;
  }

  private async injectHiveContext(
    flowId: string,
    session: any,
    args: any[],
  ): Promise<any> {
    if (flowId !== 'inspection') return session;

    const hiveNumber = args[0];
    if (!hiveNumber) return session;

    await this.ensureHiveContexts();

    const hive = this.hiveContexts.find((h) => h.hiveNumber === hiveNumber);

    const enrichedSession = {
      ...session,
      hiveNumber,
      hiveContext: hive ?? null,
    };

    console.log('🐝 INJECTED HIVE CONTEXT', enrichedSession.hiveContext);

    return enrichedSession;
  }

  // --------------------------------------------------
  // MUTATION QUEUE
  // --------------------------------------------------

  private enqueueMutation(fn: () => Promise<void> | void): Promise<void> {
    const next = this.mutationQueue.then(() => fn());
    this.mutationQueue = next.catch(() => {});
    return next;
  }

  private async replaceFlowInternal(flowId: string, ...args: any[]) {
    if (this.state.mode !== 'RUNNING') return;

    // ❗ просто прибираємо поточний flow
    this.state.stack.pop();

    const flow = getFlow(flowId);
    if (!flow) {
      throw new Error(`Flow ${flowId} not found`);
    }

    // const session = flow.createSession(...args);

    let session = flow.createSession(...args);

    session = await this.injectHiveContext(flowId, session, args);

    const instance: FlowInstance = {
      flowId,
      session,
    };

    this.state.stack.push(instance);

    await this.saveState();

    // ❗ одразу питаємо новий step (без idle, без wake)
    this.askCurrentStep();
  }

  // --------------------------------------------------
  // STACK HELPERS
  // --------------------------------------------------

  private getActiveInstance(): FlowInstance | null {
    if (this.state.mode !== 'RUNNING') return null;
    return this.state.stack[this.state.stack.length - 1] ?? null;
  }

  private async saveState() {
    await this.persistence.save(this.state);
  }

  private async finishActiveFlow() {
    if (this.state.mode !== 'RUNNING') return;

    if (this.state.stack.length === 0) return;

    this.state.stack.pop();

    if (this.state.stack.length === 0) {
      this.state = {mode: 'IDLE'};
      await this.persistence.clear();

      this.bus.emit({
        type: 'SYSTEM_SPEAK',
        text: resolveMessage(
          {
            id: 'common.readyForCommand',
          },
          {},
        ),
      });

      this.bus.emit({type: 'CONVERSATION_FINISHED'});
      return;
    }

    await this.saveState();
    this.askCurrentStep();
  }

  private async ensureHiveContexts(): Promise<void> {
    // if (this.hiveContexts.length > 0) return;

    console.log('📦 Loading hive contexts FROM CACHE');

    this.hiveContexts = await this.hiveRepo.loadAll();

    console.log(
      '🐝 CONTEXTS QUEEN DATA:',
      this.hiveContexts.map((h) => ({
        hiveNumber: h.hiveNumber,
        queen: h.queen,
      })),
    );
  }

  private resolveRetryMessage(step: StepDefinition<any>, session: any): string {
    if (step.messages?.retry) {
      return resolveMessage(step.messages.retry, session);
    }

    return resolveMessage(
      {
        id: 'common.retryUnknown',
      },
      session,
    );
  }
  // --------------------------------------------------
  // RESTORE
  // --------------------------------------------------

  async restore(): Promise<void> {
    return this.enqueueMutation(async () => {
      this.generation++;

      const snapshot = await this.persistence.load();
      if (!snapshot || snapshot.mode === 'IDLE') return;

      this.state = snapshot;
      this.askCurrentStep();
    });
  }

  // --------------------------------------------------
  // PUSH FLOW
  // --------------------------------------------------

  private async pushFlow(flowId: string, ...args: any[]): Promise<void> {
    this.generation++;

    const flow = getFlow(flowId);
    if (!flow) {
      throw new Error(`Flow ${flowId} not found`);
    }

    let session = flow.createSession(...args);

    session = await this.injectHiveContext(flowId, session, args);

    const instance: FlowInstance = {
      flowId,
      session,
    };

    if (this.state.mode === 'IDLE') {
      this.state = {
        mode: 'RUNNING',
        stack: [instance],
      };
    } else {
      this.state.stack.push(instance);
    }

    await this.saveState();
    this.askCurrentStep();
  }

  async startFlow(flowId: string, ...args: any[]): Promise<void> {
    return this.enqueueMutation(() => this.pushFlow(flowId, ...args));
  }

  async replaceFlow(flowId: string, ...args: any[]): Promise<void> {
    return this.enqueueMutation(async () => {
      await this.finishActiveFlow();
      await this.pushFlow(flowId, ...args);
    });
  }

  // --------------------------------------------------
  // ASK STEP
  // --------------------------------------------------

  private askCurrentStep() {
    const active = this.getActiveInstance();
    if (!active) return;

    const flow = getFlow(active.flowId);
    if (!flow) return;

    const resolved = resolveStep(flow, active.session);

    if (!resolved) {
      this.finishActiveFlow();
      return;
    }

    const {step, index} = resolved;

    // 🔥 синхронізуємо index
    active.session.stepIndex = index;

    if (!step) {
      this.finishActiveFlow();
      return;
    }

    // --------------------------------------------------
    // FLOW PROGRESS
    // --------------------------------------------------

    this.bus.emit({
      type: 'FLOW_PROGRESS',
      current: index + 1,
      total: flow.steps.length,
    });

    if (!step.messages?.prompt) {
      throw new Error(`Step "${step.id}" has no prompt message.`);
    }

    const message = resolveMessage(step.messages.prompt, active.session);

    this.bus.emit({
      type: 'SYSTEM_SPEAK',
      text: message,
      // grammar: step.grammar,
    });
  }

  private async stopInspectionInternal(): Promise<void> {
    console.log('🛑 GLOBAL STOP INSPECTION');

    this.state = {mode: 'IDLE'};
    await this.persistence.clear();

    this.bus.emit({
      type: 'SYSTEM_SPEAK',
      text: resolveMessage(
        {
          id: 'common.inspectionStopped',
        },
        {},
      ),
    });

    this.bus.emit({type: 'STOP_INSPECTION'});
  }

  public async stopInspection(): Promise<void> {
    return this.enqueueMutation(async () => {
      await this.stopInspectionInternal();
    });
  }

  // --------------------------------------------------
  // INPUT
  // --------------------------------------------------

  async handleExternalInput(value: unknown): Promise<void> {
    return this.enqueueMutation(async () => {
      const text = String(value).trim();

      // -------------------------
      // 🔥 CONTROL INTENT (ПЕРШИЙ БЛОК!)
      // -------------------------
      console.log('🧪 CONTROL CHECK:', text);

      const control = detectControlIntent(text);

      // 🔴 ПОВНИЙ STOP
      // if (control === 'STOP_INSPECTION') {
      //   console.log('🛑 GLOBAL STOP INSPECTION');

      //   // очищаємо стан
      //   this.state = {mode: 'IDLE'};
      //   await this.persistence.clear();

      //   // повідомляємо користувача
      //   this.bus.emit({
      //     type: 'SYSTEM_SPEAK',
      //     text: resolveMessage(
      //       {
      //         id: 'common.inspectionStopped',
      //       },
      //       {},
      //     ),
      //   });

      //   // 🔥 головне — сигнал runtime
      //   this.bus.emit({type: 'STOP_INSPECTION'});

      //   return;
      // }

      if (control === 'STOP_INSPECTION') {
        await this.stopInspectionInternal();
        return;
      }

      const active = this.getActiveInstance();

      // 🟡 звичайний cancel (тільки flow)
      if (control === 'CANCEL' && active) {
        await this.finishActiveFlow();
        return;
      }

      if (control === 'PAUSE') {
        return;
      }

      if (control === 'RESUME') {
        this.askCurrentStep();
        return;
      }

      // -------------------------
      // DOMAIN INTERRUPT
      // -------------------------

      const domainIntent = detectDomainIntent(text, this.language);
      console.log('🧠 DOMAIN:', domainIntent);

      if (domainIntent !== 'NONE') {
        const active = this.getActiveInstance();

        const flowIdMap: Record<string, string> = {
          SWARM: 'swarm',
          SPLIT: 'split',
          DISEASE: 'disease',
          FEEDING: 'feeding',
        };

        const targetFlowId = flowIdMap[domainIntent];

        if (!targetFlowId) return;

        if (active?.flowId === targetFlowId) {
          this.bus.emit({
            type: 'SYSTEM_SPEAK',
            text: 'Ми вже в цьому сценарії.',
          });

          this.bus.emit({type: 'START_LISTENING'});
          return;
        }

        const hiveNumber = active?.session?.hiveNumber;

        if (hiveNumber) {
          console.log('🔥 DOMAIN INTERRUPT → START FLOW:', targetFlowId);
          await this.pushFlow(targetFlowId, hiveNumber);
        } else {
          this.bus.emit({
            type: 'SYSTEM_SPEAK',
            text: 'Спочатку скажіть номер вулика.',
          });

          this.bus.emit({type: 'START_LISTENING'});
        }

        return;
      }

      // -------------------------
      // FLOW INTENT
      // -------------------------

      // Під час вибору вулика не обробляємо команди запуску flow.
      //
      // hiveSelectionFlow очікує:
      // 1. номер вулика;
      // 2. global control command (наприклад STOP).
      //
      // Це захищає від помилок STT на кшталт:
      // "inspektion behandelt" → помилково START_FLOW('inspection').
      //
      // Якщо користувач сказав щось, що не є номером,
      // текст піде нижче в executeStep(), де HIVE_NUMBER
      // поверне локалізований retry.
      if (active?.flowId !== 'hive') {
        const flowIntent = detectFlowIntent(text);

        if (flowIntent.type === 'START_FLOW') {
          if (active && active.flowId !== 'hive') {
            this.bus.emit({
              type: 'SYSTEM_SPEAK',
              text: 'Ми вже виконуємо цю команду.',
            });

            this.bus.emit({type: 'START_LISTENING'});
            return;
          }

          const hiveNumber = active?.session?.hiveNumber;

          if (hiveNumber) {
            await this.pushFlow(flowIntent.flowId, hiveNumber);
          } else {
            this.bus.emit({
              type: 'SYSTEM_SPEAK',
              text: 'Спочатку скажіть номер вулика.',
            });

            this.bus.emit({type: 'START_LISTENING'});
          }

          return;
        }
      }

      // -------------------------
      // DOMAIN EXECUTION
      // -------------------------

      if (!active) return;

      const flow = getFlow(active.flowId);
      if (!flow) return;

      const resolved = resolveStep(flow, active.session);
      if (!resolved) return;

      const {step, index} = resolved;

      active.session.stepIndex = index;

      const result = executeStep(step, active.session, text, this.language);
      console.log('🧪 STEP RESULT:', result);

      if (result.type === 'ACCEPT') {
        active.session = result.session;
        active.session.stepIndex++;

        const runtimeEffects = result.runtimeEffects ?? [];

        for (const effect of runtimeEffects) {
          console.log('🔥 RUNTIME EFFECT:', effect);

          if (effect.type === 'START_FLOW') {
            await this.pushFlow(effect.flowId, ...(effect.args ?? []));
            return;
          }

          if (effect.type === 'REPLACE_FLOW') {
            await this.replaceFlowInternal(
              effect.flowId,
              ...(effect.args ?? []),
            );
            return;
          }
        }

        if (active.session.stepIndex >= flow.steps.length) {
          if (result.effects?.length) {
            for (const effect of result.effects) {
              this.bus.emit({type: 'FLOW_EFFECT', effect});

              const domainEvent = mapFlowEffectToEvent(effect);
              if (domainEvent) {
                this.bus.emit({
                  type: 'DOMAIN_EVENT',
                  event: domainEvent,
                });
              }
            }
          }

          const hasReplaceFlow = (result.runtimeEffects ?? []).some(
            (e) => e.type === 'REPLACE_FLOW',
          );

          if (active.flowId === 'inspection' && !hasReplaceFlow) {
            this.state = {mode: 'IDLE'};
            await this.persistence.clear();

            await this.pushFlow('hive');

            return;
          }

          await this.finishActiveFlow();
          return;
        }

        if (result.effects?.length) {
          for (const effect of result.effects) {
            this.bus.emit({type: 'FLOW_EFFECT', effect});

            const domainEvent = mapFlowEffectToEvent(effect);
            if (domainEvent) {
              this.bus.emit({
                type: 'DOMAIN_EVENT',
                event: domainEvent,
              });
            }
          }
        }

        await this.saveState();
        await Promise.resolve();
        this.askCurrentStep();
      } else {
        this.processResult({
          type: 'INVALID',
          // message: result.message,
          message: this.resolveRetryMessage(step, active.session),
          session: active.session,
        });
      }
    });
  }

  // --------------------------------------------------
  // RESULT
  // --------------------------------------------------

  private processResult(result: ConversationResult<any>): void {
    if ('effects' in result && result.effects) {
      for (const effect of result.effects) {
        this.bus.emit({
          type: 'FLOW_EFFECT',
          effect,
        });
      }
    }

    switch (result.type) {
      case 'INVALID':
        this.bus.emit({
          type: 'SYSTEM_SPEAK',
          text: result.message,
        });
        this.bus.emit({type: 'START_LISTENING'});
        break;

      case 'IGNORED':
        this.bus.emit({type: 'START_LISTENING'});
        break;
    }
  }

  // --------------------------------------------------

  isActive(): boolean {
    return this.state.mode === 'RUNNING';
  }

  getGeneration(): number {
    return this.generation;
  }
}
