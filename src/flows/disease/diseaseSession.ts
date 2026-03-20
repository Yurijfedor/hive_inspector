import {diseaseFlow} from './diseaseDefinition';
import {executeStep} from '../flowRuntime';
import {FlowEffect} from '../../conversation/types';

export type DiseaseSession = {
  hiveNumber: number;
  stepIndex: number;
  data: {
    diarrhea?: boolean; // нозема (понос)
    deformedWings?: boolean; // DWV / вароа
    mitesVisible?: boolean; // кліщ
    weakBrood?: boolean; // проблемний розплід
  };
};

export type ApplyAnswerResult =
  | {
      type: 'INVALID';
      message: string;
      session: DiseaseSession;
    }
  | {
      type: 'NEXT';
      session: DiseaseSession;
      effects?: FlowEffect[];
    };

export function createDiseaseSession(hiveNumber: number): DiseaseSession {
  return {
    hiveNumber,
    stepIndex: 0,
    data: {},
  };
}

export function applyAnswer(
  session: DiseaseSession,
  value: unknown,
): ApplyAnswerResult {
  const step = diseaseFlow.steps[session.stepIndex];

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
