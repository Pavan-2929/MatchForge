import type { NormalizeOptions } from "../types/preprocessing.js";
import type { QGramOptions } from "./similarity.js";

export type SimilarityMethod =
  | "levenshtein"
  | "damerau-levenshtein"
  | "jaro"
  | "jaro-winkler"
  | "jaccard"
  | "dice"
  | "cosine"
  | "soundex"
  | "metaphone";

export interface MatchingOptions {
  sourceKey: string;
  targetKey: string;

  method?: SimilarityMethod;

  threshold?: number;

  topK?: number;

  normalization?: NormalizeOptions;
  algorithmOptions?: QGramOptions;
}

export interface MatchCandidate<T> {
  record: T;
  score: number;
  method: SimilarityMethod;
}

export interface RecordMatch<S, T> {
  source: S;
  candidates: MatchCandidate<T>[];
  matched: boolean;
}

export interface MatchingResult<S, T> {
  matches: RecordMatch<S, T>[];
  unmatched: S[];
  totalSourceRecords: number;
  totalTargetRecords: number;
}
