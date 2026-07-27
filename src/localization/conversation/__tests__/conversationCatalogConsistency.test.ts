import {conversation as uk} from '../../locales/uk/conversation';
import {conversation as en} from '../../locales/en/conversation';
import {conversation as de} from '../../locales/de/conversation';

describe('conversation catalogs', () => {
  it('should contain identical keys in all languages', () => {
    const ukKeys = Object.keys(uk).sort();
    const enKeys = Object.keys(en).sort();
    const deKeys = Object.keys(de).sort();

    expect(enKeys).toEqual(ukKeys);
    expect(deKeys).toEqual(ukKeys);
  });
});
