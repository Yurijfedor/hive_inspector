export function buildInspectionUserPrompt(text: string, schema: string) {
  return `
Convert the following voice command into JSON
using this schema:

${schema}

Rules:
- If a field is not mentioned, use null
- Do not guess
- Numbers must be numbers, not words

Voice command:
"${text}"
`;
}
