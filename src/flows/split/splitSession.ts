import {splitFlow} from './splitDefinition';
import {executeStep} from '../flowRuntime';
import {FlowEffect} from '../../conversation/types';

export type SplitSession = {
  hiveNumber: number;
  stepIndex: number;
  data: {
    isSplit?: boolean;
    usedForSplits?: boolean;
    broodFrames?: number;
    foodFrames?: number;
  };
};

export type ApplyAnswerResult =
  | {
      type: 'INVALID';
      message: string;
      session: SplitSession;
    }
  | {
      type: 'NEXT';
      session: SplitSession;
      effects?: FlowEffect[];
    };

export function createSplitSession(hiveNumber: number): SplitSession {
  return {
    hiveNumber,
    stepIndex: 0,
    data: {},
  };
}

export function applyAnswer(
  session: SplitSession,
  value: unknown,
): ApplyAnswerResult {
  const step = splitFlow.steps[session.stepIndex];

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
