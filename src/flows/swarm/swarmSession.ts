import {swarmFlow} from './swarmDefinition';
import {executeStep} from '../flowRuntime';
import {FlowEffect} from '../../conversation/types';

export type SwarmSession = {
  hiveNumber: number;
  stepIndex: number;
  data: {
    queenEmergence?: boolean;
    sealedCells?: boolean;
    openCells?: boolean;
    eggsInCells?: boolean;
  };
};

export type ApplyAnswerResult =
  | {
      type: 'INVALID';
      message: string;
      session: SwarmSession;
    }
  | {
      type: 'NEXT';
      session: SwarmSession;
      effects?: FlowEffect[];
    };

export function createSwarmSession(hiveNumber: number): SwarmSession {
  return {
    hiveNumber,
    stepIndex: 0,
    data: {},
  };
}

export function applyAnswer(
  session: SwarmSession,
  value: unknown,
): ApplyAnswerResult {
  const step = swarmFlow.steps[session.stepIndex];

  const result = executeStep(step, session, value);

  if (result.type === 'RETRY') {
    return {
      type: 'INVALID',
      message: result.message,
      session,
    };
  }

  return {
    type: 'NEXT',
    session: {
      ...result.session,
      stepIndex: session.stepIndex + 1,
    },
    effects: result.effects,
  };
}
