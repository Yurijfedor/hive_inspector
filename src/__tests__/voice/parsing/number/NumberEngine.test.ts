import {NumberEngine} from '../../../../voice/parsing/number';
import {ukLexicon} from '../../../../voice/parsing/number/__fixtures__/ukLexicon';

describe('NumberEngine', () => {
  it('parses single cardinal numbers', () => {
    const engine = new NumberEngine({
      lexicon: ukLexicon,
    });

    const cases: Array<[string, number]> = [
      ['один', 1],
      ['одна', 1],
      ['два', 2],
      ['дві', 2],
      ['три', 3],
      ['чотири', 4],
      ["п'ять", 5],
      ['вулик один', 1],
      ['номер два', 2],
      ['це три', 3],
      ['сила чотири', 4],
      ["у вулику п'ять рамок", 5],
    ];

    for (const [word, expected] of cases) {
      const result = engine.parse(word);

      expect(result.value).toBe(expected);
    }
  });
});
