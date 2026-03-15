import {ConversationFlow} from './conversationFlow';
import {InspectionSession} from '../inspectionSession';
import {parseNumber} from '../../voice/numberParser';

export const inspectionFlow: ConversationFlow<InspectionSession> = {
  id: 'inspection',

  createSession: (hiveNumber: number) => ({
    hiveNumber,
    stepIndex: 0,
    data: {},
  }),

  steps: [
    {
      id: 'STRENGTH',

      question: "Яка сила бджолосім'ї? Назвіть кількість рамок.",

      normalize: v => parseNumber(String(v)),

      validate: v => typeof v === 'number' && !isNaN(v) && v >= 1 && v <= 20,

      retryMessage: 'Назвіть число рамок від 1 до 20.',

      apply: (session, value) => ({
        ...session,
        data: {
          ...session.data,
          strength: value as number,
        },
      }),
    },

    {
      id: 'CONFIRM_STRENGTH',

      question: session => `${session.data.strength} рамок сили. Правильно?`,

      normalize: v => String(v).toLowerCase().trim(),

      validate: v => ['так', 'ні'].includes(v as string),

      retryMessage: 'Скажіть "так" або "ні".',

      apply: (session, value) => {
        if (value === 'так') return session;

        return {
          ...session,
          stepIndex: session.stepIndex - 2,
        };
      },

      afterAccept: (session, value) => {
        if (value !== 'так') return [];

        return [
          {
            type: 'STRENGTH_RECORDED',
            payload: {
              hiveNumber: session.hiveNumber,
              strength: session.data.strength!,
            },
          },
        ];
      },
    },

    {
      id: 'QUEEN',

      question: 'Чи є матка?',

      normalize: v => String(v).toLowerCase(),

      validate: v => v === 'так' || v === 'ні',

      retryMessage: 'Скажіть "так" або "ні".',

      apply: (session, value) => ({
        ...session,
        data: {
          ...session.data,
          queen: value === 'так' ? 'present' : 'absent',
        },
      }),
    },

    {
      id: 'CONFIRM_QUEEN',

      question: session =>
        session.data.queen === 'present'
          ? 'Матка є. Правильно?'
          : 'Матки немає. Правильно?',

      normalize: v => String(v).toLowerCase().trim(),

      validate: v => ['так', 'ні'].includes(v as string),

      retryMessage: 'Скажіть "так" або "ні".',

      apply: (session, value) => {
        if (value === 'так') return session;

        return {
          ...session,
          stepIndex: session.stepIndex - 2,
        };
      },

      afterAccept: (session, value) => {
        if (value !== 'так') return [];

        return [
          {
            type: 'QUEEN_STATUS_UPDATED',
            payload: {
              hiveNumber: session.hiveNumber,
              hasQueen: session.data.queen === 'present',
            },
          },
        ];
      },
    },

    {
      id: 'HONEY',

      question: 'Скільки приблизно кілограмів меду?',

      normalize: v => parseNumber(String(v)),

      validate: v => typeof v === 'number' && !isNaN(v) && v >= 0 && v <= 100,

      retryMessage: 'Назвіть приблизну кількість кілограмів меду числом.',

      apply: (session, value) => ({
        ...session,
        data: {
          ...session.data,
          honeyKg: value as number,
        },
      }),
    },

    {
      id: 'CONFIRM_HONEY',

      question: session => `${session.data.honeyKg} кілограм меду. Правильно?`,

      normalize: v => String(v).toLowerCase().trim(),

      validate: v => ['так', 'ні'].includes(v as string),

      retryMessage: 'Скажіть "так" або "ні".',

      apply: (session, value) => {
        if (value === 'так') return session;

        return {
          ...session,
          stepIndex: session.stepIndex - 2,
        };
      },

      afterAccept: (session, value) => {
        if (value !== 'так') return [];

        return [
          {
            type: 'HONEY_RECORDED',
            payload: {
              hiveNumber: session.hiveNumber,
              honeyKg: session.data.honeyKg!,
            },
          },
        ];
      },
    },

    {
      id: 'CONFIRM',

      question: 'Підтвердити огляд?',

      normalize: v => String(v).toLowerCase().replace(/[.!?]/g, '').trim(),

      validate: v => ['так', 'ні', 'да', 'yes', 'ага'].includes(v as string),

      retryMessage: 'Скажіть "так" або "ні".',

      apply: (session, value) => {
        const positive = ['так', 'да', 'yes', 'ага'].includes(value as string);

        if (!positive) {
          return {
            ...session,
            stepIndex: 0,
            data: {},
          };
        }

        return {
          ...session,
          stepIndex: 999,
        };
      },

      afterAccept: (session, value) => {
        const positive = ['так', 'да', 'yes', 'ага'].includes(value as string);

        if (!positive) return [];

        if (
          session.data.strength !== undefined &&
          session.data.honeyKg !== undefined
        ) {
          return [
            {
              type: 'SAVE_INSPECTION',
              payload: {
                hiveNumber: session.hiveNumber,
              },
            },
          ];
        }

        return [];
      },
    },
  ],
};
