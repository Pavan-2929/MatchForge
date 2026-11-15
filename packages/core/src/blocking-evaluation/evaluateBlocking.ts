import { calculateBlockingMetrics } from "./metrics.js";

import type {
  BlockingEvaluationOptions,
  BlockingEvaluationResult,
} from "./types.js";

import type { GroundTruthPair } from "../evaluation/types.js";
import type { CandidatePair } from "../blocking/types.js";

function getPairKey(sourceIndex: number, targetIndex: number): string {
  return `${sourceIndex}:${targetIndex}`;
}

function validateGroundTruth(
  groundTruth: GroundTruthPair[],
  totalSourceRecords: number,
  totalTargetRecords: number,
): void {
  if (!Array.isArray(groundTruth)) {
    throw new TypeError("Ground truth must be an array.");
  }

  const seenPairs = new Set<string>();

  for (const pair of groundTruth) {
    if (!pair || typeof pair !== "object") {
      throw new TypeError("Invalid ground-truth pair.");
    }

    if (
      !Number.isInteger(pair.sourceIndex) ||
      pair.sourceIndex < 0 ||
      pair.sourceIndex >= totalSourceRecords
    ) {
      throw new Error(`Invalid source index: ${pair.sourceIndex}.`);
    }

    if (
      !Number.isInteger(pair.targetIndex) ||
      pair.targetIndex < 0 ||
      pair.targetIndex >= totalTargetRecords
    ) {
      throw new Error(`Invalid target index: ${pair.targetIndex}.`);
    }

    if (typeof pair.isMatch !== "boolean") {
      throw new TypeError("isMatch must be a boolean.");
    }

    const key = getPairKey(pair.sourceIndex, pair.targetIndex);

    if (seenPairs.has(key)) {
      throw new Error(
        `Duplicate ground-truth pair: (${pair.sourceIndex}, ${pair.targetIndex}).`,
      );
    }

    seenPairs.add(key);
  }
}

function validateCandidates(
  pairs: CandidatePair[],
  totalSourceRecords: number,
  totalTargetRecords: number,
): Set<string> {
  if (!Array.isArray(pairs)) {
    throw new TypeError("Candidate pairs must be an array.");
  }

  const candidatePairs = new Set<string>();

  for (const pair of pairs) {
    if (!pair || typeof pair !== "object") {
      throw new TypeError("Invalid candidate pair.");
    }

    if (
      !Number.isInteger(pair.sourceIndex) ||
      pair.sourceIndex < 0 ||
      pair.sourceIndex >= totalSourceRecords
    ) {
      throw new Error(`Invalid candidate source index: ${pair.sourceIndex}.`);
    }

    if (
      !Number.isInteger(pair.targetIndex) ||
      pair.targetIndex < 0 ||
      pair.targetIndex >= totalTargetRecords
    ) {
      throw new Error(`Invalid candidate target index: ${pair.targetIndex}.`);
    }

    const key = getPairKey(pair.sourceIndex, pair.targetIndex);

    if (candidatePairs.has(key)) {
      throw new Error(
        `Duplicate candidate pair: (${pair.sourceIndex}, ${pair.targetIndex}).`,
      );
    }

    candidatePairs.add(key);
  }

  return candidatePairs;
}

export function evaluateBlocking(
  options: BlockingEvaluationOptions,
): BlockingEvaluationResult {
  if (!options || typeof options !== "object") {
    throw new TypeError("Valid blocking evaluation options are required.");
  }

  const { candidates, groundTruth } = options;

  if (!candidates || typeof candidates !== "object" || !candidates.stats) {
    throw new TypeError("Valid candidate generation results are required.");
  }

  const {
    totalSourceRecords,
    totalTargetRecords,
    totalPossiblePairs,
    candidatePairs: reportedCandidatePairs,
  } = candidates.stats;

  if (
    !Number.isInteger(totalSourceRecords) ||
    totalSourceRecords < 0 ||
    !Number.isInteger(totalTargetRecords) ||
    totalTargetRecords < 0
  ) {
    throw new Error("Invalid dataset record counts.");
  }

  const expectedPossiblePairs = totalSourceRecords * totalTargetRecords;

  if (
    !Number.isInteger(totalPossiblePairs) ||
    totalPossiblePairs !== expectedPossiblePairs
  ) {
    throw new Error("Invalid total possible pairs count.");
  }

  if (
    !Number.isInteger(reportedCandidatePairs) ||
    reportedCandidatePairs < 0 ||
    reportedCandidatePairs > totalPossiblePairs
  ) {
    throw new Error("Invalid candidate pairs count.");
  }

  const candidateSet = validateCandidates(
    candidates.pairs,
    totalSourceRecords,
    totalTargetRecords,
  );

  if (candidateSet.size !== reportedCandidatePairs) {
    throw new Error("Candidate pairs count does not match candidate pairs.");
  }

  validateGroundTruth(groundTruth, totalSourceRecords, totalTargetRecords);

  let totalTruePairs = 0;
  let trueCandidatePairs = 0;
  let totalLabelledCandidatePairs = 0;

  for (const pair of groundTruth) {
    const key = getPairKey(pair.sourceIndex, pair.targetIndex);
    const isCandidate = candidateSet.has(key);

    if (pair.isMatch) {
      totalTruePairs++;

      if (isCandidate) {
        trueCandidatePairs++;
      }
    }

    if (isCandidate) {
      totalLabelledCandidatePairs++;
    }
  }

  const metrics = calculateBlockingMetrics({
    trueCandidatePairs,
    totalTruePairs,
    totalLabelledCandidatePairs,
    totalCandidatePairs: candidateSet.size,
    totalPossiblePairs,
  });

  return {
    metrics,
    totalPossiblePairs,
    totalCandidatePairs: candidateSet.size,
    totalEvaluatedPairs: groundTruth.length,
    totalLabelledCandidatePairs,
    trueCandidatePairs,
    totalTruePairs,
  };
}
