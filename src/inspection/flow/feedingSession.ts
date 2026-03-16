import {feedingFlow} from './feedingDefinition';
import {executeStep} from './flowRuntime';
import {FlowEffect} from '../../conversation/types';

export type FeedingSession = {
  hiveNumber: number;
  stepIndex: number;
  data: {
    syrupLiters?: number;
  };
};

export type ApplyAnswerResult =
  | {
      type: 'INVALID';
      message: string;
      session: FeedingSession;
    }
  | {
      type: 'NEXT';
      session: FeedingSession;
      effects?: FlowEffect[];
    };

/**
 * Create new feeding session
 */
export function createFeedingSession(hiveNumber: number): FeedingSession {
  return {
    hiveNumber,
    stepIndex: 0,
    data: {},
  };
}

/**
 * Universal declarative applyAnswer
 */
export function applyFeedingAnswer(
  session: FeedingSession,
  value: unknown,
): ApplyAnswerResult {
  const step = feedingFlow.steps[session.stepIndex];

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
