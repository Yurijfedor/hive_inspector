import {ConversationFlow} from './conversationFlow';

export interface HiveSelectedSession {
  stepIndex: number;
  hiveNumber: number;
}

export const hiveSelectedFlow: ConversationFlow<HiveSelectedSession> = {
  id: 'hiveSelected',

  createSession: (hiveNumber: number) => ({
    stepIndex: 0,
    hiveNumber,
  }),

  steps: [
    {
      id: 'WAIT_COMMAND',

      question: 'Що виконати? Огляд чи годівля?',

      normalize: v => String(v).toLowerCase(),

      validate: input => {
        const value = String(input).toLowerCase();
        return value === 'огляд' || value === 'годівля';
      },
      apply: session => session,
    },
  ],
};
