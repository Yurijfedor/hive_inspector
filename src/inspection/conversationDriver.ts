import {
  startInspectionConversation,
  handleUserAnswer,
  ConversationResult,
} from './conversationOrchestrator';

import {InspectionSession} from './inspectionSession';
export class ConversationDriver {
  private session: InspectionSession | null = null;

  start(hiveNumber: number): ConversationResult {
    const result = startInspectionConversation(hiveNumber);

    this.session = result.session;

    return result;
  }

  handleUserInput(value: unknown): ConversationResult {
    if (!this.session) {
      throw new Error('Conversation not started');
    }

    const result = handleUserAnswer(this.session, value);

    this.session = result.session;

    return result;
  }

  isActive(): boolean {
    return this.session !== null;
  }
}
