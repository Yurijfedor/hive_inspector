import {MessageDefinition} from '../../flows/conversationFlow';
import {messageCatalog} from '../messageCatalog';

export function resolveMessage<TSession>(
  message: MessageDefinition<TSession>,
  session: TSession,
): string {
  const resolver = messageCatalog[message.id];

  const params = message.params?.(session) ?? {};

  return resolver(params);
}
