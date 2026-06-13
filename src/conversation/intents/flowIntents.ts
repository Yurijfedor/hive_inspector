// export type FlowIntent =
//   | {type: 'START_FLOW'; flowId: string; args?: any[]}
//   | {type: 'NONE'};

// export function detectFlowIntent(text: string): FlowIntent {
//   const t = text.trim().toLowerCase();

//   if (t.includes('годівл')) {
//     return {type: 'START_FLOW', flowId: 'feeding'};
//   }

//   if (t.includes('огляд')) {
//     return {type: 'START_FLOW', flowId: 'inspection'};
//   }

//   return {type: 'NONE'};
// }

import i18n from '../../localization/i18n';

import {getVoiceLanguagePack} from '../../voice/language/getVoiceLanguagePack';

export type FlowIntent =
  | {type: 'START_FLOW'; flowId: string; args?: any[]}
  | {type: 'NONE'};

function includesAny(text: string, words: string[]) {
  return words.some((word) => text.includes(word));
}

export function detectFlowIntent(text: string): FlowIntent {
  const normalized = text.trim().toLowerCase();

  const language = getVoiceLanguagePack(
    (i18n.language as 'uk' | 'en' | 'de') ?? 'uk',
  );

  if (includesAny(normalized, language.vocabulary.flow.feedingWords)) {
    return {
      type: 'START_FLOW',
      flowId: 'feeding',
    };
  }

  if (includesAny(normalized, language.vocabulary.flow.inspectionWords)) {
    return {
      type: 'START_FLOW',
      flowId: 'inspection',
    };
  }

  return {
    type: 'NONE',
  };
}
