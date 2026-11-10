import { describe, it, expect } from "vitest";
import { cosineSimilarity } from "../../src/similarity/cosine.js";

describe("cosineSimilarity", () => {
  it("should return 1 for identical strings", () => {
    expect(cosineSimilarity("hello", "hello")).toBe(1);
  });

  it("should return 0 for two empty strings only when compared with a non-empty string", () => {
    expect(cosineSimilarity("", "hello")).toBe(0);
  });

  it("should return 1 for two empty strings", () => {
    expect(cosineSimilarity("", "")).toBe(1);
  });

  it("should calculate bigram cosine similarity by default", () => {
    expect(cosineSimilarity("hello", "hallo")).toBe(0.5);
  });

  it("should support configurable q-gram size", () => {
    expect(cosineSimilarity("hello", "hallo", { q: 1 })).toBeCloseTo(6 / 7);
  });

  it("should account for repeated q-gram frequencies", () => {
    expect(cosineSimilarity("aaaa", "aaab")).toBeCloseTo(2 / Math.sqrt(5));
  });

  it("should return 0 for completely different strings", () => {
    expect(cosineSimilarity("abc", "xyz")).toBe(0);
  });

  it("should handle strings shorter than q", () => {
    expect(cosineSimilarity("a", "b", { q: 2 })).toBe(0);
  });

  it("should reject invalid q values", () => {
    expect(() => cosineSimilarity("hello", "world", { q: 0 })).toThrow();
    expect(() => cosineSimilarity("hello", "world", { q: 1.5 })).toThrow();
  });

  it("should handle Unicode characters", () => {
    expect(cosineSimilarity("😀a", "😀b", { q: 1 })).toBeCloseTo(0.5);
  });

  it("should be symmetric", () => {
    expect(cosineSimilarity("hello", "hallo")).toBe(
      cosineSimilarity("hallo", "hello"),
    );
  });

  it("should always return a score between 0 and 1", () => {
    const score = cosineSimilarity("matchforge", "matchforce");

    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(1);
  });
});
