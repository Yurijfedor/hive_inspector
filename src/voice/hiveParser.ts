import {parseNumber} from './numberParser';

export function parseHiveNumber(input: string): number | null {
  if (!input) {
    return null;
  }

  const tokens = input.split(/\s+/);

  for (let i = 0; i < tokens.length; i++) {
    const phrase = tokens.slice(i).join(' ');

    const value = parseNumber(phrase);

    if (value !== null) {
      return value;
    }

    const single = parseNumber(tokens[i]);

    if (single !== null) {
      return single;
    }

    const numeric = Number(tokens[i]);

    if (!Number.isNaN(numeric)) {
      return numeric;
    }
  }

  return null;
}
