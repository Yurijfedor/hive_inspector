import {createNumberEngine} from '../../../../voice/parsing/number/createNumberEngine';
import {deLexicon} from '../../../../voice/parsing/number/lexicons';
import {preprocessGermanNumber} from '../../../../voice/parsing/number/preprocessors/deGermanNumberPreprocessor';

describe('German NumberEngine', () => {
  it('parses german numbers', () => {
    const engine = createNumberEngine(deLexicon);

    const cases: Array<[string, number]> = [
      ['eins', 1],
      ['zehn', 10],
      ['neunzehn', 19],

      ['zwanzig', 20],
      ['vierundzwanzig', 24],
      ['achtunddreißig', 38],
      ['neunundneunzig', 99],

      ['einhundert', 100],
      ['einhunderteins', 101],
      ['einhundertdreiundzwanzig', 123],
      ['zweihundertfünfundvierzig', 245],
      ['fünfhunderteinundachtzig', 581],
      ['achthundertvierundzwanzig', 824],
      ['neunhundertneunundneunzig', 999],
    ];

    for (const [input, expected] of cases) {
      const normalized = preprocessGermanNumber(input);

      expect(engine.parse(normalized).value).toBe(expected);
    }
  });
});
