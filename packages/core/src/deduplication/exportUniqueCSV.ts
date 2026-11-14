import Papa from "papaparse";

import type { DuplicateCSVResult, UniqueCSVExportOptions } from "./types.js";

export function exportUniqueCSV(
  result: DuplicateCSVResult,
  options: UniqueCSVExportOptions = {},
): string {
  const keep = options.keep ?? "most-complete";

  const duplicateRecords = new Set(
    result.duplicateGroups.flatMap((group) => group.records),
  );

  const selectedRecords = new Set();

  for (const group of result.duplicateGroups) {
    if (keep === "exclude") {
      continue;
    }

    let selectedRecord = group.records[0];

    if (keep === "most-complete") {
      let highestCount = 0;

      for (const record of group.records) {
        const count = Object.values(record).filter(
          (value) => value.trim() !== "",
        ).length;

        if (count > highestCount) {
          highestCount = count;
          selectedRecord = record;
        }
      }
    }

    selectedRecords.add(selectedRecord);
  }

  const recordsToExport = [];

  for (const record of result.records) {
    const isDuplicate = duplicateRecords.has(record);
    const isSelected = selectedRecords.has(record);

    if (!isDuplicate || isSelected) {
      recordsToExport.push(record);
    }
  }

  return Papa.unparse({
    fields: result.headers,
    data: recordsToExport,
  });
}
