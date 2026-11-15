import type { BlockingEvaluationMetrics } from "./types.js";

interface BlockingMetricCounts {
  trueCandidatePairs: number;
  totalTruePairs: number;
  totalLabelledCandidatePairs: number;
  totalCandidatePairs: number;
  totalPossiblePairs: number;
}

export function calculateBlockingMetrics(
  counts: BlockingMetricCounts,
): BlockingEvaluationMetrics {
  const {
    trueCandidatePairs,
    totalTruePairs,
    totalLabelledCandidatePairs,
    totalCandidatePairs,
    totalPossiblePairs,
  } = counts;

  const candidateRecall =
    totalTruePairs === 0 ? 0 : trueCandidatePairs / totalTruePairs;

  const candidatePrecision =
    totalLabelledCandidatePairs === 0
      ? 0
      : trueCandidatePairs / totalLabelledCandidatePairs;

  const reductionRatio =
    totalPossiblePairs === 0 ? 0 : 1 - totalCandidatePairs / totalPossiblePairs;

  return {
    candidateRecall,
    candidatePrecision,
    reductionRatio,
  };
}
