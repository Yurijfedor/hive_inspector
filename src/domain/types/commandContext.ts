import {InspectionCommand} from '../../voice/schema/inspection';

export type ExecutionContext = {
  source: 'voice' | 'manual' | 'ai';
};

export type InspectionCommandWithContext = InspectionCommand & {
  context?: ExecutionContext;
};
