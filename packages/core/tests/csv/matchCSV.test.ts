import { describe, expect, it } from "vitest";
import { matchCSV } from "../../src/csv/matchCSV.js";

describe("matchCSV", () => {
  it("should match records from two CSV files", () => {
    const sourceCSV = `name,email
John,john@example.com`;

    const targetCSV = `full_name,email
John,john@example.com`;

    const result = matchCSV(sourceCSV, targetCSV, {
      sourceKey: "name",
      targetKey: "full_name",
      threshold: 0.9,
    });

    expect(result.matches).toHaveLength(1);
    expect(result.matches[0].matched).toBe(true);
    expect(result.matches[0].candidates[0].score).toBe(1);
  });

  it("should preserve source and target record numbers", () => {
    const sourceCSV = `name
John`;

    const targetCSV = `full_name
Jane
John`;

    const result = matchCSV(sourceCSV, targetCSV, {
      sourceKey: "name",
      targetKey: "full_name",
      threshold: 1,
    });

    expect(result.matches[0].sourceRecordNumber).toBe(1);
    expect(result.matches[0].candidates[0].targetRecordNumber).toBe(2);
  });

  it("should return unmatched source records", () => {
    const sourceCSV = `name
John
Rahul`;

    const targetCSV = `full_name
John`;

    const result = matchCSV(sourceCSV, targetCSV, {
      sourceKey: "name",
      targetKey: "full_name",
      threshold: 0.9,
    });

    expect(result.unmatched).toHaveLength(1);
    expect(result.unmatched[0].record.name).toBe("Rahul");
    expect(result.unmatched[0].sourceRecordNumber).toBe(2);
  });

  it("should support multiple field matching", () => {
    const sourceCSV = `name,email
John,john@example.com`;

    const targetCSV = `full_name,email
John,john@example.com`;

    const result = matchCSV(sourceCSV, targetCSV, {
      fields: [
        { sourceKey: "name", targetKey: "full_name", weight: 0.6 },
        { sourceKey: "email", targetKey: "email", weight: 0.4 },
      ],
      threshold: 0.9,
    });

    expect(result.matches[0].matched).toBe(true);
    expect(result.matches[0].candidates[0].fieldScores).toHaveLength(2);
  });

  it("should return total record counts and headers", () => {
    const sourceCSV = `name
John
Jane`;

    const targetCSV = `full_name
John
Jane
Rahul`;

    const result = matchCSV(sourceCSV, targetCSV, {
      sourceKey: "name",
      targetKey: "full_name",
    });

    expect(result.totalSourceRecords).toBe(2);
    expect(result.totalTargetRecords).toBe(3);
    expect(result.sourceHeaders).toEqual(["name"]);
    expect(result.targetHeaders).toEqual(["full_name"]);
  });

  it("should preserve parsing errors", () => {
    const sourceCSV = `name,city
John,Delhi
Jane`;

    const targetCSV = `full_name,email
John,john@example.com`;

    const result = matchCSV(sourceCSV, targetCSV, {
      sourceKey: "name",
      targetKey: "full_name",
    });

    expect(result.parseErrors.source.length).toBeGreaterThan(0);
    expect(result.parseErrors.target).toHaveLength(0);
  });

  it("should support separate parsing options for both CSV files", () => {
    const sourceCSV = `name;city
John;Delhi`;

    const targetCSV = `full_name|city
John|Delhi`;

    const result = matchCSV(sourceCSV, targetCSV, {
      sourceKey: "name",
      targetKey: "full_name",
      sourceParseOptions: { delimiter: ";" },
      targetParseOptions: { delimiter: "|" },
      threshold: 0.9,
    });

    expect(result.matches[0].matched).toBe(true);
    expect(result.sourceHeaders).toEqual(["name", "city"]);
    expect(result.targetHeaders).toEqual(["full_name", "city"]);
  });
});
