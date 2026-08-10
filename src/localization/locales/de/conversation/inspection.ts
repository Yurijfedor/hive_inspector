import type {ConversationModule} from '../../../conversation/types';

export const inspection: ConversationModule = {
  'inspection.askHive': (_params) =>
    'Nennen Sie die Stocknummer oder sagen Sie „Inspektion beenden“.',

  'inspection.retryHive': (_params) =>
    'Ich habe die Stocknummer nicht verstanden. Bitte nennen Sie sie noch einmal.',

  'inspection.confirmStrength': (params) =>
    `${params.strength} Waben. Ist das richtig?`,

  'inspection.askStrength': (_params) =>
    'Wie stark ist das Bienenvolk? Bitte nennen Sie die Anzahl der Waben.',

  'inspection.retryStrength': (_params) =>
    'Bitte nennen Sie eine Zahl zwischen 1 und 20.',

  'inspection.askBrood': (_params) => 'Wie viele Brutwaben gibt es?',

  'inspection.retryBrood': (_params) =>
    'Bitte nennen Sie die Anzahl der Brutwaben zwischen 1 und 20.',

  'inspection.confirmBrood': (params) =>
    `${params.broodFrames} Brutwaben. Ist das richtig?`,

  'inspection.askHoney': (_params) => 'Wie viele Kilogramm Honig ungefähr?',

  'inspection.retryHoney': (_params) =>
    'Bitte nennen Sie die ungefähre Honigmenge in Kilogramm als Zahl.',

  'inspection.confirmHoney': (params) =>
    `${params.honeyKg} Kilogramm Honig. Ist das richtig?`,

  'inspection.askQueen': (_params) => 'Ist eine Königin vorhanden?',
  'inspection.askQueenBreed': (_params) =>
    'Welche Rasse hat die Königin? Carnica, Buckfast oder eine lokale Rasse?',

  'inspection.retryQueenBreed': (_params) =>
    'Bitte sagen Sie: Carnica, Buckfast oder lokale Rasse.',

  'inspection.askQueenYear': (_params) => 'Aus welchem Jahr ist die Königin?',

  'inspection.retryQueenYear': (_params) =>
    'Bitte nennen Sie das Jahr, zum Beispiel 2024.',

  'inspection.confirmQueenYear': (params) =>
    `Geburtsjahr der Königin: ${params.queenYear}. Ist das richtig?`,
};
