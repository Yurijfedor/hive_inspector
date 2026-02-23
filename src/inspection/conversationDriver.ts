import {
  startInspectionConversation,
  handleUserAnswer,
  ConversationResult,
  askCurrentQuestion,
  hasSession,
} from './conversationOrchestrator';

import {InspectionSession} from './inspectionSession';
import {VoiceAdapter} from '../voice/voiceAdapter';
import {detectControlIntent} from './controlIntents';

/**
 * Runtime state — single source of truth
 */
type RuntimeState =
  | {mode: 'IDLE'}
  | {mode: 'ACTIVE'; session: InspectionSession}
  | {mode: 'PAUSED'; session: InspectionSession};

export class ConversationDriver {
  private voice: VoiceAdapter;

  private state: RuntimeState = {mode: 'IDLE'};

  private emptyRetries = 0;
  private readonly MAX_EMPTY_RETRIES = 2;

  constructor(voice: VoiceAdapter) {
    this.voice = voice;
  }

  // --------------------------------------------------
  // START
  // --------------------------------------------------

  start(hiveNumber: number): ConversationResult {
    const result = startInspectionConversation(hiveNumber);

    if (!hasSession(result)) {
      throw new Error('Invalid start result');
    }

    this.state = {
      mode: 'ACTIVE',
      session: result.session,
    };

    return result;
  }

  // --------------------------------------------------
  // INPUT HANDLING
  // --------------------------------------------------

  handleUserInput(value: unknown): ConversationResult {
    const text = String(value);
    const intent = detectControlIntent(text);

    // ---------- PAUSE ----------
    if (intent === 'PAUSE' && this.state.mode === 'ACTIVE') {
      const session = this.state.session;

      this.state = {mode: 'PAUSED', session};

      return {type: 'PAUSED', session};
    }

    // ---------- RESUME ----------
    if (intent === 'RESUME' && this.state.mode === 'PAUSED') {
      const session = this.state.session;

      this.state = {mode: 'ACTIVE', session};

      return askCurrentQuestion(session);
    }

    // ---------- IGNORE ----------
    if (this.state.mode !== 'ACTIVE') {
      return {type: 'IGNORED'};
    }

    // ---------- DOMAIN ----------
    const result = handleUserAnswer(this.state.session, text);

    if (hasSession(result)) {
      this.state = {
        mode: 'ACTIVE',
        session: result.session,
      };
    }

    if (result.type === 'FINISH') {
      this.state = {mode: 'IDLE'};
    }

    return result;
  }

  // --------------------------------------------------
  // SILENCE HANDLER (⭐ ключ стабільності)
  // --------------------------------------------------

  private async listenNext(
    retryResult: ConversationResult,
  ): Promise<ConversationResult | null> {
    let transcript: string;

    // ---- listen with stream closing support ----
    try {
      transcript = await this.voice.listen();
    } catch (e) {
      // ⭐ input stream finished (mock or real mic end)
      if ((e as Error).message === 'INPUT_STREAM_CLOSED') {
        console.log('🔚 Voice input closed');
        return null;
      }
      throw e;
    }

    // ---- silence handling ----
    if (!transcript.trim()) {
      this.emptyRetries++;

      // ACTIVE → auto pause after retries
      if (
        this.emptyRetries > this.MAX_EMPTY_RETRIES &&
        this.state.mode === 'ACTIVE'
      ) {
        const session = this.state.session;

        await this.voice.speak('Я призупиняю огляд. Скажіть "продовжити".');

        this.state = {mode: 'PAUSED', session};

        return {type: 'PAUSED', session};
      }

      // already paused → stop runtime completely
      if (this.state.mode === 'PAUSED') {
        console.log('⏹ No input while paused — stopping loop');
        return null;
      }

      await this.voice.speak('Я не почув відповідь.');
      return retryResult;
    }

    // ---- valid speech ----
    this.emptyRetries = 0;

    return this.handleUserInput(transcript);
  }

  // --------------------------------------------------
  // RUNTIME LOOP
  // --------------------------------------------------

  async run(initial: ConversationResult): Promise<void> {
    let result: ConversationResult | null = initial;

    while (result) {
      switch (result.type) {
        case 'ASK': {
          await this.voice.speak(result.question);
          result = await this.listenNext(result);
          break;
        }

        case 'CONFIRM': {
          await this.voice.speak(result.message);
          result = await this.listenNext(result);
          break;
        }

        case 'INVALID': {
          await this.voice.speak(result.message);
          result = await this.listenNext(result);
          break;
        }

        case 'PAUSED': {
          await this.voice.speak(
            'Огляд призупинено. Скажіть "продовжити", щоб повернутись.',
          );
          result = await this.listenNext(result);
          break;
        }

        case 'IGNORED': {
          result = await this.listenNext(result);
          break;
        }

        case 'FINISH': {
          await this.voice.speak('Огляд завершено.');
          this.state = {mode: 'IDLE'};
          return; // ← натуральне завершення
        }
      }
    }
  }
  // --------------------------------------------------

  isActive(): boolean {
    return this.state.mode !== 'IDLE';
  }
}
