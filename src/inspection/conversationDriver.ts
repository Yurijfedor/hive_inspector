import {
  startInspectionConversation,
  handleUserAnswer,
  ConversationResult,
  askCurrentQuestion,
  hasSession,
} from './conversationOrchestrator';

import {detectControlIntent} from './controlIntents';

import {EventBus} from '../conversation/eventBus';
import {ConversationEvent} from '../conversation/events';

import {RuntimePersistence} from '../conversation/runtimePersistence';
import {RuntimeSnapshot} from '../conversation/runtimeSnapshot';

/**
 * Runtime state — single source of truth
 */
type RuntimeState = RuntimeSnapshot;

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

    if (!snapshot || snapshot.mode === 'IDLE') {
      return;
    }

    this.state = snapshot;

    if (snapshot.mode === 'ACTIVE') {
      const result = askCurrentQuestion(snapshot.session);
      this.processResult(result);
    }

    if (snapshot.mode === 'PAUSED') {
      this.processResult({
        type: 'PAUSED',
        session: snapshot.session,
      });
    }
  }

  // --------------------------------------------------
  // START
  // --------------------------------------------------

  async start(hiveNumber: number): Promise<void> {
    this.generation++;

    const result = startInspectionConversation(hiveNumber);

    if (!hasSession(result)) {
      throw new Error('Invalid start result');
    }

    this.state = {
      mode: 'ACTIVE',
      session: result.session,
    };

    await this.saveState();

    this.processResult(result);
  }

  // --------------------------------------------------
  // INPUT
  // --------------------------------------------------

  async handleExternalInput(value: unknown): Promise<void> {
    const text = String(value);
    const intent = detectControlIntent(text);

    // ---------- PAUSE ----------
    if (intent === 'PAUSE' && this.state.mode === 'ACTIVE') {
      const session = this.state.session;

      this.state = {mode: 'PAUSED', session};

      await this.saveState();

      this.processResult({type: 'PAUSED', session});
      return;
    }

    // ---------- RESUME ----------
    if (intent === 'RESUME' && this.state.mode === 'PAUSED') {
      const session = this.state.session;

      this.state = {mode: 'ACTIVE', session};

      await this.saveState();

      const result = askCurrentQuestion(session);
      this.processResult(result);
      return;
    }

    // ---------- IGNORE ----------
    if (this.state.mode !== 'ACTIVE') {
      this.processResult({type: 'IGNORED'});
      return;
    }

    // ---------- DOMAIN ----------
    const result = handleUserAnswer(this.state.session, text);

    if (hasSession(result)) {
      this.state = {
        mode: 'ACTIVE',
        session: result.session,
      };

      await this.saveState();
    }

    this.processResult(result);
  }

  // --------------------------------------------------
  // RESULT → EVENTS
  // --------------------------------------------------

  private processResult(result: ConversationResult): void {
    // ⭐ NEW — emit workflow effects
    if ('effects' in result && result.effects) {
      for (const effect of result.effects) {
        this.bus.emit({
          type: 'FLOW_EFFECT',
          effect,
        });
      }
    }

    switch (result.type) {
      case 'ASK':
        this.bus.emit({
          type: 'SYSTEM_SPEAK',
          text: result.question,
        });

        this.bus.emit({type: 'START_LISTENING'});
        break;

      case 'CONFIRM':
        this.bus.emit({
          type: 'SYSTEM_SPEAK',
          text: result.message,
        });

        this.bus.emit({type: 'START_LISTENING'});
        break;

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

      case 'FINISH':
        this.bus.emit({
          type: 'SYSTEM_SPEAK',
          text: 'Огляд завершено.',
        });

        this.finishConversation();
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
