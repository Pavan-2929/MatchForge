import { describe, expect, it } from "vitest";
import { exportMatches } from "../../src/csv/exportMatches.js";
import { matchCSV } from "../../src/csv/matchCSV.js";
import { parseCSV } from "../../src/csv/parseCSV.js";

describe("exportMatches", () => {
  const sourceCSV = `name,email
John,john@example.com
Rahul,rahul@example.com`;

  const targetCSV = `full_name,email
John,john@example.com`;

  const result = matchCSV(sourceCSV, targetCSV, {
    sourceKey: "name",
    targetKey: "full_name",
    threshold: 0.9,
  });

  it("should export matching results as CSV", () => {
    const csv = exportMatches(result);

    expect(csv).toContain("source_record_number");
    expect(csv).toContain("target_record_number");
    expect(csv).toContain("matched");
    expect(csv).toContain("score");
    expect(csv).toContain("method");
  });

  it("should include source and target record numbers", () => {
    const parsed = parseCSV(exportMatches(result));

    expect(parsed.records[0].source_record_number).toBe("1");
    expect(parsed.records[0].target_record_number).toBe("1");
  });

  it("should include unmatched source records", () => {
    const parsed = parseCSV(exportMatches(result));

    expect(parsed.records).toHaveLength(2);
    expect(parsed.records[1].matched).toBe("false");
    expect(parsed.records[1].source_name).toBe("Rahul");
    expect(parsed.records[1].target_record_number).toBe("");
  });

  it("should include matching scores and methods", () => {
    const parsed = parseCSV(exportMatches(result));

    expect(parsed.records[0].score).toBe("1");
    expect(parsed.records[0].method).toBe("jaro-winkler");
  });

  it("should handle commas and quotes in values", () => {
    const source = `name
"John, ""Johnny"""`;

    const target = `full_name
"John, ""Johnny"""`;

    const matchingResult = matchCSV(source, target, {
      sourceKey: "name",
      targetKey: "full_name",
      threshold: 1,
    });

    const csv = exportMatches(matchingResult);
    const parsed = parseCSV(csv);

    expect(parsed.records[0].source_name).toBe('John, "Johnny"');
    expect(parsed.records[0].target_full_name).toBe('John, "Johnny"');
  });

  it("should support custom delimiters", () => {
    const csv = exportMatches(result, { delimiter: ";" });

    const parsed = parseCSV(csv, { delimiter: ";" });

    expect(parsed.records).toHaveLength(2);
    expect(parsed.records[0].source_name).toBe("John");
  });

  it("should export headers when there are no records", () => {
    const emptyResult = matchCSV("name,email", "full_name,email", {
      sourceKey: "name",
      targetKey: "full_name",
    });

    const csv = exportMatches(emptyResult);
    const parsed = parseCSV(csv);

    expect(parsed.headers).toContain("source_name");
    expect(parsed.headers).toContain("target_full_name");
    expect(parsed.records).toHaveLength(0);
  });
});
