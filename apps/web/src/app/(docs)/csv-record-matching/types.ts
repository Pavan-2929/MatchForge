import type {
  CSVMatchResult,
  CSVParseResult,
  SimilarityMethod,
  NormalizeOptions,
} from "@matchforge/core";

export type CSVDataset = {
  name: string;
  fileName: string;
  csvText: string;
  parsed: CSVParseResult;
};

export type FieldMapping = {
  id: number;
  sourceKey: string;
  targetKey: string;
  weight: number;
};

export type MatchingResult = CSVMatchResult;

export type MatchingSettings = {
  method: SimilarityMethod;
  threshold: number;
  normalization: NormalizeOptions;
};
