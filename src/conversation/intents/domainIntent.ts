import {normalizeText, scoreIntent} from '../../utils/voiceParser/voiceParser';

import {getVoiceLanguagePack} from '../../voice/language/getVoiceLanguagePack';
import {VoiceLanguage} from '../../voice/language/VoiceLanguagePack';

export type DomainIntent = 'SWARM' | 'SPLIT' | 'DISEASE' | 'FEEDING' | 'NONE';

export function detectDomainIntent(
  input: string,
  language: VoiceLanguage,
): DomainIntent {
  if (!input) return 'NONE';

  const languagePack = getVoiceLanguagePack(language);
  const intents = languagePack.vocabulary.domain.intents;

  const text = normalizeText(input);
  const tokens = text.split(' ');

  const scores: Partial<Record<DomainIntent, number>> = {};

  for (const [intent, vocabulary] of Object.entries(intents)) {
    scores[intent as DomainIntent] = scoreIntent(tokens, vocabulary);
  }

  let bestIntent: DomainIntent = 'NONE';
  let bestScore = 0;

  for (const [intent, score] of Object.entries(scores)) {
    if ((score ?? 0) > bestScore) {
      bestScore = score ?? 0;
      bestIntent = intent as DomainIntent;
    }
  }

  if (bestScore < 2) return 'NONE';

  return bestIntent;
}
