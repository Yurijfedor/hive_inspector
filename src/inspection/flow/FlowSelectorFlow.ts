import {ConversationFlow} from './conversationFlow';

export const FlowSelectorFlow: ConversationFlow<any> = {
  id: 'flow-selector',

  createSession() {
    return {
      stepIndex: 0,
    };
  },

  steps: [
    {
      id: 'select-flow',

      question: 'Слухаю. Скажіть: огляд або годівля.',

      apply(session, text) {
        const t = String(text).toLowerCase();

        if (t.includes('огляд')) {
          return {
            type: 'ACCEPT',
            session,
            effects: [
              {
                type: 'START_FLOW',
                flowId: 'inspection',
              },
            ],
          };
        }

        if (t.includes('год')) {
          return {
            type: 'ACCEPT',
            session,
            effects: [
              {
                type: 'START_FLOW',
                flowId: 'feeding',
              },
            ],
          };
        }

        return {
          type: 'INVALID',
          message: 'Скажіть: огляд або годівля.',
          session,
        };
      },
    },
  ],
};
