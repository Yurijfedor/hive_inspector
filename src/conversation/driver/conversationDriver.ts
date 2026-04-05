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
import {loadHiveContextsFromFirebase} from '../../persistence/inspectionRepository';
import {HiveContext} from '../../types/hive';

export class ConversationDriver {
  private bus: EventBus<ConversationEvent>;
  private persistence: RuntimePersistence;

  private state: RuntimeState = {mode: 'IDLE'};

  private generation = 0;

  private mutationQueue: Promise<void> = Promise.resolve();

  private hiveContexts: HiveContext[] = [];

  constructor(
    bus: EventBus<ConversationEvent>,
    persistence: RuntimePersistence,
    private userId: string,
  ) {
    this.bus = bus;
    this.persistence = persistence;
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

    if (flowId === 'inspection') {
      const hiveNumber = args[0];

      if (hiveNumber) {
        await this.ensureHiveContexts();

        const hive = this.hiveContexts.find((h) => h.hiveNumber === hiveNumber);

        session = {
          ...session,
          hiveContext: hive
            ? {
                queen: hive.queen,
              }
            : undefined,
        };

        console.log('🐝 INJECTED HIVE CONTEXT (REPLACE)', session.hiveContext);
      }
    }

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
        text: 'Готовий до нової команди.',
      });

      this.bus.emit({type: 'CONVERSATION_FINISHED'});
      return;
    }

    await this.saveState();
    this.askCurrentStep();
  }

  private async ensureHiveContexts(): Promise<void> {
    if (this.hiveContexts.length > 0) return;

    try {
      console.log('📦 Loading hive contexts...');
      console.log('👤 UID:', this.userId);
      this.hiveContexts = await loadHiveContextsFromFirebase(this.userId);
      console.log('✅ Hive contexts loaded:', this.hiveContexts.length);
    } catch (e) {
      console.log('❌ Failed to load hive contexts', e);
      this.hiveContexts = [];
    }
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

    // const session = flow.createSession(...args);

    let session = flow.createSession(...args);

    // 🔥 інжектимо context тільки для inspection
    if (flowId === 'inspection') {
      const hiveNumber = args[0];

      if (hiveNumber) {
        await this.ensureHiveContexts();

        const hive = this.hiveContexts.find((h) => h.hiveNumber === hiveNumber);

        session = {
          ...session,
          hiveContext: hive
            ? {
                queen: hive.queen,
              }
            : undefined,
        };

        console.log('🐝 INJECTED HIVE CONTEXT', session.hiveContext);
      }
    }

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

    // const step = flow.steps[active.session.stepIndex];
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

    const question =
      typeof step.question === 'function'
        ? step.question(active.session)
        : step.question ?? '';

    this.bus.emit({
      type: 'SYSTEM_SPEAK',
      text: question,
    });

    // this.bus.emit({type: 'START_LISTENING'});
  }

  // --------------------------------------------------
  // INPUT
  // --------------------------------------------------

  async handleExternalInput(value: unknown): Promise<void> {
    return this.enqueueMutation(async () => {
      const text = String(value).trim();
      const active = this.getActiveInstance();

      // -------------------------
      // CONTROL INTENT
      // -------------------------

      const control = detectControlIntent(text);

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
      // DOMAIN INTERRUPT (🔥 НОВЕ)
      // -------------------------

      const domainIntent = detectDomainIntent(text);
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

        // 👉 не запускати той самий flow повторно
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

        return; // ❗ КРИТИЧНО — не йдемо далі
      }

      // -------------------------
      // FLOW INTENT
      // -------------------------

      const flowIntent = detectFlowIntent(text);

      if (flowIntent.type === 'START_FLOW') {
        const active = this.getActiveInstance();

        if (active?.flowId === flowIntent.flowId) {
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

      // -------------------------
      // DOMAIN EXECUTION
      // -------------------------

      if (!active) return;

      const flow = getFlow(active.flowId);
      if (!flow) return;

      // const step = flow.steps[active.session.stepIndex];

      const resolved = resolveStep(flow, active.session);

      if (!resolved) return;

      const {step, index} = resolved;

      // 🔥 критично
      active.session.stepIndex = index;

      const result = executeStep(step, active.session, text);
      console.log('🧪 STEP RESULT:', result);

      if (result.type === 'ACCEPT') {
        active.session = result.session;
        active.session.stepIndex++;

        // -------------------------
        // 🔥 ОБРОБКА runtimeEffects (ВАЖЛИВО)
        // -------------------------

        const runtimeEffects = result.runtimeEffects ?? [];

        for (const effect of runtimeEffects) {
          console.log('🔥 RUNTIME EFFECT:', effect);

          if (effect.type === 'START_FLOW') {
            console.log('🔥 STARTING SWARM FLOW');

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

        // const flow = getFlow(active.flowId);

        if (active.session.stepIndex >= flow.steps.length) {
          if (result.effects && result.effects.length) {
            for (const effect of result.effects) {
              this.bus.emit({
                type: 'FLOW_EFFECT',
                effect,
              });
              const domainEvent = mapFlowEffectToEvent(effect);
              if (domainEvent) {
                this.bus.emit({
                  type: 'DOMAIN_EVENT',
                  event: domainEvent,
                });
              }
            }
          }
          console.log('STEP RESULT:', result);

          // якщо завершився доменний flow — завершуємо всю розмову

          const hasReplaceFlow = (result.runtimeEffects ?? []).some(
            (e) => e.type === 'REPLACE_FLOW',
          );

          if (active.flowId === 'inspection' && !hasReplaceFlow) {
            this.state = {mode: 'IDLE'};
            await this.persistence.clear();

            this.bus.emit({
              type: 'SYSTEM_SPEAK',
              text: 'Готовий до нової команди.',
            });

            this.bus.emit({type: 'CONVERSATION_FINISHED'});

            return;
          }
          await this.finishActiveFlow();

          return;
        }

        if (result.effects && result.effects.length) {
          for (const effect of result.effects) {
            this.bus.emit({
              type: 'FLOW_EFFECT',
              effect,
            });
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
          message: result.message,
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
