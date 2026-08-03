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
      inspectionWords: ['inspektion', 'kontrolle'],

      feedingWords: ['fütterung', 'füttern'],
    },

    domain: {
      intents: {
        SWARM: ['schwarm', 'schwärmen', 'schwärmt'],

        SPLIT: ['ableger', 'teilen', 'teilung'],

        DISEASE: ['krankheit', 'varroa', 'milbe', 'milben', 'durchfall'],

        FEEDING: ['füttern', 'fütterung', 'sirup', 'zucker'],
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
