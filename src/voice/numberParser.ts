import {getNumberEngine} from './parsing/number/getNumberEngine';

export function parseNumber(input: string): number | null {
  return getNumberEngine().parse(input).value;
}
