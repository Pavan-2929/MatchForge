import type { NormalizeOptions } from "../types/preprocessing.js";
import type { QGramOptions } from "./similarity.js";
export type SimilarityMethod = "levenshtein" | "damerau-levenshtein" | "jaro" | "jaro-winkler" | "jaccard" | "dice" | "cosine" | "soundex" | "metaphone";
export interface FieldMatchScore {
    sourceKey: string;
    targetKey: string;
    score: number;
    weight: number;
}
export interface MatchingField {
    sourceKey: string;
    targetKey: string;
    weight?: number;
}
interface CommonMatchingOptions {
    method?: SimilarityMethod;
    threshold?: number;
    topK?: number;
    normalization?: NormalizeOptions;
    algorithmOptions?: QGramOptions;
}
export type MatchingOptions = CommonMatchingOptions & ({
    fields: MatchingField[];
    sourceKey?: never;
    targetKey?: never;
} | {
    sourceKey: string;
    targetKey: string;
    fields?: never;
});
export interface MatchCandidate<T> {
    record: T;
    score: number;
    method: SimilarityMethod;
    fieldScores: FieldMatchScore[];
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
export {};
//# sourceMappingURL=matching.d.ts.map