import { describe, expect, it } from "vitest";

import { compareRecords } from "../../src/matching/compareRecords.js";
import { jaroSimilarity } from "../../src/similarity/jaro.js";
import { normalizeString } from "../../src/preprocessing/normalize.js";

describe("compareRecords", () => {
  it("should return 1 for identical strings", () => {
    expect(compareRecords("hello", "hello")).toBe(1);
  });

  it("should use Jaro-Winkler by default", () => {
    const expected = compareRecords("Smith", "Smyth", {
      method: "jaro-winkler",
    });

    expect(compareRecords("Smith", "Smyth")).toBe(expected);
  });

  it("should use the selected algorithm", () => {
    const expected = jaroSimilarity("Smith", "Smyth");

    expect(compareRecords("Smith", "Smyth", { method: "jaro" })).toBe(expected);
  });

  it("should normalize strings before comparison", () => {
    const result = compareRecords(" HELLO ", "hello");

    expect(result).toBe(1);
  });

  it("should respect custom normalization options", () => {
    const result = compareRecords("HELLO", "hello", {
      normalization: { lowercase: false },
    });

    expect(result).toBeLessThan(1);
  });

  it("should return a score between 0 and 1", () => {
    const result = compareRecords("Smith", "Smyth");

    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(1);
  });

  it("should pass q-gram options to Jaccard similarity", () => {
    const result = compareRecords("abcdef", "abcxyz", {
      method: "jaccard",
      algorithmOptions: { q: 1 },
    });

    expect(result).toBeCloseTo(1 / 3);
  });

  it("should pass q-gram options to Dice similarity", () => {
    const result = compareRecords("abcdef", "abcxyz", {
      method: "dice",
      algorithmOptions: { q: 1 },
    });

    expect(result).toBeCloseTo(0.5);
  });

  it("should pass q-gram options to Cosine similarity", () => {
    const result = compareRecords("abcdef", "abcxyz", {
      method: "cosine",
      algorithmOptions: { q: 1 },
    });

    expect(result).toBeCloseTo(0.5);
  });
});
