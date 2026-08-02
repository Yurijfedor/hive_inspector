import type {ConversationModule} from '../../../conversation/types';

export const common: ConversationModule = {
  'common.retryYesNo': (_params) => 'Скажіть "так" або "ні".',

  'common.inspectionFinished': (_params) => 'Огляд завершено.',

  'common.readyForCommand': (_params) => 'Готовий до нової команди.',

  'common.retryUnknown': (_params) =>
    'Я не зрозумів відповідь. Повторіть, будь ласка.',
  'common.inspectionStopped': (_params) => 'Огляд завершено.',
};
