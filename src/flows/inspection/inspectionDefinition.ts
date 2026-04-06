import {ConversationFlow} from '../conversationFlow';
import {InspectionSession} from './inspectionSession';
import {parseNumber} from '../../voice/numberParser';
import {parseQueenBreed} from '../../voice/queenParser';
import {parseYear} from '../../voice/yearParser';
import {createConfirmStep} from '../createConfirmStep';

const QUEEN_BREEDS = ['карніка', 'бакфаст', 'місцева', 'невідомо'] as const;

type QueenBreed = (typeof QUEEN_BREEDS)[number];

function isQueenBreed(v: unknown): v is QueenBreed {
  return typeof v === 'string' && QUEEN_BREEDS.includes(v as QueenBreed);
}

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
    // QUEEN
    // -------------------------
    {
      id: 'QUEEN',

      question: 'Чи є матка?',

      normalize: (v) => String(v).toLowerCase(),

      validate: (v) => v === 'так' || v === 'ні',

      retryMessage: 'Скажіть "так" або "ні".',

      apply: (session, value) => {
        const hasQueen = value === 'так';
        const status = hasQueen ? 'present' : 'absent';

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
        if (session.data?.queen !== 'present') return true;

        // ✅ якщо вже ввели в цьому flow → не skip
        if (session.data?.queenBreed) return false;

        // 🔥 якщо є в Firebase → skip
        if (session.hiveContext?.queen?.breed) return true;

        return false;
      },

      normalize: (v) => parseQueenBreed(v),

      validate: (v) => v !== null,

      retryMessage: 'Скажіть: карніка, бакфаст або місцева.',

      apply: (session, value) => {
        if (!isQueenBreed(value)) {
          return session;
        }

        return {
          session: {
            ...session,
            data: {
              ...session.data,
              queenBreed: value,
            },
          },
          effects: [
            {
              type: 'UPDATE_QUEEN',
              hiveNumber: session.hiveNumber,
              payload: {
                status: 'present',
                breed: value,
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
        if (session.data?.queen !== 'present') return true;

        if (session.data?.queenYear) return false;

        if (session.hiveContext?.queen?.birthYear) return true;

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
                status: 'present',
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
