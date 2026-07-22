import {messageCatalog} from '../../messageCatalog';
import {conversation} from '../../locales/uk/conversation';

describe('Conversation catalog migration', () => {
  it('contains the same number of messages', () => {
    expect(Object.keys(conversation)).toHaveLength(
      Object.keys(messageCatalog).length,
    );
  });
  it('contains every legacy message key', () => {
    for (const key of Object.keys(messageCatalog)) {
      expect(conversation).toHaveProperty(key);
    }
  });
  it('does not introduce unexpected keys', () => {
    for (const key of Object.keys(conversation)) {
      expect(messageCatalog).toHaveProperty(key);
    }
  });
  it('has identical key set', () => {
    const legacyKeys = Object.keys(messageCatalog).sort();
    const newKeys = Object.keys(conversation).sort();

    expect(newKeys).toEqual(legacyKeys);
  });
});
