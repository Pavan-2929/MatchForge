import { describe, it, expect } from "vitest";
import { evaluateBlocking } from "../../src/blocking-evaluation/evaluateBlocking.js";

import type { CandidateGenerationResult } from "../../src/blocking/types.js";
import type { GroundTruthPair } from "../../src/evaluation/types.js";

const candidates: CandidateGenerationResult = {
  pairs: [
    { sourceIndex: 0, targetIndex: 0 },
    { sourceIndex: 0, targetIndex: 1 },
    { sourceIndex: 1, targetIndex: 2 },
  ],
  stats: {
    totalSourceRecords: 2,
    totalTargetRecords: 3,
    totalPossiblePairs: 6,
    candidatePairs: 3,
    reductionPercentage: 50,
  },
};

const groundTruth: GroundTruthPair[] = [
  { sourceIndex: 0, targetIndex: 0, isMatch: true },
  { sourceIndex: 0, targetIndex: 1, isMatch: false },
  { sourceIndex: 0, targetIndex: 2, isMatch: true },
  { sourceIndex: 1, targetIndex: 1, isMatch: false },
  { sourceIndex: 1, targetIndex: 2, isMatch: true },
];

describe("evaluateBlocking", () => {
  it("should calculate blocking evaluation metrics correctly", () => {
    const result = evaluateBlocking({
      candidates,
      groundTruth,
    });

    expect(result.metrics).toEqual({
      candidateRecall: 2 / 3,
      candidatePrecision: 2 / 3,
      reductionRatio: 0.5,
    });

    expect(result.totalPossiblePairs).toBe(6);
    expect(result.totalCandidatePairs).toBe(3);
    expect(result.totalEvaluatedPairs).toBe(5);
    expect(result.totalLabelledCandidatePairs).toBe(3);
    expect(result.trueCandidatePairs).toBe(2);
    expect(result.totalTruePairs).toBe(3);
  });

  it("should not treat unlabelled candidate pairs as false positives", () => {
    const result = evaluateBlocking({
      candidates,
      groundTruth: [
        { sourceIndex: 0, targetIndex: 0, isMatch: true },
        { sourceIndex: 0, targetIndex: 2, isMatch: true },
      ],
    });

    expect(result.metrics.candidatePrecision).toBe(1);
    expect(result.metrics.candidateRecall).toBe(0.5);
     expect(result.totalLabelledCandidatePairs).toBe(1);
  });

  it("should return zero recall when no true pairs exist", () => {
    const result = evaluateBlocking({
      candidates,
      groundTruth: [
        { sourceIndex: 0, targetIndex: 1, isMatch: false },
        { sourceIndex: 1, targetIndex: 1, isMatch: false },
      ],
    });

    expect(result.metrics.candidateRecall).toBe(0);
    expect(result.metrics.candidatePrecision).toBe(0);
  });

  it("should return zero precision when no candidate pairs are labelled", () => {
    const result = evaluateBlocking({
      candidates,
      groundTruth: [
        { sourceIndex: 0, targetIndex: 2, isMatch: true },
        { sourceIndex: 1, targetIndex: 1, isMatch: false },
      ],
    });

    expect(result.metrics.candidatePrecision).toBe(0);
    expect(result.totalLabelledCandidatePairs).toBe(0);
  });

  it("should return zero recall when no true pairs survive blocking", () => {
    const result = evaluateBlocking({
      candidates,
      groundTruth: [
        { sourceIndex: 0, targetIndex: 2, isMatch: true },
        { sourceIndex: 1, targetIndex: 1, isMatch: true },
      ],
    });

    expect(result.metrics.candidateRecall).toBe(0);
    expect(result.trueCandidatePairs).toBe(0);
  });

  it("should handle empty ground truth", () => {
    const result = evaluateBlocking({
      candidates,
      groundTruth: [],
    });

    expect(result.metrics).toEqual({
      candidateRecall: 0,
      candidatePrecision: 0,
      reductionRatio: 0.5,
    });

    expect(result.totalEvaluatedPairs).toBe(0);
  });

  it("should handle empty candidate pairs", () => {
    const emptyCandidates: CandidateGenerationResult = {
      pairs: [],
      stats: {
        totalSourceRecords: 2,
        totalTargetRecords: 3,
        totalPossiblePairs: 6,
        candidatePairs: 0,
        reductionPercentage: 100,
      },
    };

    const result = evaluateBlocking({
      candidates: emptyCandidates,
      groundTruth,
    });

    expect(result.metrics).toEqual({
      candidateRecall: 0,
      candidatePrecision: 0,
      reductionRatio: 1,
    });
  });

  it("should handle empty datasets", () => {
    const emptyCandidates: CandidateGenerationResult = {
      pairs: [],
      stats: {
        totalSourceRecords: 0,
        totalTargetRecords: 0,
        totalPossiblePairs: 0,
        candidatePairs: 0,
        reductionPercentage: 0,
      },
    };

    const result = evaluateBlocking({
      candidates: emptyCandidates,
      groundTruth: [],
    });

    expect(result.metrics).toEqual({
      candidateRecall: 0,
      candidatePrecision: 0,
      reductionRatio: 0,
    });
  });

  it("should reject invalid evaluation options", () => {
    expect(() => evaluateBlocking(null as never)).toThrow(
      "Valid blocking evaluation options are required.",
    );
  });

  it("should reject invalid candidate generation results", () => {
    expect(() =>
      evaluateBlocking({
        candidates: null as never,
        groundTruth: [],
      }),
    ).toThrow("Valid candidate generation results are required.");
  });

  it("should reject invalid source indexes in ground truth", () => {
    expect(() =>
      evaluateBlocking({
        candidates,
        groundTruth: [{ sourceIndex: 2, targetIndex: 0, isMatch: true }],
      }),
    ).toThrow("Invalid source index: 2.");
  });

  it("should reject invalid target indexes in ground truth", () => {
    expect(() =>
      evaluateBlocking({
        candidates,
        groundTruth: [{ sourceIndex: 0, targetIndex: 3, isMatch: true }],
      }),
    ).toThrow("Invalid target index: 3.");
  });

  it("should reject duplicate ground-truth pairs", () => {
    expect(() =>
      evaluateBlocking({
        candidates,
        groundTruth: [
          { sourceIndex: 0, targetIndex: 0, isMatch: true },
          { sourceIndex: 0, targetIndex: 0, isMatch: false },
        ],
      }),
    ).toThrow("Duplicate ground-truth pair: (0, 0).");
  });

  it("should reject invalid candidate source indexes", () => {
    const invalidCandidates: CandidateGenerationResult = {
      ...candidates,
      pairs: [{ sourceIndex: 2, targetIndex: 0 }, ...candidates.pairs.slice(1)],
    };

    expect(() =>
      evaluateBlocking({
        candidates: invalidCandidates,
        groundTruth: [],
      }),
    ).toThrow("Invalid candidate source index: 2.");
  });

  it("should reject invalid candidate target indexes", () => {
    const invalidCandidates: CandidateGenerationResult = {
      ...candidates,
      pairs: [{ sourceIndex: 0, targetIndex: 3 }, ...candidates.pairs.slice(1)],
    };

    expect(() =>
      evaluateBlocking({
        candidates: invalidCandidates,
        groundTruth: [],
      }),
    ).toThrow("Invalid candidate target index: 3.");
  });

  it("should reject duplicate candidate pairs", () => {
    const duplicateCandidates: CandidateGenerationResult = {
      ...candidates,
      pairs: [...candidates.pairs, { sourceIndex: 0, targetIndex: 0 }],
      stats: {
        ...candidates.stats,
        candidatePairs: 4,
      },
    };

    expect(() =>
      evaluateBlocking({
        candidates: duplicateCandidates,
        groundTruth: [],
      }),
    ).toThrow("Duplicate candidate pair: (0, 0).");
  });

  it("should reject inconsistent candidate counts", () => {
    const invalidCandidates: CandidateGenerationResult = {
      ...candidates,
      stats: {
        ...candidates.stats,
        candidatePairs: 2,
      },
    };

    expect(() =>
      evaluateBlocking({
        candidates: invalidCandidates,
        groundTruth: [],
      }),
    ).toThrow("Candidate pairs count does not match candidate pairs.");
  });
});
