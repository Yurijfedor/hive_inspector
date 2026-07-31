const UNITS: Record<string, string> = {
  ein: 'eins',
  zwei: 'zwei',
  drei: 'drei',
  vier: 'vier',
  fünf: 'fünf',
  sechs: 'sechs',
  sieben: 'sieben',
  acht: 'acht',
  neun: 'neun',
};

const TENS = [
  'zwanzig',
  'dreißig',
  'vierzig',
  'fünfzig',
  'sechzig',
  'siebzig',
  'achtzig',
  'neunzig',
];

function splitCompoundTens(input: string): string | null {
  for (const tens of TENS) {
    if (!input.endsWith(tens)) {
      continue;
    }

    const prefix = input.slice(0, -tens.length);

    if (!prefix.endsWith('und')) {
      continue;
    }

    const unit = prefix.slice(0, -'und'.length);
    const normalizedUnit = UNITS[unit];

    if (!normalizedUnit) {
      continue;
    }

    return `${normalizedUnit} ${tens}`;
  }

  return null;
}

function splitBelowHundred(input: string): string {
  return splitCompoundTens(input) ?? input;
}

export function preprocessGermanNumber(input: string): string {
  const normalized = input.toLowerCase().trim();

  const hundredIndex = normalized.indexOf('hundert');

  if (hundredIndex === -1) {
    return splitBelowHundred(normalized);
  }

  const hundredPrefix = normalized.slice(0, hundredIndex);
  const remainder = normalized.slice(hundredIndex + 'hundert'.length);

  const normalizedHundred = hundredPrefix === 'ein' ? 'eins' : hundredPrefix;

  if (!remainder) {
    return `${normalizedHundred} hundert`;
  }

  return `${normalizedHundred} hundert ${splitBelowHundred(remainder)}`;
}
