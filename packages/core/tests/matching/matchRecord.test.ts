import { describe, expect, it } from "vitest";

import { matchRecords } from "../../src/matching/matchRecords.js";

describe("matchRecords", () => {
  const source = [
    { id: 1, name: "Jon Smith" },
    { id: 2, name: "Alice Brown" },
  ];

  const target = [
    { id: 101, name: "John Smith" },
    { id: 102, name: "Jonathan Smith" },
    { id: 103, name: "Alicia Brown" },
    { id: 104, name: "Robert Wilson" },
  ];

  const options = {
    sourceKey: "name",
    targetKey: "name",
    method: "jaro-winkler" as const,
    threshold: 0.7,
  };

  it("should find similar records even when strings are not identical", () => {
    const result = matchRecords(source, target, options);

    expect(result.matches[0].candidates.length).toBeGreaterThan(0);
    expect(result.matches[0].candidates[0].record.name).toBe("John Smith");
  });

  it("should rank the most similar candidate first", () => {
    const result = matchRecords(source, target, {
      ...options,
      threshold: 0,
      topK: 4,
    });

    const candidates = result.matches[0].candidates;

    expect(candidates[0].record.name).toBe("John Smith");

    for (let i = 0; i < candidates.length - 1; i++) {
      expect(candidates[i].score).toBeGreaterThanOrEqual(
        candidates[i + 1].score,
      );
    }
  });

  it("should filter candidates below the threshold", () => {
    const result = matchRecords(source, target, {
      ...options,
      threshold: 0.95,
    });

    expect(
      result.matches[0].candidates.every(
        (candidate) => candidate.score >= 0.95,
      ),
    ).toBe(true);
  });

  it("should limit candidates using topK", () => {
    const result = matchRecords(source, target, {
      ...options,
      threshold: 0,
      topK: 2,
    });

    expect(result.matches[0].candidates).toHaveLength(2);
  });

  it("should identify unmatched records when no candidate meets the threshold", () => {
    const result = matchRecords(
      [{ id: 1, name: "Completely Different Name" }],
      [{ id: 101, name: "Robert Wilson" }],
      {
        ...options,
        threshold: 1,
      },
    );

    expect(result.unmatched).toHaveLength(1);
    expect(result.matches[0].matched).toBe(false);
  });

  it("should return correct dataset counts", () => {
    const result = matchRecords(source, target, options);

    expect(result.totalSourceRecords).toBe(2);
    expect(result.totalTargetRecords).toBe(4);
  });

  it("should reject an invalid threshold", () => {
    expect(() =>
      matchRecords(source, target, {
        ...options,
        threshold: 1.5,
      }),
    ).toThrow("Threshold must be between 0 and 1.");
  });

  it("should reject an invalid topK value", () => {
    expect(() =>
      matchRecords(source, target, {
        ...options,
        topK: 0,
      }),
    ).toThrow("topK must be a positive integer.");
  });

  it("should reject non-string matching fields", () => {
    expect(() => matchRecords([{ id: 1, name: 123 }], target, options)).toThrow(
      'Source record at index 0 must have a string value for "name".',
    );
  });

  it("should handle an empty target dataset", () => {
    const result = matchRecords(source, [], options);

    expect(result.matches).toHaveLength(2);
    expect(result.unmatched).toHaveLength(2);
  });

  it("should pass q-gram options to the matching algorithm", () => {
    const result = matchRecords(
      [{ id: 1, name: "hello" }],
      [
        { id: 101, name: "hallo" },
        { id: 102, name: "world" },
      ],
      {
        sourceKey: "name",
        targetKey: "name",
        method: "jaccard",
        threshold: 0,
        topK: 2,
        algorithmOptions: { q: 1 },
      },
    );

    expect(result.matches[0].candidates).toHaveLength(2);
    expect(result.matches[0].candidates[0].record.name).toBe("hallo");
  });

  it("should not match empty or whitespace-only source values", () => {
    const result = matchRecords(
      [{ id: 1, name: "   " }],
      [{ id: 101, name: "" }],
      options,
    );

    expect(result.matches[0].matched).toBe(false);
    expect(result.matches[0].candidates).toHaveLength(0);
    expect(result.unmatched).toHaveLength(1);
  });

  it("should ignore empty target values", () => {
    const result = matchRecords(
      [{ id: 1, name: "John" }],
      [
        { id: 101, name: "" },
        { id: 102, name: "   " },
        { id: 103, name: "John" },
      ],
      { ...options, threshold: 0 },
    );

    expect(result.matches[0].candidates).toHaveLength(1);
    expect(result.matches[0].candidates[0].record.id).toBe(103);
  });

  it("should reject NaN and infinite thresholds", () => {
    for (const threshold of [NaN, Infinity, -Infinity]) {
      expect(() =>
        matchRecords(source, target, {
          ...options,
          threshold,
        }),
      ).toThrow("Threshold must be between 0 and 1.");
    }
  });

  it("uses blocking to restrict candidate comparisons", () => {
    const source = [{ name: "Rahul Sharma", city: "Delhi" }];

    const target = [
      { fullName: "Rahul Sharma", location: "Delhi" },
      { fullName: "Rahul Sharma", location: "Mumbai" },
    ];

    const result = matchRecords(source, target, {
      fields: [{ sourceKey: "name", targetKey: "fullName" }],
      method: "jaro-winkler",
      threshold: 0.8,
      blocking: {
        rules: [
          {
            sourceKey: "city",
            targetKey: "location",
            method: "exact",
          },
        ],
      },
    });

    expect(result.matches[0].candidates).toHaveLength(1);
    expect(result.matches[0].candidates[0].record).toBe(target[0]);
  });

  it("preserves existing behavior when blocking is omitted", () => {
    const source = [{ name: "Rahul Sharma" }];

    const target = [{ fullName: "Rahul Sharma" }, { fullName: "Rahul Sharma" }];

    const result = matchRecords(source, target, {
      fields: [{ sourceKey: "name", targetKey: "fullName" }],
      threshold: 0.8,
      topK: 2,
    });

    expect(result.matches[0].candidates).toHaveLength(2);
  });

  it("generates separate candidate sets for each source record", () => {
    const source = [
      { name: "Rahul Sharma", city: "Delhi" },
      { name: "Amit Patel", city: "Mumbai" },
      { name: "Neha Shah", city: "Pune" },
    ];

    const target = [
      { fullName: "Rahul Sharma", location: "Delhi" },
      { fullName: "Rahul S.", location: "Delhi" },
      { fullName: "Amit Patel", location: "Mumbai" },
      { fullName: "Neha Shah", location: "Ahmedabad" },
    ];

    const result = matchRecords(source, target, {
      fields: [{ sourceKey: "name", targetKey: "fullName" }],
      method: "jaro-winkler",
      threshold: 0.5,
      topK: 4,
      blocking: {
        rules: [
          {
            sourceKey: "city",
            targetKey: "location",
            method: "exact",
          },
        ],
      },
    });

    expect(result.matches[0].candidates.map((c) => c.record)).toEqual([
      target[0],
      target[1],
    ]);

    expect(result.matches[1].candidates.map((c) => c.record)).toEqual([
      target[2],
    ]);

    expect(result.matches[2].candidates).toHaveLength(0);
  });

  it("should combine multiple blocking rules using OR semantics", () => {
    const source = [
      { name: "Rahul Sharma", city: "Delhi", email: "rahul@example.com" },
    ];

    const target = [
      { name: "Rahul Sharma", city: "Mumbai", email: "rahul@example.com" },
      { name: "Rahul Sharma", city: "Delhi", email: "other@example.com" },
      { name: "Rahul Sharma", city: "Mumbai", email: "other@example.com" },
    ];

    const result = matchRecords(source, target, {
      fields: [{ sourceKey: "name", targetKey: "name" }],
      threshold: 0.8,
      topK: 3,
      blocking: {
        rules: [
          { sourceKey: "city", targetKey: "city", method: "exact" },
          { sourceKey: "email", targetKey: "email", method: "exact" },
        ],
      },
    });

    expect(result.matches[0].candidates).toHaveLength(2);
  });

  it("should apply topK after blocking and scoring", () => {
    const source = [{ name: "Rahul Sharma", city: "Delhi" }];

    const target = [
      { name: "Rahul Sharma", city: "Delhi" },
      { name: "Rahul Sharm", city: "Delhi" },
      { name: "Rahul", city: "Delhi" },
      { name: "Rahul Sharma", city: "Mumbai" },
    ];

    const result = matchRecords(source, target, {
      fields: [{ sourceKey: "name", targetKey: "name" }],
      threshold: 0,
      topK: 1,
      blocking: {
        rules: [{ sourceKey: "city", targetKey: "city", method: "exact" }],
      },
    });

    expect(result.matches[0].candidates).toHaveLength(1);
    expect(result.matches[0].candidates[0].record).toBe(target[0]);
  });

  it("should return unmatched records when blocking generates no candidates", () => {
    const result = matchRecords(
      [{ name: "Rahul Sharma", city: "Delhi" }],
      [{ name: "Rahul Sharma", city: "Mumbai" }],
      {
        fields: [{ sourceKey: "name", targetKey: "name" }],
        threshold: 0,
        blocking: {
          rules: [{ sourceKey: "city", targetKey: "city", method: "exact" }],
        },
      },
    );

    expect(result.matches[0].candidates).toHaveLength(0);
    expect(result.matches[0].matched).toBe(false);
    expect(result.unmatched).toHaveLength(1);
  });

  it("should use matching normalization when blocking normalization is omitted", () => {
    const result = matchRecords(
      [{ name: "Rahul Sharma", city: "DELHI" }],
      [{ name: "Rahul Sharma", city: "delhi" }],
      {
        fields: [{ sourceKey: "name", targetKey: "name" }],
        threshold: 0.8,
        normalization: { lowercase: true },
        blocking: {
          rules: [{ sourceKey: "city", targetKey: "city", method: "exact" }],
        },
      },
    );

    expect(result.matches[0].candidates).toHaveLength(1);
  });
});
