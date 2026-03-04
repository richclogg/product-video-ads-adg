import { VALUE_RESTRICTIONS, type ValueRestriction } from './constants';

/**
 * Validates a single cell value against its column's restriction.
 * Returns an error message string, or undefined if valid.
 */
export function validateValue(
  columnName: string,
  value: string,
  offerColumns?: string[]
): string | undefined {
  const restriction = VALUE_RESTRICTIONS[columnName];
  if (!restriction) return undefined;

  // Empty values are generally acceptable (unless required by other logic)
  if (value === '' || value === undefined || value === null) return undefined;

  return applyRestriction(restriction, value, columnName, offerColumns);
}

function applyRestriction(
  restriction: ValueRestriction,
  value: string,
  columnName: string,
  offerColumns?: string[]
): string | undefined {
  switch (restriction.type) {
    case 'enum': {
      if (!restriction.values.includes(value)) {
        return `"${columnName}" must be one of: ${restriction.values.filter(Boolean).join(', ')}`;
      }
      return undefined;
    }
    case 'numRange': {
      const num = parseFloat(value);
      if (isNaN(num) || num < restriction.min || num > restriction.max) {
        return `"${columnName}" must be a number between ${restriction.min} and ${restriction.max}`;
      }
      return undefined;
    }
    case 'regex': {
      const regex = new RegExp(restriction.pattern);
      if (!regex.test(value)) {
        return `"${columnName}" has an invalid format`;
      }
      return undefined;
    }
    case 'columnNames': {
      if (offerColumns && !offerColumns.includes(value)) {
        return `"${columnName}" must reference an existing Offers column: ${offerColumns.join(', ')}`;
      }
      return undefined;
    }
  }
}

/**
 * Validate all fields in a row record.
 * Returns a map of column name → error message for invalid fields.
 */
export function validateRow(
  row: Record<string, string>,
  offerColumns?: string[]
): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const [col, val] of Object.entries(row)) {
    const error = validateValue(col, val, offerColumns);
    if (error) {
      errors[col] = error;
    }
  }
  return errors;
}
