import { parseCSV } from "../../csv/parseCSV.js";
import { generateCandidates } from "../../blocking/generateCandidates.js";
import { evaluateBlocking } from "../evaluateBlocking.js";

import type {
  CSVBlockingEvaluationOptions,
  CSVBlockingEvaluationResult,
} from "./types.js";

export function evaluateBlockingCSV(
  sourceCSV: string,
  targetCSV: string,
  options: CSVBlockingEvaluationOptions,
): CSVBlockingEvaluationResult {
  const {
    groundTruth,
    sourceParseOptions,
    targetParseOptions,
    ...blockingOptions
  } = options;

  const sourceResult = parseCSV(sourceCSV, sourceParseOptions);
  const targetResult = parseCSV(targetCSV, targetParseOptions);

  const candidates = generateCandidates(
    sourceResult.records,
    targetResult.records,
    blockingOptions,
  );

  const evaluation = evaluateBlocking({
    candidates,
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
