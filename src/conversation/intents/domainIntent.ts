import {normalizeText, scoreIntent} from '../../utils/voiceParser/voiceParser';

import i18n from '../../localization/i18n';
import {getVoiceLanguagePack} from '../../voice/language/getVoiceLanguagePack';

export type DomainIntent = 'SWARM' | 'SPLIT' | 'DISEASE' | 'FEEDING' | 'NONE';

export function detectDomainIntent(input: string): DomainIntent {
  if (!input) return 'NONE';

  const language = getVoiceLanguagePack(
    (i18n.language as 'uk' | 'en' | 'de') ?? 'uk',
  );

  const intents = language.vocabulary.domain.intents;

  const text = normalizeText(input);
  const tokens = text.split(' ');

  // 🔥 score кожного інтенду
  const scores: Partial<Record<DomainIntent, number>> = {};

  for (const [intent, vocabulary] of Object.entries(intents)) {
    scores[intent as DomainIntent] = scoreIntent(tokens, vocabulary);
  }

  // 🔥 знайти максимум
  let bestIntent: DomainIntent = 'NONE';
  let bestScore = 0;

  for (const [intent, score] of Object.entries(scores)) {
    if ((score ?? 0) > bestScore) {
      bestScore = score ?? 0;
      bestIntent = intent as DomainIntent;
    }
  }

  // 🔒 мінімальний поріг (дуже важливо)
  if (bestScore < 2) return 'NONE';

  return bestIntent;
}
