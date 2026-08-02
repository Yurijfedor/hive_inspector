import type {ConversationModule} from '../../../conversation/types';

export const common: ConversationModule = {
  'common.retryYesNo': (_params) => 'Please say "yes" or "no".',

  'common.inspectionFinished': (_params) => 'Inspection finished.',

  'common.readyForCommand': (_params) => 'Ready for a new command.',

  'common.retryUnknown': (_params) =>
    'I did not understand the answer. Please try again.',
  'common.inspectionStopped': (_params) => 'Inspection finished.',
};
