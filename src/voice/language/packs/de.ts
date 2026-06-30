import {VoiceLanguagePack} from '../VoiceLanguagePack';

export const dePack: VoiceLanguagePack = {
  language: 'de',

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
        thousand: ['tausend'],
      },
    },
  },
};
