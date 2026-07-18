export type MessageResolver = (params: Record<string, unknown>) => string;

export type ConversationModule = Readonly<Record<string, MessageResolver>>;

export interface ConversationLocale {
  common: ConversationModule;

  hive: ConversationModule;

  inspection: ConversationModule;

  disease: ConversationModule;

  swarm: ConversationModule;

  split: ConversationModule;

  feeding: ConversationModule;
}
