import type { MatchingResult } from "../types/matching.js";
export interface GroundTruthPair {
    sourceIndex: number;
    targetIndex: number;
    isMatch: boolean;
}
export interface EvaluationOptions<S extends object, T extends object> {
    predictions: MatchingResult<S, T>;
    groundTruth: GroundTruthPair[];
}
export interface ConfusionMatrix {
    truePositives: number;
    falsePositives: number;
    falseNegatives: number;
    trueNegatives: number;
}
export interface EvaluationMetrics {
    precision: number;
    recall: number;
    f1Score: number;
    accuracy: number;
}
export interface EvaluationResult {
    confusionMatrix: ConfusionMatrix;
    metrics: EvaluationMetrics;
    totalEvaluatedPairs: number;
}
//# sourceMappingURL=types.d.ts.map