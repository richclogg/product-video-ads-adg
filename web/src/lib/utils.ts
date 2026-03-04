import { ColumnName } from './types';

/** Convert CamelCase to lower_snake_case. */
export function camelCaseToSnakeCase(str: string): string {
  return str
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
    .replace(/([a-z\d])([A-Z])/g, '$1_$2')
    .toLowerCase();
}

/** Look up the enum key for a ColumnName value, then convert to snake_case. */
export function deriveFieldKey(columnName: ColumnName): string {
  const key = Object.keys(ColumnName).find(
    (k) => ColumnName[k as keyof typeof ColumnName] === columnName
  );
  if (!key) {
    throw new Error(`Unexpected column name "${columnName}".`);
  }
  return camelCaseToSnakeCase(key);
}

/** SHA-256 checksum of a JSON-serialised object (browser crypto API). */
export async function getChecksum(obj: object): Promise<string> {
  const data = new TextEncoder().encode(JSON.stringify(obj));
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** Returns true if the array contains duplicate values. */
export function hasDuplicates(arr: unknown[]): boolean {
  const seen = new Set();
  for (const element of arr) {
    if (seen.has(element)) return true;
    seen.add(element);
  }
  return false;
}

/** Generate a random string for folder naming. */
export function getRandStr(): string {
  return Math.random().toString(36).slice(2);
}
