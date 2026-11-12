import type { SimilarityMethod, matchRecords } from "@matchforge/core";

export type DataRecord = Record<string, string>;

export type Dataset = {
  name: string;
  headers: string[];
  rows: DataRecord[];
};

export type FieldMapping = {
  id: number;
  sourceKey: string;
  targetKey: string;
  weight: number;
};

export type AlgorithmOption = {
  value: SimilarityMethod;
  label: string;
};

export type MatchingResult = ReturnType<typeof matchRecords<DataRecord, DataRecord>>;

export type RecordMatch = MatchingResult["matches"][number];
