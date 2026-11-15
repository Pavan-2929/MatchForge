import { normalizeString } from "../preprocessing/normalize.js";
import { soundex } from "../similarity/soundex.js";

import type {
  BlockingMethod,
  BlockingOptions,
  BlockingRule,
  CandidatePair,
  CandidateGenerationResult,
} from "./types.js";

function getBlockingKey(
  record: object,
  key: string,
  index: number,
  recordType: string,
  rule: BlockingRule,
  normalization: BlockingOptions["normalization"],
): string | undefined {
  const value = (record as Record<string, unknown>)[key];

  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  if (typeof value !== "string") {
    throw new Error(
      `${recordType} record at index ${index} must have a string value for "${key}".`,
    );
  }

  const normalized = normalizeString(value, normalization);

  if (normalized === "") {
    return undefined;
  }

  let blockingKey: string;

  switch (rule.method) {
    case "exact":
      blockingKey = normalized;
      break;

    case "prefix": {
      const length = rule.length ?? 3;

      if (!Number.isInteger(length) || length < 1) {
        throw new Error("Prefix blocking length must be a positive integer.");
      }

      blockingKey = normalized.slice(0, length);
      break;
    }

    case "soundex":
      blockingKey = soundex(normalized);
      break;

    default:
      throw new Error(`Unsupported blocking method: ${rule.method}`);
  }

  return blockingKey || undefined;
}

function validateRule(rule: BlockingRule): void {
  if (!rule.sourceKey || !rule.targetKey) {
    throw new Error("Each blocking rule must define sourceKey and targetKey.");
  }

  const supportedMethods: BlockingMethod[] = ["exact", "prefix", "soundex"];

  if (!supportedMethods.includes(rule.method)) {
    throw new Error(`Unsupported blocking method: ${rule.method}`);
  }

  if (
    rule.method === "prefix" &&
    rule.length !== undefined &&
    (!Number.isInteger(rule.length) || rule.length < 1)
  ) {
    throw new Error("Prefix blocking length must be a positive integer.");
  }
}

export function generateCandidates<S extends object, T extends object>(
  source: S[],
  target: T[],
  options: BlockingOptions,
): CandidateGenerationResult {
  if (!Array.isArray(source) || !Array.isArray(target)) {
    throw new TypeError("Source and target must be arrays.");
  }

  if (!options || !Array.isArray(options.rules) || options.rules.length === 0) {
    throw new Error("At least one blocking rule is required.");
  }

  options.rules.forEach(validateRule);

  const pairMap = new Map<string, CandidatePair>();

  for (const rule of options.rules) {
    const targetBuckets = new Map<string, number[]>();

    // Build an index of target records by their blocking key.
    target.forEach((record, targetIndex) => {
      if (
        record === null ||
        typeof record !== "object" ||
        Array.isArray(record)
      ) {
        return;
      }

      const key = getBlockingKey(
        record,
        rule.targetKey,
        targetIndex,
        "Target",
        rule,
        options.normalization,
      );

      if (key === undefined) {
        return;
      }

      const bucket = targetBuckets.get(key);

      if (bucket) {
        bucket.push(targetIndex);
      } else {
        targetBuckets.set(key, [targetIndex]);
      }
    });

    // Match each source record against the corresponding target bucket.
    source.forEach((record, sourceIndex) => {
      if (
        record === null ||
        typeof record !== "object" ||
        Array.isArray(record)
      ) {
        return;
      }

      const key = getBlockingKey(
        record,
        rule.sourceKey,
        sourceIndex,
        "Source",
        rule,
        options.normalization,
      );

      if (key === undefined) {
        return;
      }

      const matchingIndexes = targetBuckets.get(key);

      if (!matchingIndexes) {
        return;
      }

      for (const targetIndex of matchingIndexes) {
        const pairId = `${sourceIndex}:${targetIndex}`;

        if (!pairMap.has(pairId)) {
          pairMap.set(pairId, {
            sourceIndex,
            targetIndex,
          });
        }
      }
    });
  }

  const pairs = Array.from(pairMap.values());
  const totalPossiblePairs = source.length * target.length;

  const reductionPercentage =
    totalPossiblePairs === 0
      ? 0
      : ((totalPossiblePairs - pairs.length) / totalPossiblePairs) * 100;

  return {
    pairs,
    stats: {
      totalSourceRecords: source.length,
      totalTargetRecords: target.length,
      totalPossiblePairs,
      candidatePairs: pairs.length,
      reductionPercentage,
    },
  };
}
