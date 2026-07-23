export type MessageResolver = (params: Record<string, unknown>) => string;

export type ConversationModule = Readonly<Record<string, MessageResolver>>;

export type ConversationCatalog = ConversationModule;
