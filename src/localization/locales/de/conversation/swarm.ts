import type {ConversationModule} from '../../../conversation/types';

export const swarm: ConversationModule = {
  'swarm.askQueenEmergence': (_params) => 'Чи є виходи маток з маточників?',

  'swarm.askSealedCells': (_params) => 'Чи є печатні маточники?',

  'swarm.askOpenCells': (_params) => 'Чи є відкриті маточники?',

  'swarm.askEggsInCells': (_params) => 'Чи є яйця в маточниках?',
};
