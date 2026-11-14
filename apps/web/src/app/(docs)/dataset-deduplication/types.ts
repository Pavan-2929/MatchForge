import type {
  DuplicateResult,
  NormalizeOptions,
  SimilarityMethod,
} from "@matchforge/core";

export type DataRecord = Record<string, string>;

export type Dataset = {
  name: string;
  headers: string[];
  records: DataRecord[];
};

export type DeduplicationField = {
  key: string;
  weight: number;
};

export type DeduplicationSettings = {
  method: SimilarityMethod;
  threshold: number;
  normalization: NormalizeOptions;
};

export type DeduplicationResult = DuplicateResult<DataRecord>;
