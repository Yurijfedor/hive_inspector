import {inspection} from './inspection';
import {common} from './common';
import {hive} from './hive';

export const conversation = {
  ...common,
  ...hive,
  ...inspection,
};
