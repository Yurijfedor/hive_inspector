import {createNumberEngine} from '../../../../voice/parsing/number/createNumberEngine';
import {enLexicon} from '../../../../voice/parsing/number/lexicons';

describe('English NumberEngine', () => {
  it('parses english numbers', () => {
    const engine = createNumberEngine(enLexicon);

    const cases: Array<[string, number]> = [
      ['one', 1],
      ['five', 5],
      ['twenty five', 25],
      ['two hundred', 200],
      ['two hundred twenty five', 225],
    ];

    for (const [input, expected] of cases) {
      expect(engine.parse(input).value).toBe(expected);
    }
  });
});
