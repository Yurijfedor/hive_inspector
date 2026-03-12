import {ConversationFlow} from './conversationFlow';

export const FlowSelectorFlow: ConversationFlow<any> = {
  id: 'flow-selector',

  createSession() {
    return {
      stepIndex: 0,
      nextFlow: null,
    };
  },

  steps: [
    {
      id: 'select-flow',

      question: 'Слухаю. Скажіть: огляд або годівля.',

      apply(session, text) {
        const t = String(text).toLowerCase();

        if (t.includes('огляд')) {
          session.nextFlow = 'inspection';
          return session;
        }

        if (t.includes('год')) {
          session.nextFlow = 'feeding';
          return session;
        }

        throw new Error('INVALID');
      },

      runtimeEffects(session) {
        if (session.nextFlow === 'inspection') {
          return [
            {
              type: 'REPLACE_FLOW',
              flowId: 'inspection',
            },
          ];
        }

        if (session.nextFlow === 'feeding') {
          return [
            {
              type: 'REPLACE_FLOW',
              flowId: 'feeding',
            },
          ];
        }

        return [];
      },
    },
  ],
};
