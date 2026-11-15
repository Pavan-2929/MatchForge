import type { CandidateGenerationResult } from "../blocking/types.js";
import type { GroundTruthPair } from "../evaluation/types.js";
export interface BlockingEvaluationOptions {
    candidates: CandidateGenerationResult;
    groundTruth: GroundTruthPair[];
}
export interface BlockingEvaluationMetrics {
    candidateRecall: number;
    candidatePrecision: number;
    reductionRatio: number;
}
export interface BlockingEvaluationResult {
    metrics: BlockingEvaluationMetrics;
    totalPossiblePairs: number;
    totalCandidatePairs: number;
    totalEvaluatedPairs: number;
    totalLabelledCandidatePairs: number;
    trueCandidatePairs: number;
    totalTruePairs: number;
}
//# sourceMappingURL=types.d.ts.map