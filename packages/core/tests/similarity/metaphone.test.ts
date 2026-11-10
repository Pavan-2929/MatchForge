import { describe, it, expect } from "vitest";
import {
  metaphone,
  metaphoneSimilarity,
} from "../../src/similarity/metaphone.js";

describe("metaphone", () => {
  it("should encode common words", () => {
    expect(metaphone("Smith")).toBe("SM0");
    expect(metaphone("Smyth")).toBe("SM0");
    expect(metaphone("Knight")).toBe("NT");
    expect(metaphone("Night")).toBe("NT");
  });

  it("should handle silent initial letters", () => {
    expect(metaphone("Knight")).toBe(metaphone("Night"));
    expect(metaphone("Write")).toBe(metaphone("Rite"));
  });

  it("should handle consonant transformations", () => {
    expect(metaphone("Phone")).toBe("FN");
    expect(metaphone("Thomas")).toBe("0MS");
    expect(metaphone("Xavier")).toBe("SFR");
  });

  it("should handle lowercase input", () => {
    expect(metaphone("smith")).toBe("SM0");
  });

  it("should handle empty and non-English input", () => {
    expect(metaphone("")).toBe("");
    expect(metaphone("123")).toBe("");
  });
});

describe("metaphoneSimilarity", () => {
  it("should return 1 for matching phonetic codes", () => {
    expect(metaphoneSimilarity("Smith", "Smyth")).toBe(1);
    expect(metaphoneSimilarity("Knight", "Night")).toBe(1);
  });

  it("should return 0 for different phonetic codes", () => {
    expect(metaphoneSimilarity("Smith", "Johnson")).toBe(0);
  });

  it("should return 1 for identical strings", () => {
    expect(metaphoneSimilarity("hello", "hello")).toBe(1);
  });
});
