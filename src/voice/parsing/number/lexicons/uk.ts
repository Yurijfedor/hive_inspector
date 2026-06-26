import {createLexicon} from '../createLexicon';

export const ukLexicon = createLexicon({
  один: {
    value: 1,
    type: 'UNIT',
  },

  одна: {
    value: 1,
    type: 'UNIT',
  },

  два: {
    value: 2,
    type: 'UNIT',
  },

  дві: {
    value: 2,
    type: 'UNIT',
  },

  три: {
    value: 3,
    type: 'UNIT',
  },

  чотири: {
    value: 4,
    type: 'UNIT',
  },

  "п'ять": {
    value: 5,
    type: 'UNIT',
  },

  двадцять: {
    value: 20,
    type: 'TENS',
  },

  тридцять: {
    value: 30,
    type: 'TENS',
  },

  сорок: {
    value: 40,
    type: 'TENS',
  },

  двісті: {
    value: 200,
    type: 'HUNDRED',
  },
});
