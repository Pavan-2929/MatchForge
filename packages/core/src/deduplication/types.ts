import type { NormalizeOptions } from "../types/preprocessing.js";
import type { QGramOptions } from "../types/similarity.js";
import type { SimilarityMethod } from "../types/matching.js";
import type { FieldMatchScore } from "../types/matching.js";
import type { CSVRecord, CSVParseError } from "../csv/types.js";

export interface DuplicateField {
  key: string;
  weight?: number;
}

export interface DuplicateOptions {
  fields: DuplicateField[];
  method?: SimilarityMethod;
  threshold?: number;
  normalization?: NormalizeOptions;
  algorithmOptions?: QGramOptions;
}

export interface DuplicatePair {
  firstRecordIndex: number;
  secondRecordIndex: number;
  score: number;
  fieldScores: FieldMatchScore[];
}

export interface DuplicateGroup<T> {
  groupId: number;
  records: T[];
  duplicatePairs: DuplicatePair[];
}

export interface DuplicateResult<T> {
  duplicateGroups: DuplicateGroup<T>[];
  uniqueRecords: T[];

  totalRecords: number;
  duplicateGroupsCount: number;
  duplicateRecordsCount: number;
  uniqueRecordsCount: number;
}

export interface DuplicateCSVResult extends DuplicateResult<CSVRecord> {
  records: CSVRecord[];
  headers: string[];
  parseErrors: CSVParseError[];
}

export interface UniqueCSVExportOptions {
  keep?: "first" | "most-complete" | "exclude"
}

