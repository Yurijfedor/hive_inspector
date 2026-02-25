import {ConversationFlow} from './conversationFlow';
import {InspectionSession} from '../inspectionSession';
import {InspectionStepId} from '../inspectionFlow';

export const inspectionFlow: ConversationFlow<
  InspectionSession,
  InspectionStepId
> = {
  steps: [
    {
      id: 'STRENGTH',
      question: "Яка сила бджолосім'ї? Назвіть кількість рамок.",
      apply: (session, value) => ({
        ...session,
        data: {
          ...session.data,
          strength: Number(value),
        },
      }),
    },

    {
      id: 'QUEEN',
      question: 'Чи є матка?',
      apply: (session, value) => ({
        ...session,
        data: {
          ...session.data,
          queen: value === 'так' ? 'present' : 'absent',
        },
      }),
    },

    {
      id: 'HONEY',
      question: 'Скільки приблизно кілограмів меду?',
      apply: (session, value) => ({
        ...session,
        data: {
          ...session.data,
          honeyKg: Number(value),
        },
      }),
    },

    {
      id: 'CONFIRM',
      question: 'Підтвердити огляд?',
      apply: (session, value) => {
        // якщо "так" — рухаємось далі
        if (value === true || value === 'так') {
          return session;
        }

        // якщо "ні" — починаємо спочатку
        return {
          ...session,
          stepIndex: 0,
          data: {},
        };
      },
    },
  ],
};
