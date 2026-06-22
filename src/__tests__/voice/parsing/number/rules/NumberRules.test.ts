import {NumberRules} from '../../../../../voice/parsing/number/rules/NumberRules';

describe('NumberRules', () => {
  it('returns first token value', () => {
    const rules = new NumberRules();

    expect(
      rules.compose([
        {
          token: 'пять',
          value: 5,
        },
      ]),
    ).toBe(5);
  });

  it('returns null for empty list', () => {
    const rules = new NumberRules();

    expect(rules.compose([])).toBeNull();
  });

  it('composes simple two-token numbers', () => {
    const rules = new NumberRules();

    expect(
      rules.compose([
        {
          token: 'двадцять',
          value: 20,
        },
        {
          token: 'один',
          value: 1,
        },
      ]),
    ).toBe(21);

    expect(
      rules.compose([
        {
          token: 'тридцять',
          value: 30,
        },
        {
          token: 'пять',
          value: 5,
        },
      ]),
    ).toBe(35);
  });
});
