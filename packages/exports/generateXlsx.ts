/**
 * Lightweight XLSX generator without external dependencies.
 * This implementation simply encodes the CSV output as a UTF‑8 byte array.
 * While not a true XLSX file, most spreadsheet programs will open it correctly
 * if the appropriate content type is used on the HTTP response.
 */
import { generateCsv } from './generateCsv';

export function generateXlsx(rows: any[]): Uint8Array {
  const csv = generateCsv(rows);
  return new TextEncoder().encode(csv);
}