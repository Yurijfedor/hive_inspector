import type {ConversationModule} from '../../../conversation/types';

export const swarm: ConversationModule = {
  'swarm.askQueenEmergence': (_params) =>
    'Sind bereits Königinnen aus den Weiselzellen geschlüpft?',

  'swarm.askSealedCells': (_params) => 'Gibt es verdeckelte Weiselzellen?',

  'swarm.askOpenCells': (_params) => 'Gibt es offene Weiselzellen?',

  'swarm.askEggsInCells': (_params) => 'Gibt es Eier in den Weiselzellen?',
};
