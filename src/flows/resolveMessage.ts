import {MessageDefinition} from './conversationFlow';
import {messageCatalog} from '../localization/messageCatalog';

export function resolveMessage<TSession>(
  message: MessageDefinition<TSession>,
  _session: TSession,
): string {
  return messageCatalog[message.id];
}
