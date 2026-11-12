import Papa from "papaparse";
import type { CSVParseOptions, CSVParseResult } from "./types.js";

export function parseCSV(
  csvText: string,
  options: CSVParseOptions = {},
): CSVParseResult {
  const result = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    dynamicTyping: false,
    skipEmptyLines: options.skipEmptyLines ?? true,
    delimiter: options.delimiter ?? "",
  });

  const records = result.data;
  const headers = result.meta.fields ?? [];

  const errors = result.errors.map((error) => ({
    type: error.type,
    code: error.code,
    message: error.message,
    row: error.row,
  }));

  return {
    records,
    headers,
    errors,
    rowCount: records.length,
  };
}
