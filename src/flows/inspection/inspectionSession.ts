import {inspectionFlow} from './inspectionDefinition';
import {executeStep, resolveStep} from '../flowRuntime';
import {FlowEffect} from '../../conversation/types';

/**
 * 🔥 Hive context (дані з Firebase)
 */
type HiveQueen = {
  status?: 'present' | 'absent';
  breed?: string;
  birthYear?: number;
};

type HiveContext = {
  queen?: HiveQueen;
};

/**
 * 🧠 Inspection session
 */
export type InspectionSession = {
  hiveNumber: number;
  stepIndex: number;

  // 🔥 НОВЕ — контекст вулика
  hiveContext?: HiveContext;

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
 * 🔥 тепер приймає hiveContext
 */
export function createInspectionSession(
  hiveNumber: number,
  hiveContext?: HiveContext,
): InspectionSession {
  return {
    hiveNumber,
    stepIndex: 0,
    hiveContext, // 👈 прокинули контекст
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
