import {inspection} from './inspection';
import {common} from './common';
import {hive} from './hive';
import {disease} from './disease';
import {feeding} from './feeding';

export const conversation = {
  ...common,
  ...hive,
  ...inspection,
  ...disease,
  ...feeding,
};
