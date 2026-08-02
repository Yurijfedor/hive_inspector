import {VoiceLanguagePack} from '../VoiceLanguagePack';

export const dePack: VoiceLanguagePack = {
  language: 'de',

  vocabulary: {
    control: {
      pauseWords: ['pause', 'warte', 'warten'],

      resumeWords: ['weiter', 'fortsetzen', 'weitermachen'],

      cancelWords: ['abbrechen'],

      stopKeywords: ['inspektion', 'kontrolle'],

      stopVerbs: ['beenden', 'beendet', 'stoppen', 'stopp', 'abbrechen'],
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
