import {InspectionSession} from './inspectionSession';
import {inspectionQuestions} from './inspectionFlow';

export function getCurrentQuestion(session: InspectionSession): string {
  return inspectionQuestions[session.step];
}
