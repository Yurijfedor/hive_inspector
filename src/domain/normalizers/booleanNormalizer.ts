import {normalizeText} from './textNormalizer';

const YES_WORDS = ['так', 'yes', 'да', 'ага', 'yep', 'true'];

const NO_WORDS = ['ні', 'no', 'нет', 'nope', 'false'];

export function normalizeBoolean(input: unknown): boolean | null {
  if (typeof input === 'boolean') {
    return input;
  }

  const text = normalizeText(input);

  if (YES_WORDS.some((word) => text.includes(word))) {
    return true;
  }

  if (NO_WORDS.some((word) => text.includes(word))) {
    return false;
  }

  return null;
}

export function isAffirmative(input: unknown): boolean {
  return normalizeBoolean(input) === true;
}

export function isNegative(input: unknown): boolean {
  return normalizeBoolean(input) === false;
}
