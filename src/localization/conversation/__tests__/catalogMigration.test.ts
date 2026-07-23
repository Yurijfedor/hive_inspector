import {messageCatalog} from '../../messageCatalog';
import {conversation} from '../../locales/uk/conversation';

describe('Conversation catalog migration', () => {
  const legacyKeys = Object.keys(messageCatalog).sort();
  const newKeys = Object.keys(conversation).sort();

  it('has identical key set', () => {
    expect(newKeys).toEqual(legacyKeys);
  });

  it('contains only resolver functions', () => {
    for (const value of Object.values(conversation)) {
      expect(typeof value).toBe('function');
    }
  });
});
