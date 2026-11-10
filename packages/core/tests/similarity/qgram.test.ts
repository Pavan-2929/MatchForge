import { describe, it, expect } from "vitest";
import {
  jaccardSimilarity,
  diceSimilarity,
} from "../../src/similarity/qgram.js";

describe("jaccardSimilarity", () => {
  it("should return 1 for identical strings", () => {
    expect(jaccardSimilarity("hello", "hello")).toBe(1);
  });

  it("should calculate bigram similarity by default", () => {
    expect(jaccardSimilarity("hello", "hallo")).toBeCloseTo(1 / 3);
  });

  it("should support configurable q-gram size", () => {
    expect(jaccardSimilarity("hello", "hallo", { q: 3 })).toBeCloseTo(0.2);
  });

  it("should handle completely different strings", () => {
    expect(jaccardSimilarity("abc", "xyz")).toBe(0);
  });

  it("should handle empty strings", () => {
    expect(jaccardSimilarity("", "")).toBe(1);
    expect(jaccardSimilarity("", "hello")).toBe(0);
  });

  it("should handle strings shorter than q", () => {
    expect(jaccardSimilarity("a", "b", { q: 2 })).toBe(0);
  });

  it("should reject invalid q values", () => {
    expect(() => jaccardSimilarity("hello", "world", { q: 0 })).toThrow();
    expect(() => jaccardSimilarity("hello", "world", { q: 1.5 })).toThrow();
  });

  it("should handle Unicode characters", () => {
    expect(jaccardSimilarity("😀a", "😀b", { q: 1 })).toBeCloseTo(1 / 3);
  });

  it("should be symmetric", () => {
    expect(jaccardSimilarity("hello", "hallo")).toBe(
      jaccardSimilarity("hallo", "hello"),
    );
  });
});

describe("diceSimilarity", () => {
  it("should return 1 for identical strings", () => {
    expect(diceSimilarity("hello", "hello")).toBe(1);
  });

  it("should calculate bigram similarity by default", () => {
    expect(diceSimilarity("hello", "hallo")).toBe(0.5);
  });

  it("should support configurable q-gram size", () => {
    expect(diceSimilarity("hello", "hallo", { q: 3 })).toBe(1 / 3);
  });

  it("should return 0 for completely different strings", () => {
    expect(diceSimilarity("abc", "xyz")).toBe(0);
  });

  it("should handle empty strings", () => {
    expect(diceSimilarity("", "")).toBe(1);
    expect(diceSimilarity("", "hello")).toBe(0);
  });

  it("should handle strings shorter than q", () => {
    expect(diceSimilarity("a", "b", { q: 2 })).toBe(0);
  });

  it("should reject invalid q values", () => {
    expect(() => diceSimilarity("hello", "world", { q: 0 })).toThrow();
    expect(() => diceSimilarity("hello", "world", { q: 1.5 })).toThrow();
  });

  it("should handle Unicode characters", () => {
    expect(diceSimilarity("😀a", "😀b", { q: 1 })).toBe(0.5);
  });

  it("should be symmetric", () => {
    expect(diceSimilarity("hello", "hallo")).toBe(
      diceSimilarity("hallo", "hello"),
    );
  });
});
