export const INSPECTION_LLM_SCHEMA = `
{
  "hiveNumber": number,
  "strength": number | null,
  "honeyKg": number | null,
  "broodFrames": number | null,
  "queen": "present" | "absent" | "unknown" | null,
  "syrupLiters": number | null,
  "stop": boolean | null
}
`;

import {z} from 'zod';

export const InspectionSchema = z.object({
  hiveNumber: z.number(),
  strength: z.number().nullable().optional(),
  honeyKg: z.number().nullable().optional(),
  broodFrames: z.number().nullable().optional(),
  queen: z.enum(['present', 'absent', 'unknown']).nullable().optional(),
  syrupLiters: z.number().nullable().optional(),
  stop: z.boolean().nullable().optional(),
});

export type InspectionCommand = z.infer<typeof InspectionSchema>;
