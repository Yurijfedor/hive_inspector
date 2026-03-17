import {InspectionSession} from './inspection/inspectionSession';
import {inspectionFlow} from './inspection/inspectionDefinition';

export function getCurrentQuestion(session: InspectionSession): string {
  const step = inspectionFlow.steps[session.stepIndex];
  return step.question;
}
