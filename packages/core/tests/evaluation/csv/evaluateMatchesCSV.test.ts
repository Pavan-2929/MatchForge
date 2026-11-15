import { describe, expect, it } from "vitest";
import { evaluateMatchesCSV } from "../../../src/evaluation/csv/evaluateMatchesCSV.js";

describe("evaluateMatchesCSV", () => {
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

  it("should evaluate matching results from CSV datasets", () => {
    const result = evaluateMatchesCSV(sourceCSV, targetCSV, {
      sourceKey: "name",
      targetKey: "full_name",
      threshold: 0.9,
      groundTruth,
    });

    expect(result.confusionMatrix).toEqual({
      truePositives: 1,
      falsePositives: 0,
      falseNegatives: 1,
      trueNegatives: 2,
    });

    expect(result.metrics.precision).toBe(1);
    expect(result.metrics.recall).toBe(0.5);
    expect(result.totalEvaluatedPairs).toBe(4);
  });

  it("should return CSV headers", () => {
    const result = evaluateMatchesCSV(sourceCSV, targetCSV, {
      sourceKey: "name",
      targetKey: "full_name",
      groundTruth,
    });

    expect(result.sourceHeaders).toEqual(["name"]);
    expect(result.targetHeaders).toEqual(["full_name"]);
  });

  it("should return parsing errors separately", () => {
    const malformedSource = `name,city
John,Delhi
Jane`;

    const result = evaluateMatchesCSV(malformedSource, targetCSV, {
      sourceKey: "name",
      targetKey: "full_name",
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

    const result = evaluateMatchesCSV(source, target, {
      sourceKey: "name",
      targetKey: "full_name",
      threshold: 0.9,
      sourceParseOptions: { delimiter: ";" },
      targetParseOptions: { delimiter: "|" },
      groundTruth: [{ sourceIndex: 0, targetIndex: 0, isMatch: true }],
    });

    expect(result.confusionMatrix.truePositives).toBe(1);
    expect(result.sourceHeaders).toEqual(["name", "city"]);
    expect(result.targetHeaders).toEqual(["full_name", "city"]);
  });

  it("should handle empty ground truth", () => {
    const result = evaluateMatchesCSV(sourceCSV, targetCSV, {
      sourceKey: "name",
      targetKey: "full_name",
      groundTruth: [],
    });

    expect(result.totalEvaluatedPairs).toBe(0);
    expect(result.metrics.precision).toBe(0);
  });

  it("should reject invalid ground-truth indexes", () => {
    expect(() =>
      evaluateMatchesCSV(sourceCSV, targetCSV, {
        sourceKey: "name",
        targetKey: "full_name",
        groundTruth: [{ sourceIndex: 5, targetIndex: 0, isMatch: true }],
      }),
    ).toThrow("Invalid source index: 5.");
  });
});
