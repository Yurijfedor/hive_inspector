import {VoiceLanguagePack} from '../VoiceLanguagePack';

export const enPack: VoiceLanguagePack = {
  language: 'en',

  vocabulary: {
    control: {
      pauseWords: [],

      resumeWords: [],

      cancelWords: [],

      stopKeywords: [],

      stopVerbs: [],
    },

    flow: {
      inspectionWords: [],

      feedingWords: [],
    },

    domain: {
      intents: {
        SWARM: [],
        SPLIT: [],
        DISEASE: [],
        FEEDING: [],
      },
    },
    numbers: {
      cardinal: {},

      keywords: {
        thousand: ['thousand'],
      },
    },
  },
};
