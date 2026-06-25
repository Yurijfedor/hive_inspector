import {NumberRules} from '../../../../../voice/parsing/number/rules/NumberRules';

describe('NumberRules', () => {
  it('returns first token value', () => {
    const rules = new NumberRules();

    expect(
      rules.compose([
        {
          token: 'пять',
          value: 5,
          type: 'UNIT',
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
          type: 'TENS',
        },
        {
          token: 'один',
          value: 1,
          type: 'UNIT',
        },
      ]),
    ).toBe(21);

    expect(
      rules.compose([
        {
          token: 'тридцять',
          value: 30,
          type: 'TENS',
        },
        {
          token: 'пять',
          value: 5,
          type: 'UNIT',
        },
      ]),
    ).toBe(35);
  });

  it('composes hundreds', () => {
    const rules = new NumberRules();

    expect(
      rules.compose([
        {
          token: 'сто',
          value: 100,
          type: 'HUNDRED',
        },
        {
          token: 'двадцять',
          value: 20,
          type: 'TENS',
        },
        {
          token: 'три',
          value: 3,
          type: 'UNIT',
        },
      ]),
    ).toBe(123);
  });

  it('composes hundred and unit', () => {
    const rules = new NumberRules();

    expect(
      rules.compose([
        {
          token: 'сто',
          value: 100,
          type: 'HUNDRED',
        },
        {
          token: 'три',
          value: 3,
          type: 'UNIT',
        },
      ]),
    ).toBe(103);
  });

  it('composes hundred and tens', () => {
    const rules = new NumberRules();

    expect(
      rules.compose([
        {
          token: 'сто',
          value: 100,
          type: 'HUNDRED',
        },
        {
          token: 'двадцять',
          value: 20,
          type: 'TENS',
        },
      ]),
    ).toBe(120);
  });

  it('composes multiplier expressions', () => {
    const rules = new NumberRules();

    expect(
      rules.compose([
        {
          token: 'два',
          value: 2,
          type: 'UNIT',
        },
        {
          token: 'сто',
          value: 100,
          type: 'HUNDRED',
        },
      ]),
    ).toBe(200);
  });
});
