// import {createNumberEngine} from './parsing/number/createNumberEngine';

// const engine = createNumberEngine();

// export function parseNumber(input: string): number | null {
//   return engine.parse(input).value;
// }

import {getNumberEngine} from './parsing/number/getNumberEngine';

export function parseNumber(input: string): number | null {
  return getNumberEngine().parse(input).value;
}
