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
});
