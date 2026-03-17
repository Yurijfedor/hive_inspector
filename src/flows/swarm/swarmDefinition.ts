import {ConversationFlow} from '../conversationFlow';
import {SwarmSession} from './swarmSession';
import {createConfirmStep} from '../createConfirmStep';
import {parseNumber} from '../../voice/numberParser';

export const swarmFlow: ConversationFlow<SwarmSession> = {
  id: 'swarm',

  createSession: (hiveNumber: number) => ({
    hiveNumber,
    stepIndex: 0,
    data: {},
  }),

  steps: [
    // -------------------------
    // SWARM SIGNS
    // -------------------------
    {
      id: 'SWARM_SIGNS',

      question: 'Чи є ознаки роїння?',

      normalize: v => String(v).toLowerCase(),

      validate: v => v === 'так' || v === 'ні',

      retryMessage: 'Скажіть "так" або "ні".',

      apply: (session, value) => ({
        ...session,
        data: {
          ...session.data,
          hasSwarmSigns: value === 'так',
        },
      }),
    },

    createConfirmStep(
      'CONFIRM_SWARM_SIGNS',
      session =>
        session.data.hasSwarmSigns
          ? 'Ознаки роїння є. Правильно?'
          : 'Ознак роїння немає. Правильно?',
      _session => [],
    ),

    // -------------------------
    // QUEEN CELLS
    // -------------------------
    {
      id: 'QUEEN_CELLS',

      question: 'Чи є маточники?',

      normalize: v => String(v).toLowerCase(),

      validate: v => v === 'так' || v === 'ні',

      retryMessage: 'Скажіть "так" або "ні".',

      apply: (session, value) => ({
        ...session,
        data: {
          ...session.data,
          hasQueenCells: value === 'так',
        },
      }),
    },

    createConfirmStep(
      'CONFIRM_QUEEN_CELLS',
      session =>
        session.data.hasQueenCells
          ? 'Маточники є. Правильно?'
          : 'Маточників немає. Правильно?',
      _session => [],
    ),

    // -------------------------
    // COUNT
    // -------------------------
    {
      id: 'QUEEN_CELLS_COUNT',

      question: 'Скільки маточників?',

      normalize: v => parseNumber(String(v)),

      validate: v => typeof v === 'number' && !isNaN(v) && v >= 0 && v <= 50,

      retryMessage: 'Назвіть кількість маточників числом.',

      apply: (session, value) => ({
        ...session,
        data: {
          ...session.data,
          queenCellsCount: value as number,
        },
      }),
    },

    createConfirmStep(
      'CONFIRM_QUEEN_CELLS_COUNT',
      session => `${session.data.queenCellsCount} маточників. Правильно?`,
      _session => [],
    ),

    // -------------------------
    // FINAL CONFIRM
    // -------------------------
    {
      id: 'CONFIRM',

      question: 'Підтвердити дані по роїнню?',

      normalize: v => String(v).toLowerCase().trim(),

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

      afterAccept: session => {
        if (
          session.data.hasSwarmSigns !== undefined &&
          session.data.hasQueenCells !== undefined
        ) {
          return [
            {
              type: 'SWARM_RECORDED',
              payload: {
                hiveNumber: session.hiveNumber,
                ...session.data,
              },
            },
          ];
        }

        return [];
      },
    },
  ],
};
