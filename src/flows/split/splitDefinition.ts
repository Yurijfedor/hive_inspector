import {ConversationFlow} from '../conversationFlow';
import {SplitSession} from './splitSession';
import {parseNumber} from '../../voice/numberParser';
import {createConfirmStep} from '../createConfirmStep';

import {normalizeBoolean} from '../../domain/normalizers/booleanNormalizer';

export const splitFlow: ConversationFlow<SplitSession> = {
  id: 'split',

  createSession: (hiveNumber: number) => ({
    hiveNumber,
    stepIndex: 0,
    data: {},
  }),

  steps: [
    // -------------------------
    // 1. IS SPLIT
    // -------------------------
    {
      id: 'IS_SPLIT',

      question: 'Чи є ця сімʼя відводком?',

      normalize: (v) => String(v),

      validate: (v) => normalizeBoolean(v) !== null,

      retryMessage: 'Скажіть "так" або "ні".',

      apply: (session, value) => {
        const yes = normalizeBoolean(value) === true;

        if (yes) {
          const data = {
            ...session.data,
            isSplit: true,
          };

          return {
            session: {
              ...session,
              data,
              stepIndex: 999,
            },
            effects: [
              {
                type: 'SPLIT_RECORDED',
                payload: {
                  hiveNumber: session.hiveNumber,
                  ...data,
                },
              },
            ],
          };
        }

        return {
          ...session,
          data: {
            ...session.data,
            isSplit: false,
          },
        };
      },
    },

    // -------------------------
    // 2. USE FOR SPLITS
    // -------------------------
    {
      id: 'USE_FOR_SPLITS',

      question: 'Чи хочете використати цю сімʼю для формування відводків?',

      normalize: (v) => String(v),

      validate: (v) => normalizeBoolean(v) !== null,

      retryMessage: 'Скажіть "так" або "ні".',

      apply: (session, value) => {
        const yes = normalizeBoolean(value) === true;

        if (!yes) {
          const data = {
            ...session.data,
            usedForSplits: false,
          };

          return {
            session: {
              ...session,
              data,
              stepIndex: 999,
            },
            effects: [
              {
                type: 'SPLIT_RECORDED',
                payload: {
                  hiveNumber: session.hiveNumber,
                  ...data,
                },
              },
            ],
          };
        }

        return {
          ...session,
          data: {
            ...session.data,
            usedForSplits: true,
          },
        };
      },
    },

    // -------------------------
    // 3. BROOD FRAMES
    // -------------------------
    {
      id: 'BROOD_FRAMES',

      question: 'Скільки рамок розплоду потрібно відібрати?',

      normalize: (v) => parseNumber(String(v)),

      validate: (v) => typeof v === 'number' && !isNaN(v) && v >= 0 && v <= 20,

      retryMessage: 'Назвіть число від 0 до 20.',

      apply: (session, value) => {
        const broodFrames = value as number;

        return {
          ...session,
          data: {
            ...session.data,
            broodFrames,
          },
        };
      },
    },

    createConfirmStep(
      'CONFIRM_BROOD_FRAMES',

      (session) => `${session.data.broodFrames} рамки розплоду. Правильно?`,

      () => [],
    ),

    // -------------------------
    // 4. FOOD FRAMES
    // -------------------------
    {
      id: 'FOOD_FRAMES',

      question: 'Скільки кормових рамок потрібно відібрати?',

      normalize: (v) => parseNumber(String(v)),

      validate: (v) => typeof v === 'number' && !isNaN(v) && v >= 0 && v <= 20,

      retryMessage: 'Назвіть число від 0 до 20.',

      apply: (session, value) => ({
        ...session,
        data: {
          ...session.data,
          foodFrames: value as number,
        },
      }),
    },

    createConfirmStep(
      'CONFIRM_FOOD_FRAMES',

      (session) => `${session.data.foodFrames} кормові рамки. Правильно?`,

      (session) => [
        {
          type: 'SPLIT_RECORDED',
          payload: {
            hiveNumber: session.hiveNumber,
            isSplit: session.data.isSplit,
            usedForSplits: session.data.usedForSplits,
            broodFrames: session.data.broodFrames,
            foodFrames: session.data.foodFrames,
          },
        },
      ],
    ),
  ],
};
