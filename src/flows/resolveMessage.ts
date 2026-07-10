import {StepDefinition} from './conversationFlow';
import {messageCatalog} from '../localization/messageCatalog';

export function resolveMessage<TSession>(
  step: StepDefinition<TSession>,
  session: TSession,
): string {
  const prompt = step.messages?.prompt ?? step.prompt;
  if (prompt) {
    const message = messageCatalog[prompt.id];
    if (message) return message;
  }
  if (step.question) {
    return typeof step.question === 'function'
      ? step.question(session)
      : step.question;
  }

  return '';
}
