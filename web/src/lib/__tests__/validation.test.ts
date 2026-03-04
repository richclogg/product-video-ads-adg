import { describe, it, expect } from 'vitest';
import { validateValue, validateRow } from '../validation';
import { ColumnName } from '../types';

describe('validateValue', () => {
  it('accepts valid enum values', () => {
    expect(validateValue(ColumnName.elementType, 'Text')).toBeUndefined();
    expect(validateValue(ColumnName.elementType, 'Image')).toBeUndefined();
  });

  it('rejects invalid enum values', () => {
    expect(validateValue(ColumnName.elementType, 'Video')).toBeDefined();
  });

  it('accepts valid numeric ranges', () => {
    expect(validateValue(ColumnName.offsetS, '0')).toBeUndefined();
    expect(validateValue(ColumnName.offsetS, '3600')).toBeUndefined();
    expect(validateValue(ColumnName.textSize, '50')).toBeUndefined();
  });

  it('rejects out-of-range numbers', () => {
    expect(validateValue(ColumnName.offsetS, '-1')).toBeDefined();
    expect(validateValue(ColumnName.offsetS, '3601')).toBeDefined();
    expect(validateValue(ColumnName.textSize, '0')).toBeDefined();
    expect(validateValue(ColumnName.textSize, '1001')).toBeDefined();
  });

  it('accepts valid hex colors', () => {
    expect(validateValue(ColumnName.textColor, '#ff0000')).toBeUndefined();
    expect(validateValue(ColumnName.textColor, '#FFF')).toBeUndefined();
  });

  it('accepts empty values', () => {
    expect(validateValue(ColumnName.offsetS, '')).toBeUndefined();
    expect(validateValue(ColumnName.elementType, '')).toBeUndefined();
  });

  it('validates dataField against offer columns', () => {
    const cols = ['Title', 'Price', 'Image'];
    expect(
      validateValue(ColumnName.dataField, 'Title', cols)
    ).toBeUndefined();
    expect(
      validateValue(ColumnName.dataField, 'Missing', cols)
    ).toBeDefined();
  });

  it('accepts zoom values', () => {
    expect(validateValue(ColumnName.zoomEffect, 'in')).toBeUndefined();
    expect(validateValue(ColumnName.zoomEffect, 'out')).toBeUndefined();
    expect(validateValue(ColumnName.zoomAmount, '1.5')).toBeUndefined();
  });

  it('rejects invalid zoom values', () => {
    expect(validateValue(ColumnName.zoomEffect, 'zoom')).toBeDefined();
    expect(validateValue(ColumnName.zoomAmount, '0.5')).toBeDefined();
    expect(validateValue(ColumnName.zoomAmount, '4')).toBeDefined();
  });
});

describe('validateRow', () => {
  it('returns empty errors for valid row', () => {
    const row = {
      [ColumnName.elementType]: 'Text',
      [ColumnName.offsetX]: '100',
    };
    expect(Object.keys(validateRow(row))).toHaveLength(0);
  });

  it('returns errors for invalid fields', () => {
    const row = {
      [ColumnName.elementType]: 'Invalid',
      [ColumnName.offsetS]: '9999',
    };
    const errors = validateRow(row);
    expect(errors[ColumnName.elementType]).toBeDefined();
    expect(errors[ColumnName.offsetS]).toBeDefined();
  });
});
