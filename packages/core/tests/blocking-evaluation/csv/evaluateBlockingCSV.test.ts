import { describe, expect, it } from "vitest";
import { evaluateBlockingCSV } from "../../../src/blocking-evaluation/csv/evaluateBlockingCSV.js";

describe("evaluateBlockingCSV", () => {
  const sourceCSV = `name
John
Jane`;

  const targetCSV = `full_name
John
Rahul`;

  const groundTruth = [
    { sourceIndex: 0, targetIndex: 0, isMatch: true },
    { sourceIndex: 0, targetIndex: 1, isMatch: false },
    { sourceIndex: 1, targetIndex: 0, isMatch: false },
    { sourceIndex: 1, targetIndex: 1, isMatch: true },
  ];

  it("should evaluate blocking results from CSV datasets", () => {
    const result = evaluateBlockingCSV(sourceCSV, targetCSV, {
      rules: [
        {
          sourceKey: "name",
          targetKey: "full_name",
          method: "exact",
        },
      ],
      groundTruth,
    });

    expect(result.metrics).toEqual({
      candidateRecall: 0.5,
      candidatePrecision: 1,
      reductionRatio: 0.75,
    });

    expect(result.totalPossiblePairs).toBe(4);
    expect(result.totalCandidatePairs).toBe(1);
    expect(result.totalEvaluatedPairs).toBe(4);
    expect(result.trueCandidatePairs).toBe(1);
    expect(result.totalTruePairs).toBe(2);
  });

  it("should return CSV headers", () => {
    const result = evaluateBlockingCSV(sourceCSV, targetCSV, {
      rules: [
        {
          sourceKey: "name",
          targetKey: "full_name",
          method: "exact",
        },
      ],
      groundTruth,
    });

    expect(result.sourceHeaders).toEqual(["name"]);
    expect(result.targetHeaders).toEqual(["full_name"]);
  });

  it("should return parsing errors separately", () => {
    const malformedSource = `name,city
John,Delhi
Jane`;

    const result = evaluateBlockingCSV(malformedSource, targetCSV, {
      rules: [
        {
          sourceKey: "name",
          targetKey: "full_name",
          method: "exact",
        },
      ],
      targetParseOptions: { delimiter: "," },
      groundTruth: [{ sourceIndex: 0, targetIndex: 0, isMatch: true }],
    });

    expect(result.parseErrors.source.length).toBeGreaterThan(0);
    expect(result.parseErrors.target).toHaveLength(0);
  });

  it("should support separate parsing options", () => {
    const source = `name;city
John;Delhi`;

    const target = `full_name|city
John|Delhi`;

    const result = evaluateBlockingCSV(source, target, {
      rules: [
        {
          sourceKey: "name",
          targetKey: "full_name",
          method: "exact",
        },
      ],
      sourceParseOptions: { delimiter: ";" },
      targetParseOptions: { delimiter: "|" },
      groundTruth: [{ sourceIndex: 0, targetIndex: 0, isMatch: true }],
    });

    expect(result.metrics.candidateRecall).toBe(1);
    expect(result.totalCandidatePairs).toBe(1);
  });

  it("should handle empty ground truth", () => {
    const result = evaluateBlockingCSV(sourceCSV, targetCSV, {
      rules: [
        {
          sourceKey: "name",
          targetKey: "full_name",
          method: "exact",
        },
      ],
      groundTruth: [],
    });

    expect(result.totalEvaluatedPairs).toBe(0);
    expect(result.metrics.candidateRecall).toBe(0);
  });

  it("should reject invalid ground-truth indexes", () => {
    expect(() =>
      evaluateBlockingCSV(sourceCSV, targetCSV, {
        rules: [
          {
            sourceKey: "name",
            targetKey: "full_name",
            method: "exact",
          },
        ],
        groundTruth: [{ sourceIndex: 5, targetIndex: 0, isMatch: true }],
      }),
    ).toThrow("Invalid source index: 5.");
  });
});
