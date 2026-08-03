// import {similarity} from './similarity';

// export function scoreIntent(tokens: string[], vocabulary: string[]): number {
//   let score = 0;

//   for (const token of tokens) {
//     if (token.length < 3) {
//       continue;
//     }

//     for (const word of vocabulary) {
//       if (token.includes(word)) {
//         score += 2;
//         continue;
//       }

//       if (similarity(token, word) > 0.7) {
//         score += 1.5;
//       }
//     }
//   }

//   return score;
// }
