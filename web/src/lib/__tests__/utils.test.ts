import { describe, it, expect } from 'vitest';
import {
  camelCaseToSnakeCase,
  deriveFieldKey,
  hasDuplicates,
  getRandStr,
} from '../utils';
import { ColumnName } from '../types';

describe('camelCaseToSnakeCase', () => {
  it('converts simple camelCase', () => {
    expect(camelCaseToSnakeCase('offsetX')).toBe('offset_x');
    expect(camelCaseToSnakeCase('offsetY')).toBe('offset_y');
  });

  it('handles consecutive capitals', () => {
    expect(camelCaseToSnakeCase('imageURL')).toBe('image_url');
  });

  it('handles multi-word camelCase', () => {
    expect(camelCaseToSnakeCase('templateVideo')).toBe('template_video');
    expect(camelCaseToSnakeCase('textAlignment')).toBe('text_alignment');
  });

  it('handles already lowercase', () => {
    expect(camelCaseToSnakeCase('offset')).toBe('offset');
  });
});

describe('deriveFieldKey', () => {
  it('derives snake_case from ColumnName enum', () => {
    expect(deriveFieldKey(ColumnName.offsetS)).toBe('offset_s');
    expect(deriveFieldKey(ColumnName.templateVideo)).toBe('template_video');
    expect(deriveFieldKey(ColumnName.adGroup)).toBe('ad_group');
    expect(deriveFieldKey(ColumnName.elementId)).toBe('element_id');
    expect(deriveFieldKey(ColumnName.textColor)).toBe('text_color');
    expect(deriveFieldKey(ColumnName.imageWidth)).toBe('image_width');
    expect(deriveFieldKey(ColumnName.zoomEffect)).toBe('zoom_effect');
    expect(deriveFieldKey(ColumnName.zoomAmount)).toBe('zoom_amount');
  });

  it('throws for invalid column name', () => {
    expect(() => deriveFieldKey('bogus' as ColumnName)).toThrow();
  });
});

describe('hasDuplicates', () => {
  it('returns false for unique array', () => {
    expect(hasDuplicates([1, 2, 3])).toBe(false);
  });

  it('returns true for array with duplicates', () => {
    expect(hasDuplicates([1, 2, 2])).toBe(true);
  });

  it('works with strings', () => {
    expect(hasDuplicates(['a', 'b', 'a'])).toBe(true);
    expect(hasDuplicates(['a', 'b', 'c'])).toBe(false);
  });

  it('returns false for empty array', () => {
    expect(hasDuplicates([])).toBe(false);
  });
});

describe('getRandStr', () => {
  it('returns a non-empty string', () => {
    const result = getRandStr();
    expect(result.length).toBeGreaterThan(0);
  });

  it('returns different values', () => {
    const a = getRandStr();
    const b = getRandStr();
    expect(a).not.toBe(b);
  });
});
