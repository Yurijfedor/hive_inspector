import {MessageDefinition} from '../../flows/conversationFlow';
import {conversation} from '../locales/uk/conversation';

export function resolveMessage<TSession>(
  message: MessageDefinition<TSession>,
  session: TSession,
): string {
  const resolver = conversation[message.id];

  const params = message.params?.(session) ?? {};

  return resolver(params);
}
