import { parseCSV } from "../../csv/parseCSV.js";
import { matchRecords } from "../../matching/matchRecords.js";
import { evaluateMatches } from "../evaluateMatches.js";

import type { CSVEvaluationOptions, CSVEvaluationResult } from "./types.js";

export function evaluateMatchesCSV(
  sourceCSV: string,
  targetCSV: string,
  options: CSVEvaluationOptions,
): CSVEvaluationResult {
  const {
    groundTruth,
    sourceParseOptions,
    targetParseOptions,
    ...matchingOptions
  } = options;

  const sourceResult = parseCSV(sourceCSV, sourceParseOptions);
  const targetResult = parseCSV(targetCSV, targetParseOptions);

  const predictions = matchRecords(
    sourceResult.records,
    targetResult.records,
    matchingOptions,
  );

  const evaluation = evaluateMatches({
    predictions,
    groundTruth,
  });

  return {
    ...evaluation,
    sourceHeaders: sourceResult.headers,
    targetHeaders: targetResult.headers,
    parseErrors: {
      source: sourceResult.errors,
      target: targetResult.errors,
    },
  };
}
