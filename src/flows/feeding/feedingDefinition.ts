import {ConversationFlow} from '../conversationFlow';
// import {parseNumber} from '../../voice/numberParser';
import {createNumberStep} from '../createNumberStep';
import {createConfirmStep} from '../createConfirmStep';
import type {FeedingSession} from './feedingSession';

// import {normalizeBoolean} from '../../domain/normalizers/booleanNormalizer';

export const feedingFlow: ConversationFlow<FeedingSession> = {
  id: 'feeding',

  createSession: (hiveNumber: number) => ({
    hiveNumber,
    stepIndex: 0,
    data: {},
  }),

  steps: [
    // -------------------------
    // 1. AMOUNT
    // -------------------------
    createNumberStep(
      'SYRUP_AMOUNT',

      {
        id: 'feeding.askSyrupAmount',
      },

      {
        min: 1,
        max: 20,

        retry: {
          id: 'feeding.retrySyrupAmount',
        },
      },

      (session, value) => ({
        session: {
          ...session,

          data: {
            ...session.data,

            syrupLiters: value as number,
          },
        },
      }),
    ),

    // -------------------------
    // 2. FINAL CONFIRM
    // -------------------------
    createConfirmStep(
      'CONFIRM_FEEDING',

      {
        id: 'feeding.confirm',

        params: (session) => ({
          hiveNumber: session.hiveNumber,
          syrupLiters: session.data.syrupLiters,
        }),
      },

      (session) => [
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
