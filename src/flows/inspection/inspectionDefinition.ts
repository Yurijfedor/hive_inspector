import {ConversationFlow} from '../conversationFlow';
import {InspectionSession} from './inspectionSession';
import {parseNumber} from '../../voice/numberParser';
import {createConfirmStep} from '../createConfirmStep';

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

    createConfirmStep(
      'CONFIRM_STRENGTH',
      session => `${session.data.strength} рамок сили. Правильно?`,
      session => [
        {
          type: 'STRENGTH_RECORDED',
          payload: {
            hiveNumber: session.hiveNumber,
            strength: session.data.strength!,
          },
        },
      ],
    ),

    {
      id: 'QUEEN',

      question: 'Чи є матка?',

      normalize: v => String(v).toLowerCase(),

      validate: v => v === 'так' || v === 'ні',

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
              type: 'QUEEN_STATUS_UPDATED',
              payload: {
                hiveNumber: session.hiveNumber,
                hasQueen,
              },
            },
          ],
        };
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

    createConfirmStep(
      'CONFIRM_HONEY',
      session => `${session.data.honeyKg} кілограм меду. Правильно?`,
      session => [
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
