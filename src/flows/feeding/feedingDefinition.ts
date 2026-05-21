import {ConversationFlow} from '../conversationFlow';
import {parseNumber} from '../../voice/numberParser';
import type {FeedingSession} from './feedingSession';

import {normalizeBoolean} from '../../domain/normalizers/booleanNormalizer';

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
    {
      id: 'SYRUP_AMOUNT',

      question: 'Скільки літрів сиропу додати?',

      normalize: (v) => parseNumber(String(v)),

      validate: (v) => typeof v === 'number' && !isNaN(v) && v >= 1 && v <= 20,

      retryMessage: 'Назвіть кількість літрів числом.',

      apply: (session, value) => {
        const amount = value as number;

        return {
          session: {
            ...session,
            data: {
              ...session.data,
              syrupLiters: amount,
            },
          },
        };
      },
    },

    // -------------------------
    // 2. FINAL CONFIRM
    // -------------------------
    {
      id: 'CONFIRM_FEEDING',

      question: (session) =>
        `Додати ${session.data.syrupLiters} літрів сиропу у вулик ${session.hiveNumber}?`,

      normalize: (v) => String(v),

      validate: (v) => normalizeBoolean(v) !== null,

      retryMessage: 'Скажіть "так" або "ні".',

      apply: (session, value) => {
        const yes = normalizeBoolean(value) === true;

        if (yes) {
          return {
            session: {
              ...session,
              stepIndex: 999,
            },
            effects: [
              {
                type: 'FEEDING_RECORDED',
                payload: {
                  hiveNumber: session.hiveNumber,
                  syrupLiters: session.data.syrupLiters!,
                },
              },
            ],
          };
        }

        // ❗ якщо ні — повертаємось на початок
        return {
          session: {
            ...session,
            stepIndex: 0,
            data: {},
          },
        };
      },
    },
  ],
};
