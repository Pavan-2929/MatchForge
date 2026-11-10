import { describe, expect, it } from "vitest";
import { matchRecords } from "../../src/matching/matchRecords.js";

describe("multi-field matching", () => {
  it("should match records using multiple fields", () => {
    const source = [{ name: "Rahul Sharma", email: "rahul@gmail.com" }];
    const target = [
      { name: "Rahul Sharma", email: "rahul@gmail.com" },
      { name: "Rohan Patel", email: "rohan@gmail.com" },
    ];

    const result = matchRecords(source, target, {
      fields: [
        { sourceKey: "name", targetKey: "name" },
        { sourceKey: "email", targetKey: "email" },
      ],
      threshold: 0.8,
    });

    expect(result.matches[0].candidates).toHaveLength(1);
    expect(result.matches[0].candidates[0].record.name).toBe("Rahul Sharma");
  });

  it("should calculate the weighted average correctly", () => {
    const source = [{ name: "Rahul", city: "Delhi" }];
    const target = [{ name: "Rahul", city: "Delli" }];

    const result = matchRecords(source, target, {
      fields: [
        { sourceKey: "name", targetKey: "name", weight: 0.8 },
        { sourceKey: "city", targetKey: "city", weight: 0.2 },
      ],
      method: "levenshtein",
      threshold: 0,
    });

    expect(result.matches[0].candidates[0].score).toBeCloseTo(0.96);
  });

  it("should use equal weights when weights are omitted", () => {
    const result = matchRecords(
      [{ name: "Rahul", city: "Delhi" }],
      [{ name: "Rahul", city: "Delli" }],
      {
        fields: [
          { sourceKey: "name", targetKey: "name" },
          { sourceKey: "city", targetKey: "city" },
        ],
        method: "levenshtein",
        threshold: 0,
      },
    );

    expect(result.matches[0].candidates[0].score).toBeCloseTo(0.9);
  });

  it("should ignore fields with zero weight", () => {
    const result = matchRecords(
      [{ name: "Rahul", city: "Delhi" }],
      [{ name: "Rahul", city: "Mumbai" }],
      {
        fields: [
          { sourceKey: "name", targetKey: "name", weight: 1 },
          { sourceKey: "city", targetKey: "city", weight: 0 },
        ],
        method: "levenshtein",
        threshold: 0,
      },
    );

    expect(result.matches[0].candidates[0].score).toBe(1);
    expect(result.matches[0].candidates[0].fieldScores).toHaveLength(1);
  });

  it("should skip missing and empty field values", () => {
    const result = matchRecords(
      [{ name: "Rahul", city: "Delhi" }],
      [{ name: "Rahul", city: "" }],
      {
        fields: [
          { sourceKey: "name", targetKey: "name" },
          { sourceKey: "city", targetKey: "city" },
        ],
        method: "levenshtein",
      },
    );

    expect(result.matches[0].candidates[0].score).toBe(1);
    expect(result.matches[0].candidates[0].fieldScores).toHaveLength(1);
  });

  it("should return individual field scores", () => {
    const result = matchRecords(
      [{ name: "Rahul", city: "Delhi" }],
      [{ name: "Rahul", city: "Delli" }],
      {
        fields: [
          { sourceKey: "name", targetKey: "name", weight: 0.6 },
          { sourceKey: "city", targetKey: "city", weight: 0.4 },
        ],
        method: "levenshtein",
        threshold: 0,
      },
    );

    const candidate = result.matches[0].candidates[0];

    expect(candidate.fieldScores).toHaveLength(2);
    expect(candidate.fieldScores[0].score).toBe(1);
    expect(candidate.fieldScores[1].score).toBeCloseTo(0.8);
  });

  it("should reject invalid weights and empty fields", () => {
    expect(() =>
      matchRecords([{ name: "Rahul" }], [{ name: "Rahul" }], {
        fields: [],
      }),
    ).toThrow();

    expect(() =>
      matchRecords([{ name: "Rahul" }], [{ name: "Rahul" }], {
        fields: [{ sourceKey: "name", targetKey: "name", weight: -1 }],
      }),
    ).toThrow();
  });

  it("should respect threshold and topK", () => {
    const result = matchRecords(
      [{ name: "Rahul" }],
      [{ name: "Rohul" }, { name: "Rahul" }, { name: "Rahulx" }],
      {
        fields: [{ sourceKey: "name", targetKey: "name" }],
        method: "levenshtein",
        threshold: 0.9,
        topK: 1,
      },
    );

    expect(result.matches[0].candidates).toHaveLength(1);
    expect(result.matches[0].candidates[0].record.name).toBe("Rahul");
  });
});
