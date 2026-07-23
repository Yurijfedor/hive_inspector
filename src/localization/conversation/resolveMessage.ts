import {MessageDefinition} from '../../flows/conversationFlow';
import {getConversationCatalog} from './catalog';

export function resolveMessage<TSession>(
  message: MessageDefinition<TSession>,
  session: TSession,
): string {
  const catalog = getConversationCatalog();

  const resolver = catalog[message.id];

  const params = message.params?.(session) ?? {};

  return resolver(params);
}
