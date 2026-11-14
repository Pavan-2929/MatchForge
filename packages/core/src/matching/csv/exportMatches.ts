import Papa from "papaparse";

import type { CSVMatchResult, CSVExportOptions } from "../../csv/types.js";

export function exportMatches(
  result: CSVMatchResult,
  options: CSVExportOptions = {},
): string {
  const fields = [
    "source_record_number",
    "target_record_number",
    "matched",
    "score",
    "method",
    ...result.sourceHeaders.map((header) => `source_${header}`),
    ...result.targetHeaders.map((header) => `target_${header}`),
  ];

  const rows: Record<string, string>[] = [];

  for (const match of result.matches) {
    const candidates = match.candidates.length ? match.candidates : [null];

    for (const candidate of candidates) {
      const row: Record<string, string> = {
        source_record_number: String(match.sourceRecordNumber),
        target_record_number: candidate
          ? String(candidate.targetRecordNumber)
          : "",
        matched: String(match.matched),
        score: candidate ? String(candidate.score) : "",
        method: candidate?.method ?? "",
      };

      for (const header of result.sourceHeaders) {
        row[`source_${header}`] = match.source[header] ?? "";
      }

      for (const header of result.targetHeaders) {
        row[`target_${header}`] = candidate?.record[header] ?? "";
      }

      rows.push(row);
    }
  }

  return Papa.unparse(
    { fields, data: rows },
    { delimiter: options.delimiter ?? "," },
  );
}
