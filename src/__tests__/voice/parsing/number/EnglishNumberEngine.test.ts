import {createNumberEngine} from '../../../../voice/parsing/number/createNumberEngine';
import {enLexicon} from '../../../../voice/parsing/number/lexicons';

describe('English NumberEngine', () => {
  it('parses english numbers', () => {
    const engine = createNumberEngine(enLexicon);

    const cases: Array<[string, number]> = [
      ['one', 1],
      ['ten', 10],
      ['nineteen', 19],

      ['twenty five', 25],
      ['forty two', 42],
      ['ninety nine', 99],

      ['one hundred', 100],
      ['one hundred one', 101],
      ['two hundred twenty five', 225],
      ['five hundred eighty one', 581],
      ['nine hundred ninety nine', 999],

      ['three hundred', 300],
      ['three hundred forty six', 346],
      ['seven hundred eleven', 711],
      ['eight hundred ninety', 890],
      ['nine hundred ninety nine', 999],
    ];

    for (const [input, expected] of cases) {
      expect(engine.parse(input).value).toBe(expected);
    }
  });

  it('returns null for unknown words', () => {
    const engine = createNumberEngine(enLexicon);

    expect(engine.parse('banana').value).toBeNull();
    expect(engine.parse('hello world').value).toBeNull();
    expect(engine.parse('').value).toBeNull();
  });

  it('extracts numbers from phrases', () => {
    const engine = createNumberEngine(enLexicon);

    expect(engine.parse('hive five').value).toBe(5);
    expect(engine.parse('number twenty five').value).toBe(25);
    expect(engine.parse('queen is one hundred one').value).toBe(101);
  });
});
