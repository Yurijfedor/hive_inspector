import {StepDefinition} from './conversationFlow';
import {promptCatalog} from '../localization/promptCatalog';

export function resolvePrompt<TSession>(
  step: StepDefinition<TSession>,
  session: TSession,
): string {
  if (step.prompt) {
    const question = promptCatalog[step.prompt.id];
    if (question) return question;
  }
  if (step.question) {
    return typeof step.question === 'function'
      ? step.question(session)
      : step.question;
  }

  return '';
}
