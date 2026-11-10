interface FieldScore {
  score: number;
  weight: number;
}

export function calculateWeightedScore(fieldScores: FieldScore[]): number | null {
  let weightedSum = 0;
  let totalWeight = 0;

  for (const field of fieldScores) {
    if (field.weight <= 0) {
      continue;
    }

    weightedSum += field.score * field.weight;
    totalWeight += field.weight;
  }

  if (totalWeight === 0) {
    return null;
  }

  return weightedSum / totalWeight;
}
