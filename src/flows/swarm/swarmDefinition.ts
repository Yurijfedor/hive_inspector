import {ConversationFlow} from '../conversationFlow';
import {SwarmSession} from './swarmSession';
import {createBooleanStep} from '../createBooleanStep';

// import {normalizeBoolean} from '../../domain/normalizers/booleanNormalizer';

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
    createBooleanStep(
      'QUEEN_EMERGED',

      {
        id: 'swarm.askQueenEmergence',
      },

      (session, value) => {
        const yes = value as boolean;

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
    ),
    // -------------------------
    // 2. SEALED CELLS
    // -------------------------
    createBooleanStep(
      'SEALED_CELLS',

      {
        id: 'swarm.askSealedCells',
      },

      (session, value) => {
        const yes = value as boolean;

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
    ),

    // -------------------------
    // 3. OPEN CELLS
    // -------------------------
    createBooleanStep(
      'OPEN_CELLS',

      {
        id: 'swarm.askOpenCells',
      },

      (session, value) => {
        const yes = value as boolean;

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
    ),

    // -------------------------
    // 4. EGGS IN CELLS
    // -------------------------
    createBooleanStep(
      'EGGS_IN_CELLS',

      {
        id: 'swarm.askEggsInCells',
      },

      (session, value) => {
        const yes = value as boolean;

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
    ),
  ],
};
