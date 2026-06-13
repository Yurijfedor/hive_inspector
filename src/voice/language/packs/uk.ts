import {VoiceLanguagePack} from '../VoiceLanguagePack';

export const ukPack: VoiceLanguagePack = {
  language: 'uk',

  vocabulary: {
    control: {
      pauseWords: ['стоп', 'зупини', 'чекай'],

      resumeWords: ['продовж', 'далі', 'можна'],

      cancelWords: ['скасувати', 'завершити', 'закінчити'],

      stopKeywords: ['огляд'],

      stopVerbs: ['заверш', 'закінч', 'стоп', 'припини', 'верш'],
    },

    flow: {
      inspectionWords: ['огляд'],

      feedingWords: ['годівл'],
    },
  },
};
