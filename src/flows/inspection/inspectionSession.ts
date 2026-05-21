import {inspectionFlow} from './inspectionDefinition';
import {executeStep, resolveStep} from '../flowRuntime';

import {FlowEffect} from '../../conversation/types';

import type {QueenBreed, QueenStatus} from '../../types/queen';

import type {HiveContext} from '../../types/hive';

/**
 * 🧠 Inspection session
 */
export type InspectionSession = {
  hiveNumber: number;

  stepIndex: number;

  // 🔥 hive context from Firebase/cache
  hiveContext?: HiveContext;

  data: {
    strength?: number;

    broodFrames?: number;

    queen?: QueenStatus;

    queenBreed?: QueenBreed;

    queenYear?: number;

    honeyKg?: number;
  };
};

export type ApplyAnswerResult =
  | {
      type: 'INVALID';

      message: string;

      session: InspectionSession;
    }
  | {
      type: 'NEXT';

      session: InspectionSession;

      effects?: FlowEffect[];
    };

/**
 * Create new inspection session
 */
export function createInspectionSession(
  hiveNumber: number,
  hiveContext?: HiveContext,
): InspectionSession {
  return {
    hiveNumber,

    stepIndex: 0,

    hiveContext,

    data: {},
  };
}

/**
 * Universal declarative applyAnswer
 */
export function applyAnswer(
  session: InspectionSession,
  value: unknown,
): ApplyAnswerResult {
  const resolved = resolveStep(inspectionFlow, session);

  if (!resolved) {
    return {
      type: 'INVALID',

      message: 'Flow завершено',

      session,
    };
  }

  const {step, index} = resolved;

  // 🔥 sync runtime index
  const alignedSession: InspectionSession = {
    ...session,

    stepIndex: index,
  };

  const result = executeStep(step, alignedSession, value);

  if (result.type === 'RETRY') {
    return {
      type: 'INVALID',

      message: result.message,

      session: alignedSession,
    };
  }

  return {
    type: 'NEXT',

    session: {
      ...result.session,

      stepIndex: index + 1,
    },

    effects: result.effects,
  };
}
