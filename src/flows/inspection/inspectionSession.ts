import {inspectionFlow} from './inspectionDefinition';
import {executeStep, resolveStep} from '../flowRuntime';
import {FlowEffect} from '../../conversation/types';

export type InspectionSession = {
  hiveNumber: number;
  stepIndex: number;
  data: {
    strength?: number;
    queen?: 'present' | 'absent';
    queenBreed?: string;
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
export function createInspectionSession(hiveNumber: number): InspectionSession {
  return {
    hiveNumber,
    stepIndex: 0,
    data: {},
  };
}

/**
 * Universal declarative applyAnswer (DAY 16)
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

  // 🔥 ВАЖЛИВО — синхронізація stepIndex
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
