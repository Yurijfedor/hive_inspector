export type ConversationEvent =
  | {type: 'SYSTEM_SPEAK'; text: string}
  | {type: 'START_LISTENING'}
  | {type: 'USER_INPUT'; text: string}
  | {type: 'CONVERSATION_FINISHED'}
  | {type: 'CONVERSATION_PAUSED'};
