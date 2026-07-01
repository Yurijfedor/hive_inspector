import {NumberEngine} from './NumberEngine';
import {ukLexicon} from './lexicons';
import {NumberLexicon} from './types';

export function createNumberEngine(lexicon: NumberLexicon = ukLexicon) {
  return new NumberEngine({
    lexicon,
  });
}
