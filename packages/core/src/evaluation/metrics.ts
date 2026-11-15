import type { ConfusionMatrix, EvaluationMetrics } from "./types.js";

export function calculateMetrics(
  confusionMatrix: ConfusionMatrix,
): EvaluationMetrics {
  const { truePositives, falsePositives, falseNegatives, trueNegatives } =
    confusionMatrix;

  const precisionDenominator = truePositives + falsePositives;
  const recallDenominator = truePositives + falseNegatives;

  const precision =
    precisionDenominator === 0 ? 0 : truePositives / precisionDenominator;

  const recall =
    recallDenominator === 0 ? 0 : truePositives / recallDenominator;

  const f1Denominator = precision + recall;

  const f1Score =
    f1Denominator === 0 ? 0 : (2 * precision * recall) / f1Denominator;

  const total = truePositives + falsePositives + falseNegatives + trueNegatives;

  const accuracy = total === 0 ? 0 : (truePositives + trueNegatives) / total;

  return {
    precision,
    recall,
    f1Score,
    accuracy,
  };
}
