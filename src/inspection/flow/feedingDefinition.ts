import {ConversationFlow} from './conversationFlow';
import {parseNumber} from '../../voice/numberParser';

export interface FeedingSession {
  hiveNumber: number;
  stepIndex: number;
  data: {
    syrupLiters?: number;
  };
}

export const feedingFlow: ConversationFlow<FeedingSession> = {
  id: 'feeding',

  createSession: (hiveNumber: number) => ({
    hiveNumber,
    stepIndex: 0,
    data: {},
  }),

  steps: [
    {
      id: 'SYRUP_AMOUNT',

      question: 'Скільки літрів сиропу додати?',

      normalize: v => parseNumber(String(v)),

      validate: v => typeof v === 'number' && !isNaN(v) && v >= 1 && v <= 20,

      retryMessage: 'Назвіть кількість літрів числом.',

      apply: (session, value) => ({
        ...session,
        data: {
          ...session.data,
          syrupLiters: value as number,
        },
      }),

      afterAccept: session => [
        {
          type: 'FEEDING_RECORDED',
          payload: {
            hiveNumber: session.hiveNumber,
            syrupLiters: session.data.syrupLiters!,
          },
        },
      ],
    },

    {
      id: 'CONFIRM',

      question: 'Підтвердити годівлю?',

      normalize: v => String(v).toLowerCase().trim(),

      validate: v => ['так', 'ні'].includes(v as string),

      retryMessage: 'Скажіть "так" або "ні".',

      apply: (session, value) => {
        if (value === 'так') return session;

        // restart feeding
        return {
          ...session,
          stepIndex: 0,
          data: {},
        };
      },

      afterAccept: () => [],
    },
  ],
};
