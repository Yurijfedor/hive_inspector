import type {ConversationModule} from '../../../conversation/types';

export const swarm: ConversationModule = {
  'swarm.askQueenEmergence': (_params) =>
    'Have any queens emerged from the queen cells?',

  'swarm.askSealedCells': (_params) => 'Are there any sealed queen cells?',

  'swarm.askOpenCells': (_params) => 'Are there any open queen cells?',

  'swarm.askEggsInCells': (_params) => 'Are there any eggs in the queen cells?',
};
