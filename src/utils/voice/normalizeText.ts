export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[’ʼ']/g, '')
    .replace(/[^a-zа-яіїєґäöüß0-9\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
