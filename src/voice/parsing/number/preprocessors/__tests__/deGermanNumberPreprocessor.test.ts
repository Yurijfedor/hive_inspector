import {preprocessGermanNumber} from '../deGermanNumberPreprocessor';

describe('preprocessGermanNumber', () => {
  it.each([
    ['vierundzwanzig', 'vier zwanzig'],
    ['einundzwanzig', 'eins zwanzig'],
    ['achtunddreißig', 'acht dreißig'],
    ['neunundneunzig', 'neun neunzig'],

    ['einhundert', 'eins hundert'],
    ['zweihundert', 'zwei hundert'],

    ['einhundertdreiundzwanzig', 'eins hundert drei zwanzig'],
    ['zweihundertfünfundvierzig', 'zwei hundert fünf vierzig'],
    ['achthundertvierundzwanzig', 'acht hundert vier zwanzig'],
    ['neunhundertneunundneunzig', 'neun hundert neun neunzig'],
  ])('%s → %s', (input, expected) => {
    expect(preprocessGermanNumber(input)).toBe(expected);
  });
});
