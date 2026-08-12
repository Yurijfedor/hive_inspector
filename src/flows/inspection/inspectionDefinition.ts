import i18n from '../../localization/i18n';

import {ConversationFlow} from '../conversationFlow';
import type {InspectionSession} from './inspectionTypes';

// import {parseNumber} from '../../voice/numberParser';
import {parseQueenBreed} from '../../voice/queenParser';
import {parseYear} from '../../voice/yearParser';

import {createConfirmStep} from '../createConfirmStep';
import {createNumberStep} from '../createNumberStep';
import {createBooleanStep} from '../createBooleanStep';

import {QUEEN_STATUS} from '../../domain/constants/queen';

// import {normalizeBoolean} from '../../domain/normalizers/booleanNormalizer';

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
    createNumberStep(
      'STRENGTH',

      {
        id: 'inspection.askStrength',
      },

      {
        min: 1,
        max: 20,

        retry: {
          id: 'inspection.retryStrength',
        },
      },

      (session, value) => ({
        ...session,

        data: {
          ...session.data,
          strength: value as number,
        },
      }),
    ),

    createConfirmStep(
      'CONFIRM_STRENGTH',

      {
        id: 'inspection.confirmStrength',

        params: (session) => ({
          strength: session.data.strength,
        }),
      },

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
    createNumberStep(
      'BROOD',

      {
        id: 'inspection.askBrood',
      },

      {
        min: 1,
        max: 20,

        retry: {
          id: 'inspection.retryBrood',
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
      'CONFIRM_BROOD',

      {
        id: 'inspection.confirmBrood',

        params: (session) => ({
          broodFrames: session.data.broodFrames,
        }),
      },

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
    createBooleanStep(
      'QUEEN',

      {
        id: 'inspection.askQueen',
      },

      (session, value) => {
        const hasQueen = value as boolean;

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

                hasQueen,
              },
            },
          ],
        };
      },
    ),

    // -------------------------
    // QUEEN BREED
    // -------------------------
    {
      id: 'QUEEN_BREED',

      messages: {
        prompt: {
          id: 'inspection.askQueenBreed',
        },

        retry: {
          id: 'inspection.retryQueenBreed',
        },
      },

      shouldSkip: (session) => {
        // ❌ якщо немає матки
        if (session.data?.queen !== QUEEN_STATUS.PRESENT) {
          return true;
        }

        // ✅ якщо вже введено в цьому flow
        if (session.data?.queenBreed) {
          return false;
        }

        // 🔥 якщо вже є в hiveContext
        if (session.hiveContext?.queen?.breed) {
          return true;
        }

        return false;
      },

      normalize: (v) => {
        const result = parseQueenBreed(v);

        console.log('🐝 QUEEN BREED RAW:', v);
        console.log('🐝 QUEEN BREED PARSED:', result);

        return result;
      },

      validate: (v) => {
        console.log('🐝 QUEEN BREED VALIDATE:', v);
        return v !== null && v !== undefined;
      },

      apply: (session, value) => {
        console.log('🐝 QUEEN BREED APPLY VALUE:', value);
        console.log('🐝 QUEEN BREED SESSION BEFORE:', session);

        if (!value) {
          return session;
        }

        const updatedSession = {
          ...session,

          data: {
            ...session.data,

            queenBreed: value as QueenBreed,
          },
        };

        console.log('🐝 QUEEN BREED SESSION AFTER:', updatedSession);

        return updatedSession;
      },
    },

    // -------------------------
    // CONFIRM QUEEN BREED
    // -------------------------
    createConfirmStep(
      'CONFIRM_QUEEN_BREED',

      {
        id: 'inspection.confirmQueenBreed',

        params: (session) => ({
          queenBreed: i18n.t(`queen:breeds.${session.data.queenBreed}`),
        }),
      },

      (session) => [
        {
          type: 'UPDATE_QUEEN',

          hiveNumber: session.hiveNumber,

          payload: {
            status: QUEEN_STATUS.PRESENT,

            breed: session.data.queenBreed!,
          },
        },
      ],
    ),

    // -------------------------
    // QUEEN YEAR
    // -------------------------
    {
      id: 'QUEEN_YEAR',

      messages: {
        prompt: {
          id: 'inspection.askQueenYear',
        },

        retry: {
          id: 'inspection.retryQueenYear',
        },
      },

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

      normalize: (v, language) => {
        if (!language) {
          return null;
        }

        return parseYear(v, language);
      },

      validate: (v) =>
        typeof v === 'number' && v >= 2020 && v <= new Date().getFullYear(),

      apply: (session, value) => {
        if (typeof value !== 'number') {
          return session;
        }

        return {
          ...session,

          data: {
            ...session.data,

            queenYear: value,
          },
        };
      },
    },

    createConfirmStep(
      'CONFIRM_QUEEN_YEAR',

      {
        id: 'inspection.confirmQueenYear',

        params: (session) => ({
          queenYear: session.data.queenYear,
        }),
      },

      (session) => [
        {
          type: 'UPDATE_QUEEN',

          hiveNumber: session.hiveNumber,

          payload: {
            status: QUEEN_STATUS.PRESENT,

            birthYear: session.data.queenYear!,
          },
        },
      ],
    ),

    // -------------------------
    // HONEY
    // -------------------------
    createNumberStep(
      'HONEY',

      {
        id: 'inspection.askHoney',
      },

      {
        min: 0,
        max: 100,

        retry: {
          id: 'inspection.retryHoney',
        },
      },

      (session, value) => ({
        ...session,

        data: {
          ...session.data,

          honeyKg: value as number,
        },
      }),
    ),

    createConfirmStep(
      'CONFIRM_HONEY',

      {
        id: 'inspection.confirmHoney',

        params: (session) => ({
          honeyKg: session.data.honeyKg,
        }),
      },

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
