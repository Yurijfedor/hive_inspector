import {ConversationFlow} from './conversationFlow';
import {parseNumber} from '../../voice/numberParser';
import {createConfirmStep} from './createConfirmStep';
import type {FeedingSession} from './feedingSession';
import type {FlowEffect} from '../../conversation/types';

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
    },

    createConfirmStep<FeedingSession>(
      'CONFIRM_AMOUNT',
      session => `Ви сказали ${session.data.syrupLiters} літрів. Підтвердити?`,
    ),

    createConfirmStep<FeedingSession>(
      'CONFIRM_FEEDING',
      session =>
        `Додати ${session.data.syrupLiters} літрів сиропу у вулик ${session.hiveNumber}?`,
      (session): FlowEffect[] => [
        {
          type: 'FEEDING_RECORDED',
          payload: {
            hiveNumber: session.hiveNumber,
            syrupLiters: session.data.syrupLiters!,
          },
        },
      ],
    ),
  ],
};
