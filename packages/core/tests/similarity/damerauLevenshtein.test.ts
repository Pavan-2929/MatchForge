import { describe, it, expect } from "vitest";
import {
  damerauLevenshteinDistance,
  damerauLevenshteinSimilarity,
} from "../../src/similarity/damerauLevenshtein.js";

describe("damerauLevenshteinDistance", () => {
  it("should return zero for identical strings", () => {
    expect(damerauLevenshteinDistance("hello", "hello")).toBe(0);
  });

  it("should calculate adjacent transposition as one edit", () => {
    expect(damerauLevenshteinDistance("form", "from")).toBe(1);
  });

  it("should handle insertion", () => {
    expect(damerauLevenshteinDistance("cat", "cart")).toBe(1);
  });

  it("should handle deletion", () => {
    expect(damerauLevenshteinDistance("cart", "cat")).toBe(1);
  });

  it("should handle substitution", () => {
    expect(damerauLevenshteinDistance("cat", "bat")).toBe(1);
  });

  it("should handle empty strings", () => {
    expect(damerauLevenshteinDistance("", "abc")).toBe(3);
    expect(damerauLevenshteinDistance("abc", "")).toBe(3);
    expect(damerauLevenshteinDistance("", "")).toBe(0);
  });

  it("should support unrestricted transpositions", () => {
    expect(damerauLevenshteinDistance("CA", "ABC")).toBe(2);
  });

  it("should handle Unicode characters", () => {
    expect(damerauLevenshteinDistance("😀", "😃")).toBe(1);
  });
});

describe("damerauLevenshteinSimilarity", () => {
  it("should return 1 for identical strings", () => {
    expect(damerauLevenshteinSimilarity("hello", "hello")).toBe(1);
  });

  it("should return 0 for completely different strings", () => {
    expect(damerauLevenshteinSimilarity("abc", "xyz")).toBe(0);
  });

  it("should calculate similarity with transposition", () => {
    expect(damerauLevenshteinSimilarity("form", "from")).toBe(0.75);
  });

  it("should return 1 for two empty strings", () => {
    expect(damerauLevenshteinSimilarity("", "")).toBe(1);
  });

  it("should return 0 when one string is empty", () => {
    expect(damerauLevenshteinSimilarity("", "abc")).toBe(0);
  });

  it("should handle Unicode characters", () => {
    expect(damerauLevenshteinSimilarity("😀", "😃")).toBe(0);
  });
});
