import {getFlow} from './flowRegistry';
import {executeStep} from '../inspection/flow/flowRuntime';

import {ConversationResult, RuntimeState, FlowInstance} from './types';

import {EventBus} from './eventBus';
import {ConversationEvent} from './events';

import {RuntimePersistence} from './runtimePersistence';
import {detectFlowIntent} from './flowIntents';
import {detectControlIntent} from '../inspection/controlIntents';

export class ConversationDriver {
  private bus: EventBus<ConversationEvent>;
  private persistence: RuntimePersistence;

  private state: RuntimeState = {mode: 'IDLE'};

  private generation = 0;

  private mutationQueue: Promise<void> = Promise.resolve();

  constructor(
    bus: EventBus<ConversationEvent>,
    persistence: RuntimePersistence,
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

    const session = flow.createSession(...args);

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

    const step = flow.steps[active.session.stepIndex];

    if (!step) {
      this.finishActiveFlow();
      return;
    }

    this.bus.emit({
      type: 'SYSTEM_SPEAK',
      text: step.question,
    });

    this.bus.emit({type: 'START_LISTENING'});
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
      // FLOW INTENT
      // -------------------------

      const flowIntent = detectFlowIntent(text);

      if (flowIntent.type === 'START_FLOW') {
        if (active?.flowId === flowIntent.flowId) {
          this.bus.emit({
            type: 'SYSTEM_SPEAK',
            text: 'Ми вже виконуємо цю команду.',
          });

          this.bus.emit({type: 'START_LISTENING'});
          return;
        }

        await this.pushFlow(flowIntent.flowId, ...(flowIntent.args ?? []));
        return;
      }

      // -------------------------
      // DOMAIN EXECUTION
      // -------------------------

      if (!active) return;

      const flow = getFlow(active.flowId);
      if (!flow) return;

      const step = flow.steps[active.session.stepIndex];

      const result = executeStep(step, active.session, text);

      if (result.type === 'ACCEPT') {
        active.session = result.session;

        active.session.stepIndex++;

        // const flow = getFlow(active.flowId);

        if (active.session.stepIndex >= flow.steps.length) {
          if (result.effects) {
            for (const effect of result.effects) {
              this.bus.emit({
                type: 'FLOW_EFFECT',
                effect,
              });
            }
          }
          if ('runtimeEffects' in result && result.runtimeEffects) {
            for (const effect of result.runtimeEffects) {
              if (effect.type === 'START_FLOW') {
                await this.pushFlow(effect.flowId, ...(effect.args ?? []));
                return;
              }

              if (effect.type === 'REPLACE_FLOW') {
                await this.replaceFlow(effect.flowId, ...(effect.args ?? []));
                return;
              }
            }
          }
          console.log('BEFORE finish', {
            mode: this.state.mode,
            stack: this.state.mode === 'RUNNING' ? this.state.stack.length : 0,
          });

          await this.finishActiveFlow();

          console.log('AFTER finish', {
            mode: this.state.mode,
            stack: this.state.mode === 'RUNNING' ? this.state.stack.length : 0,
          });
          return;
        }

        if (result.effects) {
          for (const effect of result.effects) {
            this.bus.emit({
              type: 'FLOW_EFFECT',
              effect,
            });
          }
        }

        await this.saveState();
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
