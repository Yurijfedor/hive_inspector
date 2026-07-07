import {StepDefinition} from './conversationFlow';

export function resolvePrompt<TSession>(
  step: StepDefinition<TSession>,
  session: TSession,
): string {
  if (step.prompt) {
    // TODO: use PromptResolver

    const promptKey = step.prompt.id;
    console.log('🔑 PROMPT KEY:', promptKey);
  }
  if (step.question) {
    return typeof step.question === 'function'
      ? step.question(session)
      : step.question;
  }

  return '';
}
