import {inspection} from './inspection';
import {common} from './common';
import {hive} from './hive';
import {disease} from './disease';
import {feeding} from './feeding';
import {split} from './split';

export const conversation = {
  ...common,
  ...hive,
  ...inspection,
  ...disease,
  ...feeding,
  ...split,
};
