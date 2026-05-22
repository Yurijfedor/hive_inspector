export function normalizeBooleanValue(value: unknown): boolean {
  if (value === true) {
    return true;
  }

  if (value === 'так' || value === 'yes' || value === 'true') {
    return true;
  }

  return false;
}
