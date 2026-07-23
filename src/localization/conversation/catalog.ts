import i18n from '../i18n';
import {AppLanguage} from '../types';
import {conversation as uk} from '../locales/uk/conversation';
import {conversation as en} from '../locales/en/conversation';
import {conversation as de} from '../locales/de/conversation';

export const conversationCatalogs = {
  uk,
  en,
  de,
} as const;

export type ConversationMessageId = keyof typeof uk;

export function getConversationCatalog() {
  return (
    conversationCatalogs[i18n.language as AppLanguage] ??
    conversationCatalogs.uk
  );
}
