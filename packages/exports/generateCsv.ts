/**
 * Simple CSV generator (UTF-8 with BOM) without external dependencies.
 * Accepts an array of plain objects (rows) and produces a comma‑separated string.
 * Values containing commas, quotes or newlines are properly escaped with double quotes.
 */
export function generateCsv(rows: any[]): string {
  const normalized = Array.isArray(rows) ? rows : [];
  if (normalized.length === 0) return '\uFEFF';
  // Determine header keys from union of all keys
  const headers = Array.from(
    normalized.reduce<Set<string>>((acc, row) => {
      Object.keys(row || {}).forEach((k) => acc.add(k));
      return acc;
    }, new Set())
  );
  const escape = (value: any) => {
    if (value === null || value === undefined) return '';
    const s = String(value);
    return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  };
  const headerLine = headers.map(escape).join(',');
  const dataLines = normalized.map((row) => headers.map((h) => escape(row?.[h])).join(','));
  // Prepend BOM for UTF‑8 to help Excel read correctly
  return '\uFEFF' + [headerLine, ...dataLines].join('\r\n');
}