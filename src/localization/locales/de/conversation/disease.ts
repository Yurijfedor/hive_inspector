import type {ConversationModule} from '../../../conversation/types';

export const disease: ConversationModule = {
  'disease.askDiarrhea': (_params) =>
    'Gibt es Durchfallspuren auf den Waben oder den Stockwänden?',

  'disease.askDeformedWings': (_params) =>
    'Gibt es Bienen mit deformierten Flügeln?',

  'disease.askMitesVisible': (_params) =>
    'Sind Milben auf den Bienen oder auf der Bodeneinlage sichtbar?',

  'disease.askWeakBrood': (_params) =>
    'Gibt es lückenhafte oder schwache Brut?',
};
