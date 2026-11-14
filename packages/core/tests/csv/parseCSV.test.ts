import { describe, expect, it } from "vitest";
import { parseCSV } from "../../src/csv/parseCSV.js";

describe("parseCSV", () => {
  it("should parse CSV headers and records", () => {
    const csv = `name,email
John,john@example.com
Jane,jane@example.com`;

    const result = parseCSV(csv);

    expect(result.headers).toEqual(["name", "email"]);
    expect(result.records).toHaveLength(2);
    expect(result.records[0]).toEqual({
      name: "John",
      email: "john@example.com",
    });
    expect(result.rowCount).toBe(2);
  });

  it("should preserve values as strings", () => {
    const csv = `id,name
00125,John`;

    const result = parseCSV(csv);

    expect(result.records[0].id).toBe("00125");
  });

  it("should handle commas inside quoted values", () => {
    const csv = `name,address
John,"Ahmedabad, Gujarat"`;

    const result = parseCSV(csv);

    expect(result.records[0].address).toBe("Ahmedabad, Gujarat");
  });

  it("should handle escaped quotes", () => {
    const csv = `name,description
John,"He said ""Hello"""`;

    const result = parseCSV(csv);

    expect(result.records[0].description).toBe('He said "Hello"');
  });

  it("should handle multiline values", () => {
    const csv = `name,address
John,"Street 1
Ahmedabad"`;

    const result = parseCSV(csv);

    expect(result.records[0].address).toBe("Street 1\nAhmedabad");
  });

  it("should support custom delimiters", () => {
    const csv = `name;city
John;Ahmedabad`;

    const result = parseCSV(csv, { delimiter: ";" });

    expect(result.headers).toEqual(["name", "city"]);
    expect(result.records[0].city).toBe("Ahmedabad");
  });

  it("should return an empty result for empty input", () => {
    const result = parseCSV("");

    expect(result.records).toEqual([]);
    expect(result.headers).toEqual([]);
    expect(result.rowCount).toBe(0);
  });

  it("should handle CRLF line endings", () => {
    const csv = "name,city\r\nJohn,Ahmedabad\r\nJane,Delhi";

    const result = parseCSV(csv);

    expect(result.records).toHaveLength(2);
    expect(result.records[1].city).toBe("Delhi");
  });

  it("should handle UTF-8 BOM", () => {
    const csv = "\uFEFFname,city\nJohn,Delhi";

    const result = parseCSV(csv);

    expect(result.headers).toEqual(["name", "city"]);
    expect(result.records[0].name).toBe("John");
  });

  it("should handle Unicode characters", () => {
    const csv = `name,city
Pavan,અમદાવાદ`;

    const result = parseCSV(csv);

    expect(result.records[0].city).toBe("અમદાવાદ");
  });

  it("should report rows with missing or extra fields", () => {
    const csv = `name,city
John,Delhi
Jane
Sam,Mumbai,India`;

    const result = parseCSV(csv);

    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("should report malformed quotation marks", () => {
    const csv = `name,city
John,"Delhi`;

    const result = parseCSV(csv);

    expect(result.errors.length).toBeGreaterThan(0);
  });
});
