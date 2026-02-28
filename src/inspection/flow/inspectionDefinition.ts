import {ConversationFlow} from './conversationFlow';
import {InspectionSession} from '../inspectionSession';

export const inspectionFlow: ConversationFlow<InspectionSession> = {
  steps: [
    {
      id: 'STRENGTH',

      question: "Яка сила бджолосім'ї? Назвіть кількість рамок.",

      normalize: v => Number(v),

      validate: v => typeof v === 'number' && !isNaN(v) && v >= 1 && v <= 20,

      retryMessage: 'Назвіть число рамок від 1 до 20.',

      apply: (session, value) => ({
        ...session,
        data: {
          ...session.data,
          strength: value as number,
        },
      }),

      afterAccept: session => [
        {
          type: 'STRENGTH_RECORDED',
          payload: {
            hiveNumber: session.hiveNumber,
            strength: session.data.strength!,
          },
        },
      ],
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

      afterAccept: session => [
        {
          type: 'QUEEN_STATUS_UPDATED',
          payload: {
            hiveNumber: session.hiveNumber,
            hasQueen: session.data.queen === 'present',
          },
        },
      ],
    },

    {
      id: 'HONEY',

      question: 'Скільки приблизно кілограмів меду?',

      normalize: v => {
        const match = String(v).match(/\d+/);
        return match ? Number(match[0]) : NaN;
      },

      validate: v => typeof v === 'number' && !isNaN(v) && v >= 0 && v <= 100,

      retryMessage: 'Назвіть приблизну кількість кілограмів меду числом.',

      apply: (session, value) => ({
        ...session,
        data: {
          ...session.data,
          honeyKg: value as number,
        },
      }),

      afterAccept: session => [
        {
          type: 'HONEY_RECORDED',
          payload: {
            hiveNumber: session.hiveNumber,
            honeyKg: session.data.honeyKg!,
          },
        },
      ],
    },

    {
      id: 'CONFIRM',

      question: 'Підтвердити огляд?',

      normalize: v => String(v).toLowerCase().replace(/[.!?]/g, '').trim(),

      validate: v => ['так', 'ні', 'да', 'yes', 'ага'].includes(v as string),

      retryMessage: 'Скажіть "так" або "ні".',

      apply: (session, value) => {
        const positive = ['так', 'да', 'yes', 'ага'].includes(value as string);

        if (positive) {
          return session;
        }

        // restart inspection
        return {
          ...session,
          stepIndex: 0,
          data: {},
        };
      },

      afterAccept: session => {
        // emit SAVE_INSPECTION only if confirmed
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
