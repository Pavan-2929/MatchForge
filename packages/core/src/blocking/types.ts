import type { NormalizeOptions } from "../types/preprocessing.js";

export type BlockingMethod = "exact" | "prefix" | "soundex";

export interface BlockingRule {
  sourceKey: string;
  targetKey: string;
  method: BlockingMethod;
  length?: number;
}

export interface BlockingOptions {
  rules: BlockingRule[];
  normalization?: NormalizeOptions;
}

export interface CandidatePair {
  sourceIndex: number;
  targetIndex: number;
}

export interface CandidateGenerationStats {
  totalSourceRecords: number;
  totalTargetRecords: number;
  totalPossiblePairs: number;
  candidatePairs: number;
  reductionPercentage: number;
}


export interface CandidateGenerationResult {
  pairs: CandidatePair[];
  stats: CandidateGenerationStats;
}

export interface DuplicateBlockingRule {
  key: string;
  method: BlockingMethod;
  length?: number;
}

export interface DuplicateBlockingOptions {
  rules: DuplicateBlockingRule[];
  normalization?: NormalizeOptions;
}