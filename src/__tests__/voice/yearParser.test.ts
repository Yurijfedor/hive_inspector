import {parseYear} from '../../voice/yearParser';

describe('parseYear', () => {
  it('parses Ukrainian short year', () => {
    expect(parseYear('двадцять чотири', 'uk')).toBe(2024);
    expect(parseYear('двадцять пʼять', 'uk')).toBe(2025);
    expect(parseYear('двадцять шість', 'uk')).toBe(2026);
  });

  it('parses English short year', () => {
    expect(parseYear('twenty four', 'en')).toBe(2024);
    expect(parseYear('twenty five', 'en')).toBe(2025);
    expect(parseYear('twenty six', 'en')).toBe(2026);
  });

  it('parses German short year', () => {
    expect(parseYear('vierundzwanzig', 'de')).toBe(2024);
    expect(parseYear('fünfundzwanzig', 'de')).toBe(2025);
    expect(parseYear('sechsundzwanzig', 'de')).toBe(2026);
  });

  it('accepts direct four-digit years', () => {
    expect(parseYear('2024', 'uk')).toBe(2024);
    expect(parseYear('2025', 'en')).toBe(2025);
    expect(parseYear('2026', 'de')).toBe(2026);
  });

  it('rejects invalid input', () => {
    expect(parseYear('banana', 'en')).toBeNull();
    expect(parseYear('', 'de')).toBeNull();
  });
});
