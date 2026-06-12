export type VoiceLanguage = 'uk' | 'en' | 'de';

export interface ControlVocabulary {
  pauseWords: string[];
  resumeWords: string[];
  cancelWords: string[];

  stopKeywords: string[];
  stopVerbs: string[];
}

export interface VoiceLanguagePack {
  language: VoiceLanguage;

  control: ControlVocabulary;

  flow: FlowVocabulary;
}

export interface FlowVocabulary {
  inspectionWords: string[];
  feedingWords: string[];
}
