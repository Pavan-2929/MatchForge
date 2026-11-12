import { parseCSV } from "./parseCSV.js";
import { matchRecords } from "../matching/matchRecords.js";

import type { CSVMatchOptions, CSVMatchResult } from "./types.js";

export function matchCSV(
  sourceCSV: string,
  targetCSV: string,
  options: CSVMatchOptions,
): CSVMatchResult {
  const { sourceParseOptions, targetParseOptions, ...matchingOptions } =
    options;

  const sourceResult = parseCSV(sourceCSV, sourceParseOptions);
  const targetResult = parseCSV(targetCSV, targetParseOptions);

  const matchingResult = matchRecords(
    sourceResult.records,
    targetResult.records,
    matchingOptions,
  );

  const sourceRecordNumbers = new Map(
    sourceResult.records.map((record, index) => [record, index + 1]),
  );

  const targetRecordNumbers = new Map(
    targetResult.records.map((record, index) => [record, index + 1]),
  );

  const matches = matchingResult.matches.map((match) => ({
    source: match.source,
    sourceRecordNumber: sourceRecordNumbers.get(match.source)!,
    candidates: match.candidates.map((candidate) => ({
      ...candidate,
      targetRecordNumber: targetRecordNumbers.get(candidate.record)!,
    })),
    matched: match.matched,
  }));

  const unmatched = matchingResult.unmatched.map((record) => ({
    record,
    sourceRecordNumber: sourceRecordNumbers.get(record)!,
  }));

  return {
    matches,
    unmatched,
    totalSourceRecords: matchingResult.totalSourceRecords,
    totalTargetRecords: matchingResult.totalTargetRecords,
    sourceHeaders: sourceResult.headers,
    targetHeaders: targetResult.headers,
    parseErrors: {
      source: sourceResult.errors,
      target: targetResult.errors,
    },
  };
}
