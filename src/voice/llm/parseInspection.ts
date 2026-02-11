import dotenv from 'dotenv';

import OpenAI from 'openai';
import {INSPECTION_SYSTEM_PROMPT} from './prompts/inspection.system';
import {INSPECTION_LLM_SCHEMA} from '../schema/inspection';
import {buildInspectionUserPrompt} from './prompts/inspection.user';

// SYSTEM prompt
// const systemPrompt = `
// You are a parser.
// Return ONLY valid JSON.
// No explanations.
// No text.
// No markdown.
// `;

// USER prompt
// function buildUserPrompt(text: string) {
//   return `
// Convert the following voice command into JSON
// using this schema:

// {
//   "hiveNumber": number,
//   "strength": number | null,
//   "honeyKg": number | null,
//   "queen": "present" | "absent" | "unknown" | null,
//   "stop": boolean | null
// }

// Rules:
// - If a field is not mentioned, use null
// - Do not guess
// - Numbers must be numbers, not words

// Voice command:
// "${text}"
// `;
// }

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function parseInspection(text: string) {
  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0,
    messages: [
      {role: 'system', content: INSPECTION_SYSTEM_PROMPT},
      {
        role: 'user',
        content: buildInspectionUserPrompt(text, INSPECTION_LLM_SCHEMA),
      },
    ],
  });

  return JSON.parse(response.choices[0].message.content!);
}
