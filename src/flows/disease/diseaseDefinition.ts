import {ConversationFlow} from '../conversationFlow';
import {DiseaseSession} from './diseaseSession';

const YES = ['так', 'да', 'yes', 'ага'];
const NO = ['ні', 'нет', 'no'];

const isYes = (v: string) => YES.some(word => v.includes(word));
const isNo = (v: string) => NO.some(word => v.includes(word));

const normalizeText = (v: unknown) => String(v).toLowerCase().trim();

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
                  disease: 'NOSEMA',
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
                  disease: 'VARROA_OR_DWV',
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
                  disease: 'VARROA',
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
                disease: yes ? 'BROOD_DISEASE' : 'NONE',
                ...data,
              },
            },
          ],
        };
      },
    },
  ],
};
