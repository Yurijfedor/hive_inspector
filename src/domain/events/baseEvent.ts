import {ExecutionContext} from '../types/commandContext';

export type BaseEvent = {
  hiveNumber: number;
  context?: ExecutionContext;
};
