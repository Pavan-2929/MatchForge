import { describe, expect, it } from "vitest";

import { findDuplicatesCSV } from "../../src/deduplication/findDuplicatesCSV.js";
import { exportUniqueCSV } from "../../src/deduplication/exportUniqueCSV.js";

describe("exportUniqueCSV", () => {
  const csv = [
    "id,name,email,phone",
    "1,Rahul Sharma,rahul@gmail.com,",
    "2,Rahul S.,rahul@gmail.com,9876543210",
    "3,Pavan,pavan@gmail.com,",
    "4,Amit,amit@gmail.com,",
  ].join("\n");

  const options = {
    fields: [
      { key: "name", weight: 0.6 },
      { key: "email", weight: 0.4 },
    ],
    method: "jaro-winkler" as const,
    threshold: 0.85,
  };

  const result = findDuplicatesCSV(csv, options);

  it("should keep the first record", () => {
    const output = exportUniqueCSV(result, { keep: "first" });

    expect(output).toContain("1,Rahul Sharma,rahul@gmail.com");
    expect(output).not.toContain("2,Rahul S.");
  });

  it("should keep the most complete record", () => {
    const output = exportUniqueCSV(result, {
      keep: "most-complete",
    });

    expect(output).toContain("2,Rahul S.,rahul@gmail.com,9876543210");
    expect(output).not.toContain("1,Rahul Sharma");
  });

  it("should exclude all duplicate records", () => {
    const output = exportUniqueCSV(result, { keep: "exclude" });

    expect(output).not.toContain("Rahul");
    expect(output).toContain("Pavan");
    expect(output).toContain("Amit");
  });

  it("should use most-complete by default", () => {
    const output = exportUniqueCSV(result);

    expect(output).toContain("2,Rahul S.,rahul@gmail.com,9876543210");
    expect(output).not.toContain("1,Rahul Sharma");
  });

  it("should preserve the original record order", () => {
    const output = exportUniqueCSV(result, { keep: "first" });
    const rows = output.split("\n");

    expect(rows[1]).toContain("Rahul Sharma");
    expect(rows[2]).toContain("Pavan");
    expect(rows[3]).toContain("Amit");
  });

  it("should retain all records when there are no duplicates", () => {
    const uniqueCSV = [
      "id,name,email",
      "1,Rahul,rahul@gmail.com",
      "2,Pavan,pavan@gmail.com",
    ].join("\n");

    const uniqueResult = findDuplicatesCSV(uniqueCSV, options);
    const output = exportUniqueCSV(uniqueResult);

    expect(output).toContain("Rahul");
    expect(output).toContain("Pavan");
  });
});
