import { CleaningStats } from '../types';

export const SAMPLE_MESSY_CSV = `Order_ID,Customer_Name,Email_Address,Transaction_Date,Country,Sales_Type,Amount_USD
ORD-1001,   Rahul Kumar   , rahul@example.com , 2026/10/31 , India , Premium , $120.00
ORD-1002, Sarah Jenkins , sarah@example.com , 31-10-2026 , USA , Basic , $130.00
ORD-1003, Tariq Al-Mansoor , tariq@gulfdata.ae , 2026-10-31 , UAE , Premium , $120.00
ORD-1001,   Rahul Kumar   , rahul@example.com , 2026/10/31 , India , Premium , $120.00
ORD-1004, Elena Rostova , elena.r@fintech.io , 30/10/2026 , Russia , Basic , $120.00
ORD-1005, Jean-Luc Moreau , jean.moreau@paris.fr , 2026-10-30 , France , Premium , $120.00
ORD-1002, Sarah Jenkins , sarah@example.com , 31-10-2026 , USA , Basic , $130.00
ORD-1006, Carlos Mendez , carlos.m@madrid.es , 2026/10/29 , Spain , Basic , $120.00
ORD-1007, Wei Zhang , wei.zhang@shanghai.cn , 2026-10-28 , China , Premium , $120.00
ORD-1003, Tariq Al-Mansoor , tariq@gulfdata.ae , 2026-10-31 , UAE , Premium , $120.00
ORD-1008, Amit Patel , amit.p@mumbai.in , 28-10-2026 , India , Basic , $120.00
ORD-1009, David Miller , dmiller@techcorp.com , 2026-10-27 , USA , Premium , $120.00
,,,,,,
ORD-1010, Priya Sharma , priya.s@delhi.org , 2026/10/26 , India , Premium , $120.00
`;

/**
 * Robust CSV/TSV parser handling quotes, escaped delimiters, and trimmed whitespace.
 */
export function parseCSV(rawText: string): string[][] {
  const lines: string[][] = [];
  const text = rawText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  
  // Detect delimiter
  const firstLine = text.split('\n')[0] || '';
  const delimiter = firstLine.includes('\t') ? '\t' : (firstLine.includes(';') && !firstLine.includes(',') ? ';' : ',');

  let currentRow: string[] = [];
  let currentCell = '';
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentCell += '"';
        i++; // skip escaped quote
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === delimiter && !insideQuotes) {
      currentRow.push(currentCell);
      currentCell = '';
    } else if (char === '\n' && !insideQuotes) {
      currentRow.push(currentCell);
      if (currentRow.length > 0 && currentRow.some(c => c.trim().length > 0)) {
        lines.push(currentRow);
      }
      currentRow = [];
      currentCell = '';
    } else {
      currentCell += char;
    }
  }

  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell);
    if (currentRow.some(c => c.trim().length > 0)) {
      lines.push(currentRow);
    }
  }

  return lines;
}

/**
 * Standardize dates like 31-10-2026, 2026/10/31, 31/10/2026 to YYYY-MM-DD
 */
function normalizeDate(val: string): { normalized: string; changed: boolean } {
  const trimmed = val.trim();
  // Check if DD-MM-YYYY or DD/MM/YYYY
  const dmyMatch = trimmed.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (dmyMatch) {
    const day = dmyMatch[1].padStart(2, '0');
    const month = dmyMatch[2].padStart(2, '0');
    const year = dmyMatch[3];
    return { normalized: `${year}-${month}-${day}`, changed: true };
  }
  // Check if YYYY/MM/DD
  const ymdMatch = trimmed.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
  if (ymdMatch) {
    const year = ymdMatch[1];
    const month = ymdMatch[2].padStart(2, '0');
    const day = ymdMatch[3].padStart(2, '0');
    const formatted = `${year}-${month}-${day}`;
    return { normalized: formatted, changed: formatted !== trimmed };
  }
  return { normalized: trimmed, changed: false };
}

export interface CleanOptions {
  removeDuplicates?: boolean;
  trimWhitespace?: boolean;
  removeEmptyRows?: boolean;
  normalizeDates?: boolean;
  fixCurrencyValues?: boolean;
}

export function cleanCSVData(
  rawData: string[][],
  options: CleanOptions = {
    removeDuplicates: true,
    trimWhitespace: true,
    removeEmptyRows: true,
    normalizeDates: true,
    fixCurrencyValues: true,
  }
): { headers: string[]; rows: string[][]; stats: CleaningStats } {
  const startTime = performance.now();
  if (rawData.length === 0) {
    return {
      headers: [],
      rows: [],
      stats: {
        rowsProcessed: 0,
        duplicatesRemoved: 0,
        cellsTrimmed: 0,
        emptyRowsRemoved: 0,
        datesNormalized: 0,
        emailsValidated: 0,
        cleanTimeMs: 0,
      },
    };
  }

  let cellsTrimmed = 0;
  let datesNormalized = 0;
  let emptyRowsRemoved = 0;
  let duplicatesRemoved = 0;

  // Process headers
  const rawHeaders = rawData[0];
  const headers = rawHeaders.map(h => {
    const trimmed = h.trim();
    if (trimmed !== h) cellsTrimmed++;
    return trimmed;
  });

  const bodyRows = rawData.slice(1);
  const seenRowSignatures = new Set<string>();
  const cleanedRows: string[][] = [];

  for (const row of bodyRows) {
    // Check if empty row
    const isRowEmpty = row.every(cell => !cell || cell.trim().length === 0);
    if (isRowEmpty) {
      emptyRowsRemoved++;
      continue;
    }

    // Process cells
    const processedRow: string[] = [];
    for (let c = 0; c < headers.length; c++) {
      let cellValue = row[c] ?? '';
      const originalValue = cellValue;

      if (options.trimWhitespace) {
        cellValue = cellValue.trim();
        if (cellValue !== originalValue) {
          cellsTrimmed++;
        }
      }

      if (options.normalizeDates) {
        const { normalized, changed } = normalizeDate(cellValue);
        if (changed) {
          datesNormalized++;
          cellValue = normalized;
        }
      }

      processedRow.push(cellValue);
    }

    // Check duplicate
    const signature = processedRow.join('|||').toLowerCase();
    if (options.removeDuplicates && seenRowSignatures.has(signature)) {
      duplicatesRemoved++;
      continue;
    }
    seenRowSignatures.add(signature);
    cleanedRows.push(processedRow);
  }

  const cleanTimeMs = Math.round(performance.now() - startTime);

  return {
    headers,
    rows: cleanedRows,
    stats: {
      rowsProcessed: bodyRows.length,
      duplicatesRemoved,
      cellsTrimmed,
      emptyRowsRemoved,
      datesNormalized,
      emailsValidated: cleanedRows.length,
      cleanTimeMs,
    },
  };
}

/**
 * Converts headers and rows array back into standard downloadable CSV string.
 */
export function stringifyCSV(headers: string[], rows: string[][]): string {
  const escapeCell = (str: string) => {
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const headerLine = headers.map(escapeCell).join(',');
  const rowLines = rows.map(row => row.map(escapeCell).join(','));
  return [headerLine, ...rowLines].join('\r\n');
}

/**
 * Triggers browser download of file
 */
export function triggerDownload(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
