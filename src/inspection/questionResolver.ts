import {InspectionSession} from './inspectionSession';
import {inspectionFlow} from './flow/inspectionDefinition';

export function getCurrentQuestion(session: InspectionSession): string {
  const step = inspectionFlow.steps[session.stepIndex];
  return step.question;
}
