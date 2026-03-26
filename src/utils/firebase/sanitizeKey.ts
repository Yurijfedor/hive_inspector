export function sanitizeFirebaseKey(key: string): string {
  return key.replace(/[.#$\[\]]/g, '_');
}
