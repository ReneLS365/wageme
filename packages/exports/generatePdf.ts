/**
 * Minimal PDF generator without external dependencies.
 * Produces a simple single‑page PDF listing each object as a line of text.
 * This generator uses basic PDF syntax and should work for small exports.
 */
function pdfEscape(text: string): string {
  // Escape parentheses and backslashes in PDF text
  return text.replace(/([()\\])/g, '\\$1');
}

export async function generatePdf(rows: any[]): Promise<Uint8Array> {
  const header = '%PDF-1.4\n';
  // Build content stream lines
  const lines: string[] = [];
  lines.push('BT /F1 10 Tf 50 792 Td (Export) Tj ET');
  let y = 776;
  const toText = (obj: any) =>
    Object.entries(obj || {})
      .map(([k, v]) => `${k}: ${String(v ?? '')}`)
      .join(' | ');
  const maxLines = 40;
  const total = Array.isArray(rows) ? rows.length : 0;
  for (let i = 0; i < Math.min(total, maxLines); i++) {
    const escaped = pdfEscape(toText(rows[i]));
    lines.push(`BT /F1 9 Tf 50 ${y} Td (${escaped}) Tj ET`);
    y -= 12;
    if (y < 50) break;
  }
  const streamContent = lines.join('\n');
  // Define PDF objects
  const obj1 = '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n';
  const obj2 = '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n';
  const obj3 = '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n';
  const obj4 = `4 0 obj\n<< /Length ${streamContent.length} >>\nstream\n${streamContent}\nendstream\nendobj\n`;
  const obj5 = '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n';
  // Concatenate all objects and compute xref offsets
  const body = header + obj1 + obj2 + obj3 + obj4 + obj5;
  const offsets: number[] = [];
  let cursor = header.length;
  for (const part of [obj1, obj2, obj3, obj4, obj5]) {
    offsets.push(cursor);
    cursor += part.length;
  }
  let xref = 'xref\n0 6\n0000000000 65535 f \n';
  xref += offsets
    .map((o) => String(o).padStart(10, '0') + ' 00000 n \n')
    .join('');
  const startxref = body.length;
  const trailer = `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${startxref}\n%%EOF`;
  const pdf = body + xref + trailer;
  return new TextEncoder().encode(pdf);
}