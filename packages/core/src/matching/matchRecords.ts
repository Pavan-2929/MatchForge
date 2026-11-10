import { compareRecords } from "./compareRecords.js";
import { getMatchingFields } from "./getMatchingFields.js";
import { calculateWeightedScore } from "./calculateWeightedScore.js";

import type {
  MatchingOptions,
  MatchingResult,
  MatchCandidate,
  FieldMatchScore,
} from "../types/matching.js";

import { normalizeString } from "../preprocessing/normalize.js";

function getStringValue(
  record: object,
  key: string,
  index: number,
  recordType: string,
): string | undefined {
  const value = (record as Record<string, unknown>)[key];

  if (value === undefined || value === null) {
    return undefined;
  }

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
  const fields = getMatchingFields(options);

  const {
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
    const candidates: MatchCandidate<T>[] = [];

    target.forEach((targetRecord, targetIndex) => {
      const fieldScores: FieldMatchScore[] = [];

      for (const field of fields) {
        const weight = field.weight ?? 1;

        if (weight === 0) {
          continue;
        }

        const sourceValue = getStringValue(
          sourceRecord,
          field.sourceKey,
          sourceIndex,
          "Source",
        );

        const targetValue = getStringValue(
          targetRecord,
          field.targetKey,
          targetIndex,
          "Target",
        );

        if (sourceValue === undefined || targetValue === undefined) {
          continue;
        }

        const normalizedSource = normalizeString(sourceValue, normalization);

        const normalizedTarget = normalizeString(targetValue, normalization);

        if (normalizedSource.trim() === "" || normalizedTarget.trim() === "") {
          continue;
        }

        const score = compareRecords(sourceValue, targetValue, {
          method,
          normalization,
          algorithmOptions,
        });

        fieldScores.push({
          sourceKey: field.sourceKey,
          targetKey: field.targetKey,
          score,
          weight,
        });
      }

      const score = calculateWeightedScore(fieldScores);

      if (score === null || score < threshold) {
        return;
      }

      candidates.push({
        record: targetRecord,
        score,
        method,
        fieldScores,
      });
    });

    candidates.sort((a, b) => b.score - a.score);

    const topCandidates = candidates.slice(0, topK);

    return {
      source: sourceRecord,
      candidates: topCandidates,
      matched: topCandidates.length > 0,
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
