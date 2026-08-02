import type {ConversationModule} from '../../../conversation/types';

export const common: ConversationModule = {
  'common.retryYesNo': (_params) => 'Bitte sagen Sie „Ja“ oder „Nein“.',

  'common.inspectionFinished': (_params) => 'Die Inspektion ist abgeschlossen.',

  'common.readyForCommand': (_params) => 'Bereit für einen neuen Befehl.',

  'common.retryUnknown': (_params) =>
    'Ich habe die Antwort nicht verstanden. Bitte versuchen Sie es erneut.',
  'common.inspectionStopped': (_params) => 'Inspektion beendet.',
};
