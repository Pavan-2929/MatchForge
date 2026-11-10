import { describe, it, expect } from "vitest";
import {
  levenshteinDistance,
  levenshteinSimilarity,
} from "../../src/similarity/levenshtein.js";

describe("levenshteinDistance", () => {
  it("should calculate the distance between two different strings", () => {
    expect(levenshteinDistance("kitten", "sitting")).toBe(3);
  });

  it("should return zero for identical strings", () => {
    expect(levenshteinDistance("hello", "hello")).toBe(0);
  });

  it("should handle an empty first string", () => {
    expect(levenshteinDistance("", "abc")).toBe(3);
  });

  it("should handle an empty second string", () => {
    expect(levenshteinDistance("abc", "")).toBe(3);
  });

  it("should handle two empty strings", () => {
    expect(levenshteinDistance("", "")).toBe(0);
  });

  it("should count Unicode code points correctly", () => {
    expect(levenshteinDistance("😀", "😃")).toBe(1);
  });

  it("should handle insertion, deletion and substitution", () => {
    expect(levenshteinDistance("cat", "cart")).toBe(1);
    expect(levenshteinDistance("cart", "cat")).toBe(1);
    expect(levenshteinDistance("cat", "bat")).toBe(1);
  });
});

describe("levenshteinSimilarity", () => {
  it("should return 1 for identical strings", () => {
    expect(levenshteinSimilarity("hello", "hello")).toBe(1);
  });

  it("should return 0 for completely different strings of equal length", () => {
    expect(levenshteinSimilarity("abc", "xyz")).toBe(0);
  });

  it("should calculate normalized similarity", () => {
    expect(levenshteinSimilarity("cat", "bat")).toBeCloseTo(2 / 3);
  });

  it("should return 1 for two empty strings", () => {
    expect(levenshteinSimilarity("", "")).toBe(1);
  });

  it("should handle one empty string", () => {
    expect(levenshteinSimilarity("", "abc")).toBe(0);
  });

  it("should handle Unicode characters correctly", () => {
    expect(levenshteinSimilarity("😀", "😃")).toBe(0);
  });
});
