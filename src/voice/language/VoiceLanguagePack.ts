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
  numbers: NumberVocabulary;
}

export interface VoiceLanguagePack {
  language: VoiceLanguage;

  vocabulary: VoiceVocabulary;
}

export interface DomainVocabulary {
  intents: Record<'SWARM' | 'SPLIT' | 'DISEASE' | 'FEEDING', string[]>;
}

export interface CardinalNumberVocabulary {
  units: Record<string, number>;

  teens: Record<string, number>;

  tens: Record<string, number>;

  hundreds: Record<string, number>;

  thousands: Record<string, number>;
}

export interface NumberVocabulary {
  cardinal: CardinalNumberVocabulary;
}
