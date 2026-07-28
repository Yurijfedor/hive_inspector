import {ConversationFlow} from './conversationFlow';
import {parseHiveNumber} from '../voice/hiveParser';
import {normalizeBoolean} from '../domain/normalizers/booleanNormalizer';

export interface HiveSession {
  stepIndex: number;
  hiveNumber?: number;
}

export const hiveSelectionFlow: ConversationFlow<HiveSession> = {
  id: 'hive',

  createSession: () => ({
    stepIndex: 0,
  }),

  steps: [
    {
      id: 'HIVE_NUMBER',

      messages: {
        prompt: {
          id: 'inspection.askHive',
        },
        retry: {
          id: 'inspection.retryHive',
        },
      },

      normalize: (v) => parseHiveNumber(String(v)),

      validate: (v) =>
        typeof v === 'number' && !isNaN(v) && v >= 1 && v <= 1000,

      apply: (session, value) => ({
        ...session,
        hiveNumber: value as number,
      }),
    },

    {
      id: 'CONFIRM',

      messages: {
        prompt: {
          id: 'hive.confirm',

          params: (session) => ({
            hiveNumber: session.hiveNumber,
          }),
        },
        retry: {
          id: 'common.retryYesNo',
        },
      },

      normalize: normalizeBoolean,

      apply: (session, value) => {
        if (value === true) {
          return session;
        }

        return {
          ...session,
          hiveNumber: undefined,
          stepIndex: -1,
        };
      },

      runtimeEffects: (session, value) => {
        if (value !== true) {
          return [];
        }

        return [
          {
            type: 'REPLACE_FLOW',
            flowId: 'inspection',
            args: [session.hiveNumber],
          },
        ];
      },
    },
  ],
};
