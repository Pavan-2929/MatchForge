export { normalizeString } from "./preprocessing/normalize.js";

export type { NormalizeOptions } from "./types/preprocessing.js";

export {
  levenshteinDistance,
  levenshteinSimilarity,
} from "./similarity/levenshtein.js";

export {
  damerauLevenshteinDistance,
  damerauLevenshteinSimilarity,
} from "./similarity/damerauLevenshtein.js";

export { jaroSimilarity, jaroWinklerSimilarity } from "./similarity/jaro.js";

export { jaccardSimilarity, diceSimilarity } from "./similarity/qgram.js";
export type { QGramOptions } from "./types/similarity.js";

export { cosineSimilarity } from "./similarity/cosine.js";

export { soundex, soundexSimilarity } from "./similarity/soundex.js";

export { metaphone, metaphoneSimilarity } from "./similarity/metaphone.js";

// Matching engine
export { compareStrings } from "./matching/compareStrings.js";
export type { CompareOptions } from "./matching/compareStrings.js";

export { matchRecords } from "./matching/matchRecords.js";

// Matching types
export type {
  SimilarityMethod,
  MatchingField,
  MatchingOptions,
  FieldMatchScore,
  MatchCandidate,
  RecordMatch,
  MatchingResult,
} from "./types/matching.js";

// CSV utilities
export { parseCSV } from "./csv/parseCSV.js";
export { matchCSV } from "./csv/matchCSV.js";
export { exportMatches } from "./csv/exportMatches.js";

export type {
  CSVParseOptions,
  CSVParseError,
  CSVParseResult,
  CSVRecord,
  CSVMatchOptions,
  CSVMatchCandidate,
  CSVRecordMatch,
  CSVUnmatchedRecord,
  CSVMatchResult,
  CSVExportOptions,
} from "./csv/types.js";
