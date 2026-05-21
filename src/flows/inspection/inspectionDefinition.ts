import {ConversationFlow} from '../conversationFlow';
import {InspectionSession} from './inspectionSession';

import {parseNumber} from '../../voice/numberParser';
import {parseQueenBreed} from '../../voice/queenParser';
import {parseYear} from '../../voice/yearParser';

import {createConfirmStep} from '../createConfirmStep';

import {QUEEN_STATUS} from '../../domain/constants/queen';

import {normalizeBoolean} from '../../domain/normalizers/booleanNormalizer';

import type {QueenBreed} from '../../types/queen';

export const inspectionFlow: ConversationFlow<InspectionSession> = {
  id: 'inspection',

  createSession: (hiveNumber: number) => ({
    hiveNumber,
    stepIndex: 0,
    data: {},
  }),

  steps: [
    // -------------------------
    // STRENGTH
    // -------------------------
    {
      id: 'STRENGTH',

      question: "Яка сила бджолосім'ї? Назвіть кількість рамок.",

      normalize: (v) => parseNumber(String(v)),

      validate: (v) => typeof v === 'number' && !isNaN(v) && v >= 1 && v <= 20,

      retryMessage: 'Назвіть число рамок від 1 до 20.',

      apply: (session, value) => ({
        ...session,
        data: {
          ...session.data,
          strength: value as number,
        },
      }),
    },

    createConfirmStep(
      'CONFIRM_STRENGTH',

      (session) => `${session.data.strength} рамок сили. Правильно?`,

      (session) => [
        {
          type: 'STRENGTH_RECORDED',
          payload: {
            hiveNumber: session.hiveNumber,
            strength: session.data.strength!,
          },
        },
      ],
    ),

    // -------------------------
    // BROOD
    // -------------------------
    {
      id: 'BROOD',

      question: 'Скільки рамок з розплодом?',

      normalize: (v) => parseNumber(String(v)),

      validate: (v) => typeof v === 'number' && !isNaN(v) && v >= 1 && v <= 20,

      retryMessage: 'Назвіть число рамок з розплодом.',

      apply: (session, value) => ({
        ...session,
        data: {
          ...session.data,
          broodFrames: value as number,
        },
      }),
    },

    createConfirmStep(
      'CONFIRM_BROOD',

      (session) => `${session.data.broodFrames} рамок розплоду. Правильно?`,

      (session) => [
        {
          type: 'BROOD_RECORDED',
          payload: {
            hiveNumber: session.hiveNumber,
            broodFrames: session.data.broodFrames!,
          },
        },
      ],
    ),

    // -------------------------
    // QUEEN
    // -------------------------
    {
      id: 'QUEEN',

      question: 'Чи є матка?',

      normalize: (v) => String(v),

      validate: (v) => normalizeBoolean(v) !== null,

      retryMessage: 'Скажіть "так" або "ні".',

      apply: (session, value) => {
        const hasQueen = normalizeBoolean(value) === true;

        const status = hasQueen ? QUEEN_STATUS.PRESENT : QUEEN_STATUS.ABSENT;

        return {
          session: {
            ...session,
            data: {
              ...session.data,
              queen: status,
            },
          },

          effects: [
            {
              type: 'UPDATE_QUEEN',

              hiveNumber: session.hiveNumber,

              payload: {
                status,
              },
            },

            {
              type: 'QUEEN_STATUS_UPDATED',

              payload: {
                hiveNumber: session.hiveNumber,

                hasQueen: status === QUEEN_STATUS.PRESENT,
              },
            },
          ],
        };
      },
    },

    // -------------------------
    // QUEEN BREED
    // -------------------------
    {
      id: 'QUEEN_BREED',

      question: 'Яка порода матки? Карніка, бакфаст чи місцева?',

      shouldSkip: (session) => {
        // ❌ якщо немає матки
        if (session.data?.queen !== QUEEN_STATUS.PRESENT) {
          return true;
        }

        // ✅ якщо вже ввели в цьому flow
        if (session.data?.queenBreed) {
          return false;
        }

        // 🔥 якщо вже є в hiveContext
        if (session.hiveContext?.queen?.breed) {
          return true;
        }

        return false;
      },

      normalize: (v) => parseQueenBreed(v),

      validate: (v) => v !== null,

      retryMessage: 'Скажіть: карніка, бакфаст або місцева.',

      apply: (session, value) => {
        if (!value) {
          return session;
        }

        return {
          session: {
            ...session,

            data: {
              ...session.data,

              queenBreed: value as QueenBreed,
            },
          },

          effects: [
            {
              type: 'UPDATE_QUEEN',

              hiveNumber: session.hiveNumber,

              payload: {
                status: QUEEN_STATUS.PRESENT,

                breed: value as QueenBreed,
              },
            },
          ],
        };
      },
    },

    // -------------------------
    // QUEEN YEAR
    // -------------------------
    {
      id: 'QUEEN_YEAR',

      question: 'Якого року матка?',

      shouldSkip: (session) => {
        if (session.data?.queen !== QUEEN_STATUS.PRESENT) {
          return true;
        }

        if (session.data?.queenYear) {
          return false;
        }

        if (session.hiveContext?.queen?.birthYear) {
          return true;
        }

        return false;
      },

      normalize: (v) => parseYear(v),

      validate: (v) =>
        typeof v === 'number' && v >= 2020 && v <= new Date().getFullYear(),

      retryMessage: 'Назвіть рік, наприклад 2024.',

      apply: (session, value) => {
        if (typeof value !== 'number') {
          return session;
        }

        return {
          session: {
            ...session,

            data: {
              ...session.data,

              queenYear: value,
            },
          },

          effects: [
            {
              type: 'UPDATE_QUEEN',

              hiveNumber: session.hiveNumber,

              payload: {
                status: QUEEN_STATUS.PRESENT,

                birthYear: value,
              },
            },
          ],
        };
      },
    },

    // -------------------------
    // HONEY
    // -------------------------
    {
      id: 'HONEY',

      question: 'Скільки приблизно кілограмів меду?',

      normalize: (v) => parseNumber(String(v)),

      validate: (v) => typeof v === 'number' && !isNaN(v) && v >= 0 && v <= 100,

      retryMessage: 'Назвіть приблизну кількість кілограмів меду числом.',

      apply: (session, value) => ({
        ...session,

        data: {
          ...session.data,

          honeyKg: value as number,
        },
      }),
    },

    createConfirmStep(
      'CONFIRM_HONEY',

      (session) => `${session.data.honeyKg} кілограм меду. Правильно?`,

      (session) => [
        {
          type: 'HONEY_RECORDED',

          payload: {
            hiveNumber: session.hiveNumber,

            honeyKg: session.data.honeyKg!,
          },
        },

        {
          type: 'SAVE_INSPECTION',

          payload: {
            hiveNumber: session.hiveNumber,
          },
        },
      ],
    ),
  ],
};
