import {inspection} from './inspection';
import {common} from './common';
import {hive} from './hive';
import {disease} from './disease';

export const conversation = {
  ...common,
  ...hive,
  ...inspection,
  ...disease,
};
