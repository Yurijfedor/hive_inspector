import type {ConversationModule} from '../../../conversation/types';

export const inspection: ConversationModule = {
  'inspection.askHive': (_params) =>
    'Say the hive number, or say “stop inspection”.',

  'inspection.retryHive': (_params) =>
    "I didn't understand the hive number. Please say it again.",

  'inspection.confirmStrength': (params) =>
    `${params.strength} frames. Is that correct?`,

  'inspection.askStrength': (_params) =>
    'How strong is the colony? Please say the number of frames.',

  'inspection.retryStrength': (_params) =>
    'Please say a number between 1 and 20.',

  'inspection.askBrood': (_params) => 'How many brood frames are there?',

  'inspection.retryBrood': (_params) =>
    'Please say the number between 1 and 20.',

  'inspection.confirmBrood': (params) =>
    `${params.broodFrames} brood frames. Is that correct?`,

  'inspection.askHoney': (_params) =>
    'Approximately how many kilograms of honey?',

  'inspection.retryHoney': (_params) =>
    'Please say the approximate amount of honey in kilograms as a number.',

  'inspection.confirmHoney': (params) =>
    `${params.honeyKg} kilograms of honey. Is that correct?`,

  'inspection.askQueen': (_params) => 'Is there a queen?',
  'inspection.askQueenBreed': (_params) =>
    'What breed is the queen? Carniolan, Buckfast, or local?',

  'inspection.retryQueenBreed': (_params) =>
    'Please say: Carniolan, Buckfast, or local.',

  'inspection.askQueenYear': (_params) => 'What year was the queen born?',

  'inspection.retryQueenYear': (_params) =>
    'Please say the year, for example 2024.',

  'inspection.confirmQueenYear': (params) =>
    `Queen birth year: ${params.queenYear}. Is that correct?`,
};
