import { describe, expect, it } from "vitest";

import { findDuplicates } from "../../src/deduplication/findDuplicates.js";

describe("findDuplicates", () => {
  const customers = [
    { id: 1, name: "Rahul Sharma", email: "rahul@gmail.com" },
    { id: 2, name: "Rahul S.", email: "rahul@gmail.com" },
    { id: 3, name: "Pavan Kapadiya", email: "pavan@gmail.com" },
    { id: 4, name: "Amit Shah", email: "amit@gmail.com" },
  ];

  const options = {
    fields: [
      { key: "name", weight: 0.6 },
      { key: "email", weight: 0.4 },
    ],
    method: "jaro-winkler" as const,
    threshold: 0.85,
  };

  it("should identify duplicate records", () => {
    const result = findDuplicates(customers, options);

    expect(result.duplicateGroups).toHaveLength(1);
    expect(result.duplicateGroups[0].records).toHaveLength(2);
  });

  it("should identify unique records", () => {
    const result = findDuplicates(customers, options);

    expect(result.uniqueRecords).toEqual([customers[2], customers[3]]);
  });

  it("should preserve original records", () => {
    const result = findDuplicates(customers, options);

    expect(result.duplicateGroups[0].records[0]).toBe(customers[0]);
    expect(result.duplicateGroups[0].records[1]).toBe(customers[1]);
  });

  it("should return duplicate pair scores", () => {
    const result = findDuplicates(customers, options);

    expect(result.duplicateGroups[0].duplicatePairs).toHaveLength(1);
    expect(
      result.duplicateGroups[0].duplicatePairs[0].score,
    ).toBeGreaterThanOrEqual(0.85);
  });

  it("should return correct counts", () => {
    const result = findDuplicates(customers, options);

    expect(result.totalRecords).toBe(4);
    expect(result.duplicateGroupsCount).toBe(1);
    expect(result.duplicateRecordsCount).toBe(2);
    expect(result.uniqueRecordsCount).toBe(2);
  });

  it("should handle a dataset without duplicates", () => {
    const records = [
      { name: "Rahul", email: "rahul@gmail.com" },
      { name: "Pavan", email: "pavan@gmail.com" },
    ];

    const result = findDuplicates(records, options);

    expect(result.duplicateGroups).toHaveLength(0);
  });

  it("should group records connected through transitive matches", () => {
    const records = [
      { name: "ABC Company" },
      { name: "ABC Compan" },
      { name: "ABC Compa" },
      { name: "XYZ Limited" },
    ];

    const result = findDuplicates(records, {
      fields: [{ key: "name" }],
      method: "levenshtein",
      threshold: 0.75,
    });

    expect(result.duplicateGroups).toHaveLength(1);
    expect(result.duplicateGroups[0].records).toHaveLength(3);
    expect(result.uniqueRecords).toEqual([records[3]]);
  });
});
