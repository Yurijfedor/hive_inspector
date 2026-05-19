export const INSPECTION_SOURCES = {
  VOICE: 'voice',
  MANUAL: 'manual',
  AI: 'ai',
} as const;

export type InspectionSource =
  (typeof INSPECTION_SOURCES)[keyof typeof INSPECTION_SOURCES];
