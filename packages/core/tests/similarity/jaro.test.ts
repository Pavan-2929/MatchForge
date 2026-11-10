import { describe, it, expect } from "vitest";
import {
  jaroSimilarity,
  jaroWinklerSimilarity,
} from "../../src/similarity/jaro.js";

describe("jaroSimilarity", () => {
  it("should return 1 for identical strings", () => {
    expect(jaroSimilarity("hello", "hello")).toBe(1);
  });

  it("should return 0 for two empty strings only when compared with a non-empty string", () => {
    expect(jaroSimilarity("", "hello")).toBe(0);
  });

  it("should return 1 for two empty strings", () => {
    expect(jaroSimilarity("", "")).toBe(1);
  });

  it("should calculate the standard MARTHA example", () => {
    expect(jaroSimilarity("MARTHA", "MARHTA")).toBeCloseTo(0.944444, 5);
  });

  it("should return 0 when there are no matching characters", () => {
    expect(jaroSimilarity("abc", "xyz")).toBe(0);
  });

  it("should be symmetric", () => {
    expect(jaroSimilarity("MARTHA", "MARHTA")).toBeCloseTo(
      jaroSimilarity("MARHTA", "MARTHA"),
    );
  });

  it("should handle Unicode characters", () => {
    expect(jaroSimilarity("😀", "😀")).toBe(1);
    expect(jaroSimilarity("😀", "😃")).toBe(0);
  });
});

describe("jaroWinklerSimilarity", () => {
  it("should return 1 for identical strings", () => {
    expect(jaroWinklerSimilarity("hello", "hello")).toBe(1);
  });

  it("should give a higher score when strings share a common prefix", () => {
    expect(jaroWinklerSimilarity("MARTHA", "MARHTA")).toBeGreaterThan(
      jaroSimilarity("MARTHA", "MARHTA"),
    );
  });

  it("should calculate the standard MARTHA example", () => {
    expect(jaroWinklerSimilarity("MARTHA", "MARHTA")).toBeCloseTo(0.961111, 5);
  });

  it("should limit the common prefix to four characters", () => {
    expect(jaroWinklerSimilarity("ABCDE", "ABCDF")).toBeCloseTo(0.92, 2);
  });

  it("should return 1 for two empty strings", () => {
    expect(jaroWinklerSimilarity("", "")).toBe(1);
  });

  it("should return 0 when there are no matching characters", () => {
    expect(jaroWinklerSimilarity("abc", "xyz")).toBe(0);
  });

  it("should not apply the prefix bonus below the Jaro threshold", () => {
    const a = "ab";
    const b = "ac";

    expect(jaroWinklerSimilarity(a, b)).toBe(jaroSimilarity(a, b));
  });

  it("should handle Unicode characters", () => {
    expect(jaroWinklerSimilarity("😀", "😀")).toBe(1);
    expect(jaroWinklerSimilarity("😀", "😃")).toBe(0);
  });
});
