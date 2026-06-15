export type VoiceLanguage = 'uk' | 'en' | 'de';

export interface ControlVocabulary {
  pauseWords: string[];
  resumeWords: string[];
  cancelWords: string[];

  stopKeywords: string[];
  stopVerbs: string[];
}

export interface FlowVocabulary {
  inspectionWords: string[];
  feedingWords: string[];
}

export interface VoiceVocabulary {
  control: ControlVocabulary;
  flow: FlowVocabulary;
  domain: DomainVocabulary;
}

export interface VoiceLanguagePack {
  language: VoiceLanguage;

  vocabulary: VoiceVocabulary;
}

export interface DomainVocabulary {
  intents: Record<'SWARM' | 'SPLIT' | 'DISEASE' | 'FEEDING', string[]>;
}
