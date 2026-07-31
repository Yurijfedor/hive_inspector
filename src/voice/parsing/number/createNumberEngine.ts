import {NumberEngine} from './NumberEngine';
import {ukLexicon} from './lexicons';
import {NumberLexicon} from './types';

export function createNumberEngine(
  lexicon: NumberLexicon = ukLexicon,
  preprocess?: (input: string) => string,
) {
  return new NumberEngine({
    lexicon,
    preprocess,
  });
}
