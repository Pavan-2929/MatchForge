import { calculateMetrics } from "./metrics.js";

import type {
  EvaluationOptions,
  EvaluationResult,
  GroundTruthPair,
} from "./types.js";

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

    const key = `${pair.sourceIndex}:${pair.targetIndex}`;

    if (seenPairs.has(key)) {
      throw new Error(
        `Duplicate ground-truth pair: (${pair.sourceIndex}, ${pair.targetIndex}).`,
      );
    }

    seenPairs.add(key);
  }
}

export function evaluateMatches<S extends object, T extends object>(
  options: EvaluationOptions<S, T>,
): EvaluationResult {
  const { predictions, groundTruth } = options;

  if (!predictions || !Array.isArray(predictions.matches)) {
    throw new TypeError("Valid matching predictions are required.");
  }

  validateGroundTruth(
    groundTruth,
    predictions.totalSourceRecords,
    predictions.totalTargetRecords,
  );

  const predictedPairs = new Set<string>();

  predictions.matches.forEach((match) => {
    match.candidates.forEach((candidate) => {
      predictedPairs.add(`${match.sourceIndex}:${candidate.targetIndex}`);
    });
  });

  const confusionMatrix = {
    truePositives: 0,
    falsePositives: 0,
    falseNegatives: 0,
    trueNegatives: 0,
  };

  for (const pair of groundTruth) {
    const key = `${pair.sourceIndex}:${pair.targetIndex}`;
    const wasPredicted = predictedPairs.has(key);

    if (pair.isMatch && wasPredicted) {
      confusionMatrix.truePositives++;
    } else if (!pair.isMatch && wasPredicted) {
      confusionMatrix.falsePositives++;
    } else if (pair.isMatch && !wasPredicted) {
      confusionMatrix.falseNegatives++;
    } else {
      confusionMatrix.trueNegatives++;
    }
  }

  return {
    confusionMatrix,
    metrics: calculateMetrics(confusionMatrix),
    totalEvaluatedPairs: groundTruth.length,
  };
}
