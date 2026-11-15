import { describe, it, expect } from "vitest";
import { evaluateMatches } from "../../src/evaluation/evaluateMatches.js";

import type { MatchingResult } from "../../src/types/matching.js";

const predictions: MatchingResult<{ name: string }, { name: string }> = {
  matches: [
    {
      source: { name: "Rahul" },
      sourceIndex: 0,
      matched: true,
      candidates: [
        {
          record: { name: "Rahul S." },
          targetIndex: 0,
          score: 0.9,
          method: "jaro-winkler",
          fieldScores: [],
        },
      ],
    },
    {
      source: { name: "Priya" },
      sourceIndex: 1,
      matched: true,
      candidates: [
        {
          record: { name: "Priya P." },
          targetIndex: 1,
          score: 0.9,
          method: "jaro-winkler",
          fieldScores: [],
        },
      ],
    },
  ],
  unmatched: [],
  totalSourceRecords: 2,
  totalTargetRecords: 2,
};

describe("evaluateMatches", () => {
  it("should calculate evaluation metrics correctly", () => {
    const result = evaluateMatches({
      predictions,
      groundTruth: [
        { sourceIndex: 0, targetIndex: 0, isMatch: true },
        { sourceIndex: 0, targetIndex: 1, isMatch: false },
        { sourceIndex: 1, targetIndex: 0, isMatch: false },
        { sourceIndex: 1, targetIndex: 1, isMatch: true },
      ],
    });

    expect(result.confusionMatrix).toEqual({
      truePositives: 2,
      falsePositives: 0,
      falseNegatives: 0,
      trueNegatives: 2,
    });

    expect(result.metrics).toEqual({
      precision: 1,
      recall: 1,
      f1Score: 1,
      accuracy: 1,
    });

    expect(result.totalEvaluatedPairs).toBe(4);
  });

  it("should identify false positives and false negatives", () => {
    const result = evaluateMatches({
      predictions,
      groundTruth: [
        { sourceIndex: 0, targetIndex: 0, isMatch: true },
        { sourceIndex: 0, targetIndex: 1, isMatch: false },
        { sourceIndex: 1, targetIndex: 0, isMatch: true },
        { sourceIndex: 1, targetIndex: 1, isMatch: false },
      ],
    });

    expect(result.confusionMatrix).toEqual({
      truePositives: 1,
      falsePositives: 1,
      falseNegatives: 1,
      trueNegatives: 1,
    });

    expect(result.metrics.precision).toBe(0.5);
    expect(result.metrics.recall).toBe(0.5);
    expect(result.metrics.f1Score).toBe(0.5);
    expect(result.metrics.accuracy).toBe(0.5);
  });

  it("should handle empty ground truth", () => {
    const result = evaluateMatches({
      predictions,
      groundTruth: [],
    });

    expect(result.totalEvaluatedPairs).toBe(0);
    expect(result.metrics).toEqual({
      precision: 0,
      recall: 0,
      f1Score: 0,
      accuracy: 0,
    });
  });

  it("should reject invalid source indexes", () => {
    expect(() =>
      evaluateMatches({
        predictions,
        groundTruth: [{ sourceIndex: 5, targetIndex: 0, isMatch: true }],
      }),
    ).toThrow("Invalid source index: 5.");
  });

  it("should reject invalid target indexes", () => {
    expect(() =>
      evaluateMatches({
        predictions,
        groundTruth: [{ sourceIndex: 0, targetIndex: 5, isMatch: true }],
      }),
    ).toThrow("Invalid target index: 5.");
  });

  it("should reject duplicate ground-truth pairs", () => {
    expect(() =>
      evaluateMatches({
        predictions,
        groundTruth: [
          { sourceIndex: 0, targetIndex: 0, isMatch: true },
          { sourceIndex: 0, targetIndex: 0, isMatch: false },
        ],
      }),
    ).toThrow("Duplicate ground-truth pair: (0, 0).");
  });

  it("should reject invalid prediction input", () => {
    expect(() =>
      evaluateMatches({
        predictions: null as unknown as typeof predictions,
        groundTruth: [],
      }),
    ).toThrow("Valid matching predictions are required.");
  });

    it("should use original source indexes when evaluating predictions", () => {
      const filteredPredictions: MatchingResult<
        { name: string },
        { name: string }
      > = {
        ...predictions,
        matches: [
          {
            ...predictions.matches[0],
            sourceIndex: 1,
          },
          {
            ...predictions.matches[1],
            sourceIndex: 3,
          },
        ],
        totalSourceRecords: 4,
      };

      const result = evaluateMatches({
        predictions: filteredPredictions,
        groundTruth: [
          { sourceIndex: 1, targetIndex: 0, isMatch: true },
          { sourceIndex: 3, targetIndex: 1, isMatch: true },
        ],
      });

      expect(result.confusionMatrix).toEqual({
        truePositives: 2,
        falsePositives: 0,
        falseNegatives: 0,
        trueNegatives: 0,
      });
    });
});
