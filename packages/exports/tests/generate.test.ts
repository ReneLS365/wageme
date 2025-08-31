import { describe, expect, it } from 'vitest';
import { generateCsv, generateXlsx } from '../index';

describe('exports', () => {
  it('generates CSV', () => {
    const rows = [
      { a: 1, b: 'foo' },
      { a: 2, b: 'bar' }
    ];
    const csv = generateCsv(rows);
    expect(csv).toContain('a;b');
    expect(csv.split('\n').length).toBe(3);
  });
  it('generates XLSX buffer', () => {
    const rows = [{ x: 'y' }];
    const buf = generateXlsx(rows);
    expect(buf.byteLength).toBeGreaterThan(0);
  });
});