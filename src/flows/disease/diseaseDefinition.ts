import {ConversationFlow} from '../conversationFlow';
import {DiseaseSession} from './diseaseSession';

import {normalizeBoolean} from '../../domain/normalizers/booleanNormalizer';

import {DISEASE_TYPES} from '../../domain/constants/disease';

export const diseaseFlow: ConversationFlow<DiseaseSession> = {
  id: 'disease',

  createSession: (hiveNumber: number) => ({
    hiveNumber,
    stepIndex: 0,
    data: {},
  }),

  steps: [
    // -------------------------
    // 1. DIARRHEA (NOSEMA)
    // -------------------------
    {
      id: 'DIARRHEA',

      question: 'Чи є сліди поносу на рамках або стінках?',

      normalize: (v) => String(v),

      validate: (v) => normalizeBoolean(v) !== null,

      retryMessage: 'Скажіть "так" або "ні".',

      apply: (session, value) => {
        const yes = normalizeBoolean(value) === true;

        if (yes) {
          const data = {
            ...session.data,
            diarrhea: true,
          };

          return {
            session: {
              ...session,
              data,
              stepIndex: 999,
            },
            effects: [
              {
                type: 'DISEASE_RECORDED',
                payload: {
                  hiveNumber: session.hiveNumber,

                  disease: DISEASE_TYPES.NOSEMA,

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
            diarrhea: false,
          },
        };
      },
    },

    // -------------------------
    // 2. DEFORMED WINGS
    // -------------------------
    {
      id: 'DEFORMED_WINGS',

      question: 'Чи є бджоли з деформованими крилами?',

      normalize: (v) => String(v),

      validate: (v) => normalizeBoolean(v) !== null,

      retryMessage: 'Скажіть "так" або "ні".',

      apply: (session, value) => {
        const yes = normalizeBoolean(value) === true;

        if (yes) {
          const data = {
            ...session.data,
            deformedWings: true,
          };

          return {
            session: {
              ...session,
              data,
              stepIndex: 999,
            },
            effects: [
              {
                type: 'DISEASE_RECORDED',
                payload: {
                  hiveNumber: session.hiveNumber,

                  disease: DISEASE_TYPES.VARROA_OR_DWV,

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
            deformedWings: false,
          },
        };
      },
    },

    // -------------------------
    // 3. MITES
    // -------------------------
    {
      id: 'MITES_VISIBLE',

      question: 'Чи видно кліщів на бджолах або в піддоні?',

      normalize: (v) => String(v),

      validate: (v) => normalizeBoolean(v) !== null,

      retryMessage: 'Скажіть "так" або "ні".',

      apply: (session, value) => {
        const yes = normalizeBoolean(value) === true;

        if (yes) {
          const data = {
            ...session.data,
            mitesVisible: true,
          };

          return {
            session: {
              ...session,
              data,
              stepIndex: 999,
            },
            effects: [
              {
                type: 'DISEASE_RECORDED',
                payload: {
                  hiveNumber: session.hiveNumber,

                  disease: DISEASE_TYPES.VARROA,

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
            mitesVisible: false,
          },
        };
      },
    },

    // -------------------------
    // 4. BROOD PROBLEMS
    // -------------------------
    {
      id: 'WEAK_BROOD',

      question: 'Чи є дірявий або слабкий розплід?',

      normalize: (v) => String(v),

      validate: (v) => normalizeBoolean(v) !== null,

      retryMessage: 'Скажіть "так" або "ні".',

      apply: (session, value) => {
        const yes = normalizeBoolean(value) === true;

        const data = {
          ...session.data,
          weakBrood: yes,
        };

        return {
          session: {
            ...session,
            data,
            stepIndex: 999,
          },
          effects: [
            {
              type: 'DISEASE_RECORDED',
              payload: {
                hiveNumber: session.hiveNumber,

                disease: yes ? DISEASE_TYPES.BROOD_DISEASE : DISEASE_TYPES.NONE,

                ...data,
              },
            },
          ],
        };
      },
    },
  ],
};
