import { describe, it, expect } from "vitest";
import { normalizeString } from "../src/index.js";

describe("normalizeString", () => {
  it("should trim whitespace", () => {
    expect(normalizeString("  hello  ")).toBe("hello");
  });

  it("should convert text to lowercase", () => {
    expect(normalizeString("HELLO")).toBe("hello");
  });

  it("should trim whitespace and convert to lowercase", () => {
    expect(normalizeString("  JOHN SMITH  ")).toBe("john smith");
  });

  it("should handle an empty string", () => {
    expect(normalizeString("")).toBe("");
  });
});
