import {FlowEffect} from './types';
import {RuntimeEffect} from './types';

export type ConversationEvent =
  | {type: 'SYSTEM_SPEAK'; text: string}
  | {type: 'START_LISTENING'}
  | {type: 'STOP_LISTENING'}
  | {type: 'USER_INPUT'; text: string}
  | {type: 'CONVERSATION_FINISHED'}
  | {type: 'CONVERSATION_PAUSED'}
  | {
      type: 'FLOW_EFFECT';
      effect: FlowEffect | RuntimeEffect;
    };
