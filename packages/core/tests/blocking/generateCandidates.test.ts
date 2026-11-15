import { describe, expect, it } from "vitest";
import { generateCandidates } from "../../src/blocking/generateCandidates";

describe("generateCandidates", () => {
  it("generates candidates using exact blocking", () => {
    const source = [{ city: "Delhi" }, { city: "Mumbai" }];

    const target = [
      { location: "Delhi" },
      { location: "Pune" },
      { location: "Mumbai" },
    ];

    const result = generateCandidates(source, target, {
      rules: [
        {
          sourceKey: "city",
          targetKey: "location",
          method: "exact",
        },
      ],
    });

    expect(result.pairs).toEqual([
      { sourceIndex: 0, targetIndex: 0 },
      { sourceIndex: 1, targetIndex: 2 },
    ]);
  });

  it("normalizes values before exact blocking", () => {
    const source = [{ city: "  NEW DELHI  " }];
    const target = [{ location: "new delhi" }];

    const result = generateCandidates(source, target, {
      rules: [
        {
          sourceKey: "city",
          targetKey: "location",
          method: "exact",
        },
      ],
    });

    expect(result.pairs).toEqual([{ sourceIndex: 0, targetIndex: 0 }]);
  });

  it("generates candidates using prefix blocking", () => {
    const source = [{ name: "Rahul Sharma" }];
    const target = [{ fullName: "Rahul Singh" }, { fullName: "Amit Patel" }];

    const result = generateCandidates(source, target, {
      rules: [
        {
          sourceKey: "name",
          targetKey: "fullName",
          method: "prefix",
          length: 3,
        },
      ],
    });

    expect(result.pairs).toEqual([{ sourceIndex: 0, targetIndex: 0 }]);
  });

  it("generates candidates using Soundex blocking", () => {
    const source = [{ name: "Robert" }];
    const target = [{ fullName: "Rupert" }, { fullName: "Alice" }];

    const result = generateCandidates(source, target, {
      rules: [
        {
          sourceKey: "name",
          targetKey: "fullName",
          method: "soundex",
        },
      ],
    });

    expect(result.pairs).toEqual([{ sourceIndex: 0, targetIndex: 0 }]);
  });

  it("combines multiple rules using OR semantics", () => {
    const source = [{ name: "Rahul Sharma", city: "Delhi" }];

    const target = [
      { fullName: "Rahul Singh", location: "Mumbai" },
      { fullName: "Amit Patel", location: "Delhi" },
      { fullName: "Neha Shah", location: "Pune" },
    ];

    const result = generateCandidates(source, target, {
      rules: [
        {
          sourceKey: "city",
          targetKey: "location",
          method: "exact",
        },
        {
          sourceKey: "name",
          targetKey: "fullName",
          method: "prefix",
          length: 3,
        },
      ],
    });

    expect(result.pairs).toEqual([
      { sourceIndex: 0, targetIndex: 1 },
      { sourceIndex: 0, targetIndex: 0 },
    ]);
  });

  it("does not return duplicate pairs when multiple rules match", () => {
    const source = [{ name: "Rahul", city: "Delhi" }];
    const target = [{ fullName: "Rahul", location: "Delhi" }];

    const result = generateCandidates(source, target, {
      rules: [
        {
          sourceKey: "city",
          targetKey: "location",
          method: "exact",
        },
        {
          sourceKey: "name",
          targetKey: "fullName",
          method: "exact",
        },
      ],
    });

    expect(result.pairs).toHaveLength(1);
  });

  it("skips missing and empty blocking values", () => {
    const source = [{ city: "Delhi" }, { city: "" }, {}];

    const target = [{ location: "Delhi" }, { location: "" }, {}];

    const result = generateCandidates(source, target, {
      rules: [
        {
          sourceKey: "city",
          targetKey: "location",
          method: "exact",
        },
      ],
    });

    expect(result.pairs).toEqual([{ sourceIndex: 0, targetIndex: 0 }]);
  });

  it("calculates candidate generation statistics", () => {
    const source = [{ city: "Delhi" }, { city: "Mumbai" }];

    const target = [
      { location: "Delhi" },
      { location: "Pune" },
      { location: "Mumbai" },
    ];

    const result = generateCandidates(source, target, {
      rules: [
        {
          sourceKey: "city",
          targetKey: "location",
          method: "exact",
        },
      ],
    });

    expect(result.stats).toEqual({
      totalSourceRecords: 2,
      totalTargetRecords: 3,
      totalPossiblePairs: 6,
      candidatePairs: 2,
      reductionPercentage: (4 / 6) * 100,
    });
  });

  it("returns zero statistics for empty datasets", () => {
    const result = generateCandidates([], [], {
      rules: [
        {
          sourceKey: "city",
          targetKey: "location",
          method: "exact",
        },
      ],
    });

    expect(result).toEqual({
      pairs: [],
      stats: {
        totalSourceRecords: 0,
        totalTargetRecords: 0,
        totalPossiblePairs: 0,
        candidatePairs: 0,
        reductionPercentage: 0,
      },
    });
  });

  it("supports custom normalization options", () => {
    const source = [{ city: "New-Delhi" }];
    const target = [{ location: "NewDelhi" }];

    const result = generateCandidates(source, target, {
      rules: [
        {
          sourceKey: "city",
          targetKey: "location",
          method: "exact",
        },
      ],
      normalization: {
        removePunctuation: true,
      },
    });

    expect(result.pairs).toEqual([{ sourceIndex: 0, targetIndex: 0 }]);
  });
});
