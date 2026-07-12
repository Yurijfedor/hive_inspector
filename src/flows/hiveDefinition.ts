import {ConversationFlow} from './conversationFlow';
import {parseHiveNumber} from '../voice/hiveParser';

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

      // prompt: {
      //   id: 'inspection.askHive',
      // },

      normalize: (v) => parseHiveNumber(String(v)),

      validate: (v) =>
        typeof v === 'number' && !isNaN(v) && v >= 1 && v <= 1000,

      // retryMessage: 'Я не зрозумів номер. Скажіть номер ще раз.',

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

      // question: (session) =>
      //   `Вулик ${session.hiveNumber}? Скажіть "так" або "ні".`,

      normalize: (v) => String(v).toLowerCase().trim(),

      // validate: (v) => ['так', 'ні'].includes(v as string),

      // retryMessage: 'Скажіть "так" або "ні".',

      apply: (session, value) => {
        if (value === 'так') {
          return session;
        }

        return {
          ...session,
          hiveNumber: undefined,
          stepIndex: -1,
        };
      },

      runtimeEffects: (session, value) => {
        if (value !== 'так') {
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
