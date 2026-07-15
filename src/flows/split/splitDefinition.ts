import {ConversationFlow} from '../conversationFlow';
import {SplitSession} from './splitSession';
// import {parseNumber} from '../../voice/numberParser';
import {createConfirmStep} from '../createConfirmStep';
import {createNumberStep} from '../createNumberStep';
import {createBooleanStep} from '../createBooleanStep';

// import {normalizeBoolean} from '../../domain/normalizers/booleanNormalizer';

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
    createBooleanStep(
      'IS_SPLIT',

      {
        id: 'split.askIsSplit',
      },

      (session, value) => {
        const yes = value as boolean;

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
    ),

    // -------------------------
    // 2. USE FOR SPLITS
    // -------------------------
    createBooleanStep(
      'USE_FOR_SPLITS',

      {
        id: 'split.askUseForSplits',
      },

      (session, value) => {
        const yes = value as boolean;

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
    ),
    // -------------------------
    // 3. BROOD FRAMES
    // -------------------------
    createNumberStep(
      'BROOD_FRAMES',

      {
        id: 'split.askBroodFrames',
      },

      {
        min: 0,
        max: 20,

        retry: {
          id: 'split.retryBroodFrames',
        },
      },

      (session, value) => ({
        ...session,

        data: {
          ...session.data,
          broodFrames: value as number,
        },
      }),
    ),

    createConfirmStep(
      'CONFIRM_BROOD_FRAMES',

      {
        id: 'split.confirmBroodFrames',

        params: (session) => ({
          broodFrames: session.data.broodFrames,
        }),
      },

      () => [],
    ),

    // -------------------------
    // 4. FOOD FRAMES
    // -------------------------
    createNumberStep(
      'FOOD_FRAMES',

      {
        id: 'split.askFoodFrames',
      },

      {
        min: 0,
        max: 20,

        retry: {
          id: 'split.retryFoodFrames',
        },
      },

      (session, value) => ({
        ...session,

        data: {
          ...session.data,
          foodFrames: value as number,
        },
      }),
    ),
    createConfirmStep(
      'CONFIRM_FOOD_FRAMES',

      {
        id: 'split.confirmFoodFrames',

        params: (session) => ({
          foodFrames: session.data.foodFrames,
        }),
      },

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
