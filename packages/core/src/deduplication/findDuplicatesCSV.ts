import { parseCSV } from "../csv/parseCSV.js";
import { findDuplicates } from "./findDuplicates.js";

import type { DuplicateOptions, DuplicateCSVResult } from "./types.js";

export function findDuplicatesCSV(
  csvText: string,
  options: DuplicateOptions,
): DuplicateCSVResult {
  const parsed = parseCSV(csvText);

  const result = findDuplicates(parsed.records, options);

  return {
    ...result,
    records: parsed.records,
    headers: parsed.headers,
    parseErrors: parsed.errors,
  };
}
