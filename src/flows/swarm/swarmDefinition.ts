import {ConversationFlow} from '../conversationFlow';
import {SwarmSession} from './swarmSession';

const YES = ['так', 'да', 'yes', 'ага'];
const NO = ['ні', 'нет', 'no'];

const isYes = (v: string) => YES.some(word => v.includes(word));

const isNo = (v: string) => NO.some(word => v.includes(word));

const normalizeText = (v: unknown) => String(v).toLowerCase().trim();

export const swarmFlow: ConversationFlow<SwarmSession> = {
  id: 'swarm',

  createSession: (hiveNumber: number) => ({
    hiveNumber,
    stepIndex: 0,
    data: {},
  }),

  steps: [
    // -------------------------
    // 1. QUEEN EMERGENCE
    // -------------------------
    {
      id: 'QUEEN_EMERGED',

      question: 'Чи є виходи маток з маточників?',

      normalize: normalizeText,

      validate: v => {
        const val = normalizeText(v);
        return isYes(val) || isNo(val);
      },

      retryMessage: 'Скажіть "так" або "ні".',

      apply: (session, value) => {
        const val = normalizeText(value);
        const yes = isYes(val);

        if (yes) {
          const data = {
            ...session.data,
            queenEmergence: true,
          };

          return {
            session: {
              ...session,
              data,
              stepIndex: 999,
            },
            effects: [
              {
                type: 'SWARM_RECORDED',
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
            queenEmergence: false,
          },
        };
      },
    },

    // -------------------------
    // 2. SEALED CELLS
    // -------------------------
    {
      id: 'SEALED_CELLS',

      question: 'Чи є печатні маточники?',

      normalize: normalizeText,

      validate: v => {
        const val = normalizeText(v);
        return isYes(val) || isNo(val);
      },

      retryMessage: 'Скажіть "так" або "ні".',

      apply: (session, value) => {
        const val = normalizeText(value);
        const yes = isYes(val);

        if (yes) {
          const data = {
            ...session.data,
            sealedCells: true,
          };

          return {
            session: {
              ...session,
              data,
              stepIndex: 999,
            },
            effects: [
              {
                type: 'SWARM_RECORDED',
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
            sealedCells: false,
          },
        };
      },
    },

    // -------------------------
    // 3. OPEN CELLS
    // -------------------------
    {
      id: 'OPEN_CELLS',

      question: 'Чи є відкриті маточники?',

      normalize: normalizeText,

      validate: v => {
        const val = normalizeText(v);
        return isYes(val) || isNo(val);
      },

      retryMessage: 'Скажіть "так" або "ні".',

      apply: (session, value) => {
        const val = normalizeText(value);
        const yes = isYes(val);

        if (yes) {
          const data = {
            ...session.data,
            openCells: true,
          };

          return {
            session: {
              ...session,
              data,
              stepIndex: 999,
            },
            effects: [
              {
                type: 'SWARM_RECORDED',
                payload: {
                  hiveNumber: session.hiveNumber,
                  ...data,
                },
              },
            ],
          };
        }

        return {
          session: {
            ...session,
            data: {
              ...session.data,
              openCells: false,
            },
          },
        };
      },
    },

    // -------------------------
    // 4. EGGS IN CELLS
    // -------------------------
    {
      id: 'EGGS_IN_CELLS',

      question: 'Чи є яйця в маточниках?',

      normalize: normalizeText,

      validate: v => {
        const val = normalizeText(v);
        return isYes(val) || isNo(val);
      },

      retryMessage: 'Скажіть "так" або "ні".',

      apply: (session, value) => {
        const val = normalizeText(value);
        const yes = isYes(val);

        const data = {
          ...session.data,
          eggsInCells: yes,
        };

        return {
          session: {
            ...session,
            data,
            stepIndex: 999,
          },
          effects: [
            {
              type: 'SWARM_RECORDED',
              payload: {
                hiveNumber: session.hiveNumber,
                ...data,
              },
            },
          ],
        };
      },
    },
  ],
};
