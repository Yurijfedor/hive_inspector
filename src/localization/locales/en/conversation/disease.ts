import type {ConversationModule} from '../../../conversation/types';

export const disease: ConversationModule = {
  'disease.askDiarrhea': (_params) =>
    'Are there any signs of diarrhea on the frames or hive walls?',

  'disease.askDeformedWings': (_params) =>
    'Are there any bees with deformed wings?',

  'disease.askMitesVisible': (_params) =>
    'Are any mites visible on the bees or on the bottom board?',

  'disease.askWeakBrood': (_params) => 'Is there any spotty or weak brood?',
};
