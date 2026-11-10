import { describe, it, expect } from "vitest";
import { normalizeString } from "../../src/preprocessing/normalize.js";

describe("normalizeString", () => {
  it("should convert text to lowercase by default", () => {
    expect(normalizeString("JOHN SMITH")).toBe("john smith");
  });

  it("should trim whitespace by default", () => {
    expect(normalizeString("  john  ")).toBe("john");
  });

  it("should normalize repeated whitespace by default", () => {
    expect(normalizeString("john   smith")).toBe("john smith");
  });

  it("should remove punctuation when enabled", () => {
    expect(normalizeString("john-smith!", { removePunctuation: true })).toBe(
      "johnsmith",
    );
  });

  it("should remove accents when enabled", () => {
    expect(normalizeString("José", { removeAccents: true })).toBe("jose");
  });

  it("should preserve punctuation by default", () => {
    expect(normalizeString("john-smith!")).toBe("john-smith!");
  });

  it("should preserve accents by default", () => {
    expect(normalizeString("José")).toBe("josé");
  });

  it("should allow lowercase conversion to be disabled", () => {
    expect(normalizeString("JOHN", { lowercase: false })).toBe("JOHN");
  });

  it("should allow trimming to be disabled", () => {
    expect(
      normalizeString("  john  ", {
        trim: false,
        normalizeWhitespace: false,
      }),
    ).toBe("  john  ");
  });

  it("should normalize internal whitespace without trimming", () => {
    expect(
      normalizeString("  john   smith  ", {
        trim: false,
        normalizeWhitespace: true,
      }),
    ).toBe(" john smith ");
  });

  it("should handle an empty string", () => {
    expect(normalizeString("")).toBe("");
  });

  it("should remove Unicode diacritics beyond the basic combining range", () => {
    expect(normalizeString("a\u1AB0", { removeAccents: true })).toBe("a");
  });
});
