import {NumberEngine} from './NumberEngine';
import {ukLexicon} from './lexicons';

export function createNumberEngine() {
  return new NumberEngine({
    lexicon: ukLexicon,
  });
}
