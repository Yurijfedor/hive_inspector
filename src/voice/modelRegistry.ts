import {VoiceLanguage} from './voiceLanguage';

export interface VoiceModelInfo {
  language: VoiceLanguage;

  version: string;

  url: string;
}

export const modelRegistry: Record<VoiceLanguage, VoiceModelInfo> = {
  uk: {
    language: 'uk',
    version: '3',
    url: 'https://alphacephei.com/vosk/models/vosk-model-small-uk-v3-small.zip',
  },

  en: {
    language: 'en',
    version: '0.15',
    url: 'https://alphacephei.com/vosk/models/vosk-model-small-en-us-0.15.zip',
  },

  de: {
    language: 'de',
    version: '0.3',
    url: 'https://alphacephei.com/vosk/models/vosk-model-small-de-zamia-0.3.zip',
  },
};
