export function normalizeText(input: unknown): string {
  return String(input ?? '')
    .toLowerCase()
    .trim()
    .replace(/[’ʼ']/g, '')
    .replace(/\s+/g, ' ');
}
