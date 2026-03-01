import {getFlow} from './flowRegistry';
import {executeStep} from '../inspection/flow/flowRuntime';
import {ConversationResult, RuntimeState} from './types';

import {detectControlIntent} from '../inspection/controlIntents';

import {EventBus} from './eventBus';
import {ConversationEvent} from './events';

import {RuntimePersistence} from './runtimePersistence';

/**
 * Runtime state — single source of truth
 */

export class ConversationDriver {
  private bus: EventBus<ConversationEvent>;
  private persistence: RuntimePersistence;

  private state: RuntimeState = {mode: 'IDLE'};
  private generation = 0;

  constructor(
    bus: EventBus<ConversationEvent>,
    persistence: RuntimePersistence,
  ) {
    this.bus = bus;
    this.persistence = persistence;
  }

  // --------------------------------------------------
  // SNAPSHOT
  // --------------------------------------------------

  private async saveState() {
    await this.persistence.save(this.state);
  }

  private async finishConversation() {
    this.state = {mode: 'IDLE'};

    await this.persistence.clear();

    this.bus.emit({
      type: 'CONVERSATION_FINISHED',
    });
  }

  // --------------------------------------------------
  // RESTORE
  // --------------------------------------------------

  async restore(): Promise<void> {
    this.generation++;

    const snapshot = await this.persistence.load();
    if (!snapshot || snapshot.mode === 'IDLE') return;

    this.state = snapshot;

    if (snapshot.mode === 'ACTIVE') {
      this.askCurrentStep();
    }

    if (snapshot.mode === 'PAUSED') {
      this.processResult({
        type: 'PAUSED',
        session: snapshot.session,
      });
    }
  }

  // --------------------------------------------------
  // START (GENERIC)
  // --------------------------------------------------

  async start(flowId: string, ...args: any[]): Promise<void> {
    this.generation++;

    const flow = getFlow(flowId);

    if (!flow) {
      throw new Error(`Flow ${flowId} not found`);
    }

    const session = flow.createSession(...args);

    this.state = {
      mode: 'ACTIVE',
      flowId,
      session,
    };

    await this.saveState();

    this.askCurrentStep();
  }

  // --------------------------------------------------
  // ASK STEP
  // --------------------------------------------------

  private askCurrentStep() {
    if (this.state.mode !== 'ACTIVE') return;

    const flow = getFlow(this.state.flowId);
    if (!flow) return;

    const step = flow.steps[this.state.session.stepIndex];

    if (!step) {
      this.finishConversation();
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
    const text = String(value);
    const intent = detectControlIntent(text);

    // ---------- PAUSE ----------
    if (intent === 'PAUSE' && this.state.mode === 'ACTIVE') {
      this.state = {
        mode: 'PAUSED',
        flowId: this.state.flowId,
        session: this.state.session,
      };

      await this.saveState();

      this.processResult({
        type: 'PAUSED',
        session: this.state.session,
      });

      return;
    }

    // ---------- RESUME ----------
    if (intent === 'RESUME' && this.state.mode === 'PAUSED') {
      this.state = {
        mode: 'ACTIVE',
        flowId: this.state.flowId,
        session: this.state.session,
      };

      await this.saveState();

      this.askCurrentStep();
      return;
    }

    // ---------- IGNORE ----------
    if (this.state.mode !== 'ACTIVE') {
      this.processResult({type: 'IGNORED'});
      return;
    }

    // ---------- FLOW EXECUTION ----------
    const flow = getFlow(this.state.flowId);
    if (!flow) return;

    const step = flow.steps[this.state.session.stepIndex];

    const result = executeStep(step, this.state.session, text);

    if (result.type === 'ACCEPT') {
      this.state.session = result.session;

      await this.saveState();

      // next step
      this.state.session.stepIndex++;

      this.askCurrentStep();
    } else {
      this.processResult({
        type: 'INVALID',
        message: result.message,
        session: this.state.session,
      });
    }
  }

  // --------------------------------------------------
  // RESULT → EVENTS
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

      case 'PAUSED':
        this.bus.emit({
          type: 'SYSTEM_SPEAK',
          text: 'Огляд призупинено. Скажіть "продовжити", щоб повернутись.',
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
    return this.state.mode !== 'IDLE';
  }

  getGeneration() {
    return this.generation;
  }
}
