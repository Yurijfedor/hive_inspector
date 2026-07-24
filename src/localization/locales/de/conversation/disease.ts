import type {ConversationModule} from '../../../conversation/types';

export const disease: ConversationModule = {
  'disease.askDiarrhea': (_params) =>
    'Чи є сліди поносу на рамках або стінках?',

  'disease.askDeformedWings': (_params) =>
    'Чи є бджоли з деформованими крилами?',

  'disease.askMitesVisible': (_params) =>
    'Чи видно кліщів на бджолах або в піддоні?',

  'disease.askWeakBrood': (_params) => 'Чи є дірявий або слабкий розплід?',
};
