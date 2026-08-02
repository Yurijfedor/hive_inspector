import {VoiceLanguagePack} from '../VoiceLanguagePack';

export const enPack: VoiceLanguagePack = {
  language: 'en',

  vocabulary: {
    control: {
      pauseWords: ['pause', 'wait', 'hold on'],

      resumeWords: ['continue', 'resume', 'go on'],

      cancelWords: ['cancel'],

      stopKeywords: ['inspection'],

      stopVerbs: ['finish', 'end', 'stop', 'terminate'],
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
