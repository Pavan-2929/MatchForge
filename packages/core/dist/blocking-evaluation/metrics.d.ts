import type { BlockingEvaluationMetrics } from "./types.js";
interface BlockingMetricCounts {
    trueCandidatePairs: number;
    totalTruePairs: number;
    totalLabelledCandidatePairs: number;
    totalCandidatePairs: number;
    totalPossiblePairs: number;
}
export declare function calculateBlockingMetrics(counts: BlockingMetricCounts): BlockingEvaluationMetrics;
export {};
//# sourceMappingURL=metrics.d.ts.map