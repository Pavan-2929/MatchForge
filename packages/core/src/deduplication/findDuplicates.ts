import { matchRecords } from "../matching/matchRecords.js";

import type {
  DuplicateOptions,
  DuplicatePair,
  DuplicateGroup,
  DuplicateResult,
} from "./types.js";

export function findDuplicatePairs<T extends object>(
  records: T[],
  options: DuplicateOptions,
): DuplicatePair[] {
  const matchingResult = matchRecords(records, records, {
    fields: options.fields.map((field) => ({
      sourceKey: field.key,
      targetKey: field.key,
      weight: field.weight,
    })),
    method: options.method,
    threshold: options.threshold,
    topK: Math.max(records.length, 1),
    normalization: options.normalization,
    algorithmOptions: options.algorithmOptions,
  });

  const pairs: DuplicatePair[] = [];

  matchingResult.matches.forEach((match, firstIndex) => {
    match.candidates.forEach((candidate) => {
      const secondIndex = records.indexOf(candidate.record);

      if (secondIndex <= firstIndex) {
        return;
      }

      pairs.push({
        firstRecordIndex: firstIndex,
        secondRecordIndex: secondIndex,
        score: candidate.score,
        fieldScores: candidate.fieldScores,
      });
    });
  });

  return pairs;
}

export function createDuplicateGroups<T extends object>(
  records: T[],
  pairs: DuplicatePair[],
): DuplicateResult<T> {
  const connections: number[][] = records.map(() => []);

  for (const pair of pairs) {
    connections[pair.firstRecordIndex].push(pair.secondRecordIndex);
    connections[pair.secondRecordIndex].push(pair.firstRecordIndex);
  }

  const visited = new Set<number>();
  const duplicateGroups: DuplicateGroup<T>[] = [];
  const uniqueRecords: T[] = [];

  for (let i = 0; i < records.length; i++) {
    if (visited.has(i)) {
      continue;
    }

    if (connections[i].length === 0) {
      visited.add(i);
      uniqueRecords.push(records[i]);
      continue;
    }

    const groupIndexes: number[] = [];
    const queue = [i];

    visited.add(i);

    while (queue.length > 0) {
      const current = queue.shift()!;

      groupIndexes.push(current);

      for (const neighbor of connections[current]) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }

    const groupRecords = groupIndexes.map((index) => records[index]);

    const groupPairs = pairs.filter(
      (pair) =>
        groupIndexes.includes(pair.firstRecordIndex) &&
        groupIndexes.includes(pair.secondRecordIndex),
    );

    duplicateGroups.push({
      groupId: duplicateGroups.length + 1,
      records: groupRecords,
      duplicatePairs: groupPairs,
    });
  }

  const duplicateRecordsCount = duplicateGroups.reduce(
    (total, group) => total + group.records.length,
    0,
  );

  return {
    duplicateGroups,
    uniqueRecords,
    totalRecords: records.length,
    duplicateGroupsCount: duplicateGroups.length,
    duplicateRecordsCount,
    uniqueRecordsCount: uniqueRecords.length,
  };
}
export function findDuplicates<T extends object>(
  records: T[],
  options: DuplicateOptions,
): DuplicateResult<T> {
  const pairs = findDuplicatePairs(records, options);

  return createDuplicateGroups(records, pairs);
}
