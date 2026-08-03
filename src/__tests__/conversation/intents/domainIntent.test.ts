import {detectDomainIntent} from '../../../conversation/intents/domainIntent';

describe('detectDomainIntent', () => {
  describe('English', () => {
    it('detects swarm intent', () => {
      expect(detectDomainIntent('swarm', 'en')).toBe('SWARM');
      expect(detectDomainIntent('swarming', 'en')).toBe('SWARM');
    });

    it('detects split intent', () => {
      expect(detectDomainIntent('split', 'en')).toBe('SPLIT');
      expect(detectDomainIntent('splitting', 'en')).toBe('SPLIT');
    });

    it('detects disease intent', () => {
      expect(detectDomainIntent('disease', 'en')).toBe('DISEASE');
      expect(detectDomainIntent('varroa', 'en')).toBe('DISEASE');
      expect(detectDomainIntent('mites', 'en')).toBe('DISEASE');
    });

    it('detects feeding intent', () => {
      expect(detectDomainIntent('feeding', 'en')).toBe('FEEDING');
      expect(detectDomainIntent('syrup', 'en')).toBe('FEEDING');
      expect(detectDomainIntent('sugar', 'en')).toBe('FEEDING');
    });

    it('detects intents inside phrases', () => {
      expect(detectDomainIntent('the hive is swarming', 'en')).toBe('SWARM');

      expect(detectDomainIntent('I want to split the hive', 'en')).toBe(
        'SPLIT',
      );

      expect(detectDomainIntent('I see varroa mites', 'en')).toBe('DISEASE');

      expect(detectDomainIntent('I want to feed syrup', 'en')).toBe('FEEDING');
    });

    it('returns NONE for unrelated input', () => {
      expect(detectDomainIntent('banana', 'en')).toBe('NONE');
      expect(detectDomainIntent('hello world', 'en')).toBe('NONE');
      expect(detectDomainIntent('', 'en')).toBe('NONE');
    });
    it('does not trigger domain intents for unrelated inspection phrases', () => {
      expect(detectDomainIntent('queen is present', 'en')).toBe('NONE');
      expect(detectDomainIntent('five brood frames', 'en')).toBe('NONE');
      expect(detectDomainIntent('twenty kilograms of honey', 'en')).toBe(
        'NONE',
      );
      expect(detectDomainIntent('hive number twenty four', 'en')).toBe('NONE');
      expect(detectDomainIntent('inspection', 'en')).toBe('NONE');
    });
  });
  describe('German', () => {
    it('detects swarm intent', () => {
      expect(detectDomainIntent('schwarm', 'de')).toBe('SWARM');
      expect(detectDomainIntent('schwärmen', 'de')).toBe('SWARM');
    });

    it('detects split intent', () => {
      expect(detectDomainIntent('ableger', 'de')).toBe('SPLIT');
      expect(detectDomainIntent('teilen', 'de')).toBe('SPLIT');
    });

    it('detects disease intent', () => {
      expect(detectDomainIntent('krankheit', 'de')).toBe('DISEASE');
      expect(detectDomainIntent('varroa', 'de')).toBe('DISEASE');
      expect(detectDomainIntent('milben', 'de')).toBe('DISEASE');
    });

    it('detects feeding intent', () => {
      expect(detectDomainIntent('fütterung', 'de')).toBe('FEEDING');
      expect(detectDomainIntent('sirup', 'de')).toBe('FEEDING');
      expect(detectDomainIntent('zucker', 'de')).toBe('FEEDING');
    });

    it('detects intents inside phrases', () => {
      expect(detectDomainIntent('das volk schwärmt', 'de')).toBe('SWARM');

      expect(detectDomainIntent('ich möchte einen ableger machen', 'de')).toBe(
        'SPLIT',
      );

      expect(detectDomainIntent('ich sehe varroa milben', 'de')).toBe(
        'DISEASE',
      );

      expect(detectDomainIntent('ich möchte mit sirup füttern', 'de')).toBe(
        'FEEDING',
      );
    });

    it('returns NONE for unrelated input', () => {
      expect(detectDomainIntent('banane', 'de')).toBe('NONE');
      expect(detectDomainIntent('guten tag', 'de')).toBe('NONE');
      expect(detectDomainIntent('', 'de')).toBe('NONE');
    });

    it('does not trigger domain intents for unrelated inspection phrases', () => {
      expect(detectDomainIntent('die königin ist vorhanden', 'de')).toBe(
        'NONE',
      );
      expect(detectDomainIntent('fünf brutwaben', 'de')).toBe('NONE');
      expect(detectDomainIntent('zwanzig kilogramm honig', 'de')).toBe('NONE');
      expect(detectDomainIntent('stocknummer vierundzwanzig', 'de')).toBe(
        'NONE',
      );
      expect(detectDomainIntent('inspektion', 'de')).toBe('NONE');
    });
  });
});
