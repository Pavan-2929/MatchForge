import { compareRecords } from "./compareRecords.js";

import type {
  MatchingOptions,
  MatchingResult,
  SimilarityMethod,
} from "../types/matching.js";

import { normalizeString } from "../preprocessing/normalize.js";

function getStringValue(
  record: object,
  key: string,
  index: number,
  recordType: string,
): string {
  const value = (record as Record<string, unknown>)[key];

  if (typeof value !== "string") {
    throw new Error(
      `${recordType} record at index ${index} must have a string value for "${key}".`,
    );
  }

  return value;
}

export function matchRecords<S extends object, T extends object>(
  source: S[],
  target: T[],
  options: MatchingOptions,
): MatchingResult<S, T> {
  const {
    sourceKey,
    targetKey,
    method = "jaro-winkler",
    threshold = 0.7,
    topK = 1,
    normalization = {},
    algorithmOptions = {},
  } = options;

  if (!Number.isFinite(threshold) || threshold < 0 || threshold > 1) {
    throw new Error("Threshold must be between 0 and 1.");
  }

  if (!Number.isInteger(topK) || topK < 1) {
    throw new Error("topK must be a positive integer.");
  }

  const matches = source.map((sourceRecord, sourceIndex) => {
    const sourceValue = getStringValue(
      sourceRecord,
      sourceKey,
      sourceIndex,
      "Source",
    );

    const normalizedSource = normalizeString(sourceValue, normalization);

    if (normalizedSource.trim().length === 0) {
      return {
        source: sourceRecord,
        candidates: [],
        matched: false,
      };
    }

    const candidates = target.map((targetRecord, targetIndex) => {
        const targetValue = getStringValue(
          targetRecord,
          targetKey,
          targetIndex,
          "Target",
        );

        if (normalizeString(targetValue, normalization).trim() === "") {
          return null;
        }

        const score = compareRecords(sourceValue, targetValue, {
          method,
          normalization,
          algorithmOptions,
        });

        return {
          record: targetRecord,
          score,
          method,
        };
      })
      .filter((candidate) => candidate !== null)
      .filter((candidate) => candidate.score >= threshold)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);

    return {
      source: sourceRecord,
      candidates,
      matched: candidates.length > 0,
    };
  });

  const unmatched = matches
    .filter((match) => !match.matched)
    .map((match) => match.source);

  return {
    matches,
    unmatched,
    totalSourceRecords: source.length,
    totalTargetRecords: target.length,
  };
}
