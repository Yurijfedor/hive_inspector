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
      inspectionWords: ['inspection', 'inspect'],

      feedingWords: ['feeding', 'feed'],
    },

    domain: {
      intents: {
        SWARM: ['swarm', 'swarming'],

        SPLIT: ['split', 'splitting'],

        DISEASE: ['disease', 'varroa', 'mite', 'mites', 'diarrhea'],

        FEEDING: ['feed', 'feeding', 'syrup', 'sugar'],
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
