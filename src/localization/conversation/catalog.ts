// import type {AppLanguage} from '../types';
import {conversation as uk} from '../locales/uk/conversation';
import {conversation as en} from '../locales/en/conversation';
import {conversation as de} from '../locales/de/conversation';

export const conversationCatalogs = {
  uk,
  en,
  de,
} as const;

export type ConversationMessageId = keyof typeof uk;

// export function getConversationCatalog(language: AppLanguage) {
//   return conversationCatalogs[language] ?? conversationCatalogs.uk;
// }
