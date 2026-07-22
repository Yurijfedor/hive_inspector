import {inspection} from './inspection';
import {common} from './common';
import {hive} from './hive';
import {disease} from './disease';
import {feeding} from './feeding';
import {split} from './split';
import {swarm} from './swarm';

export const conversation = {
  ...common,
  ...hive,
  ...inspection,
  ...disease,
  ...feeding,
  ...split,
  ...swarm,
} as const;

export type ConversationCatalog = typeof conversation;

export type ConversationMessageId = keyof ConversationCatalog;
