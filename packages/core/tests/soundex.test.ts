import { describe, it, expect } from "vitest";
import { soundex, soundexSimilarity } from "../src/similarity/soundex.js";

describe("soundex", () => {
  it("should encode common names correctly", () => {
    expect(soundex("Smith")).toBe("S530");
    expect(soundex("Smyth")).toBe("S530");
    expect(soundex("Robert")).toBe("R163");
    expect(soundex("Rupert")).toBe("R163");
  });

  it("should ignore vowels and ignored consonants", () => {
    expect(soundex("Ashcraft")).toBe("A261");
    expect(soundex("Tymczak")).toBe("T522");
  });

  it("should collapse consecutive characters with the same code", () => {
    expect(soundex("BHB")).toBe("B000");
    expect(soundex("Pfister")).toBe("P236");
  });

  it("should pad codes with zeros", () => {
    expect(soundex("Lee")).toBe("L000");
    expect(soundex("Bob")).toBe("B100");
  });

  it("should truncate codes to four characters", () => {
    expect(soundex("Washington")).toBe("W252");
  });

  it("should handle lowercase input", () => {
    expect(soundex("smith")).toBe("S530");
  });

  it("should handle empty or non-English input", () => {
    expect(soundex("")).toBe("");
    expect(soundex("123")).toBe("");
  });
});

describe("soundexSimilarity", () => {
  it("should return 1 for matching phonetic codes", () => {
    expect(soundexSimilarity("Smith", "Smyth")).toBe(1);
    expect(soundexSimilarity("Robert", "Rupert")).toBe(1);
  });

  it("should return 0 for different phonetic codes", () => {
    expect(soundexSimilarity("Smith", "Johnson")).toBe(0);
  });

  it("should handle identical strings", () => {
    expect(soundexSimilarity("hello", "hello")).toBe(1);
  });
});
