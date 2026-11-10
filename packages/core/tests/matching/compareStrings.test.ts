import { describe, expect, it } from "vitest";

import { compareStrings } from "../../src/matching/compareStrings.js";
import { jaroSimilarity } from "../../src/similarity/jaro.js";
import { normalizeString } from "../../src/preprocessing/normalize.js";

describe("compareStrings", () => {
  it("should return 1 for identical strings", () => {
    expect(compareStrings("hello", "hello")).toBe(1);
  });

  it("should use Jaro-Winkler by default", () => {
    const expected = compareStrings("Smith", "Smyth", {
      method: "jaro-winkler",
    });

    expect(compareStrings("Smith", "Smyth")).toBe(expected);
  });

  it("should use the selected algorithm", () => {
    const expected = jaroSimilarity("Smith", "Smyth");

    expect(compareStrings("Smith", "Smyth", { method: "jaro" })).toBe(expected);
  });

  it("should normalize strings before comparison", () => {
    const result = compareStrings(" HELLO ", "hello");

    expect(result).toBe(1);
  });

  it("should respect custom normalization options", () => {
    const result = compareStrings("HELLO", "hello", {
      normalization: { lowercase: false },
    });

    expect(result).toBeLessThan(1);
  });

  it("should return a score between 0 and 1", () => {
    const result = compareStrings("Smith", "Smyth");

    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(1);
  });

  it("should pass q-gram options to Jaccard similarity", () => {
    const result = compareStrings("abcdef", "abcxyz", {
      method: "jaccard",
      algorithmOptions: { q: 1 },
    });

    expect(result).toBeCloseTo(1 / 3);
  });

  it("should pass q-gram options to Dice similarity", () => {
    const result = compareStrings("abcdef", "abcxyz", {
      method: "dice",
      algorithmOptions: { q: 1 },
    });

    expect(result).toBeCloseTo(0.5);
  });

  it("should pass q-gram options to Cosine similarity", () => {
    const result = compareStrings("abcdef", "abcxyz", {
      method: "cosine",
      algorithmOptions: { q: 1 },
    });

    expect(result).toBeCloseTo(0.5);
  });

  it("should reject non-string inputs", () => {
    expect(() => compareStrings(123 as any, "Rahul")).toThrow(
      "Both inputs must be strings.",
    );
  });

  it("should reject unsupported algorithms", () => {
    expect(() =>
      compareStrings("Rahul", "Rohul", {
        method: "invalid" as any,
      }),
    ).toThrow("Unsupported similarity method: invalid");
  });
});
