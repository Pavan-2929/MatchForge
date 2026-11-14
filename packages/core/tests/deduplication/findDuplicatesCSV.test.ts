import { describe, expect, it } from "vitest";

import { findDuplicatesCSV } from "../../src/deduplication/findDuplicatesCSV";

describe("findDuplicateCSV", () => {
  const options = {
    fields: [
      { key: "name", weight: 0.6 },
      { key: "email", weight: 0.4 },
    ],
    method: "jaro-winkler" as const,
    threshold: 0.85,
  };

  const csv = [
    "id,name,email",
    "1,Rahul Sharma,rahul@gmail.com",
    "2,Rahul S.,rahul@gmail.com",
    "3,Pavan Kapadiya,pavan@gmail.com",
    "4,Amit Shah,amit@gmail.com",
  ].join("\n");

  it("should identify duplicate records", () => {
    const result = findDuplicatesCSV(csv, options);

    expect(result.duplicateGroups).toHaveLength(1);
    expect(result.duplicateGroups[0].records).toHaveLength(2);
  });

  it("should identify unique records", () => {
    const result = findDuplicatesCSV(csv, options);

    expect(result.uniqueRecords).toHaveLength(2);
    expect(result.uniqueRecords[0].name).toBe("Pavan Kapadiya");
    expect(result.uniqueRecords[1].name).toBe("Amit Shah");
  });

  it("should return CSV headers", () => {
    const result = findDuplicatesCSV(csv, options);

    expect(result.headers).toEqual(["id", "name", "email"]);
  });

  it("should return duplicate pair scores", () => {
    const result = findDuplicatesCSV(csv, options);

    expect(result.duplicateGroups[0].duplicatePairs).toHaveLength(1);
    expect(
      result.duplicateGroups[0].duplicatePairs[0].score,
    ).toBeGreaterThanOrEqual(0.85);
  });

  it("should return correct record counts", () => {
    const result = findDuplicatesCSV(csv, options);

    expect(result.totalRecords).toBe(4);
    expect(result.duplicateGroupsCount).toBe(1);
    expect(result.duplicateRecordsCount).toBe(2);
    expect(result.uniqueRecordsCount).toBe(2);
  });

  it("should return no duplicate groups for an empty dataset", () => {
    const result = findDuplicatesCSV("id,name,email", options);

    expect(result.duplicateGroups).toHaveLength(0);
    expect(result.uniqueRecords).toHaveLength(0);
    expect(result.totalRecords).toBe(0);
  });
});
