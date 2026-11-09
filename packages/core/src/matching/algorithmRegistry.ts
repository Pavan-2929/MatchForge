import { levenshteinSimilarity } from "../similarity/levenshtein.js";

import { damerauLevenshteinSimilarity } from "../similarity/damerauLevenshtein.js";

import { jaroSimilarity, jaroWinklerSimilarity } from "../similarity/jaro.js";

import { jaccardSimilarity, diceSimilarity } from "../similarity/qgram.js";

import { cosineSimilarity } from "../similarity/cosine.js";

import { soundexSimilarity } from "../similarity/soundex.js";
import { metaphoneSimilarity } from "../similarity/metaphone.js";

import type { SimilarityMethod } from "../types/matching.js";

import type { QGramOptions } from "../types/similarity.js";

export type SimilarityFunction = (
  a: string,
  b: string,
  options?: QGramOptions,
) => number;

export const algorithmRegistry: Record<SimilarityMethod, SimilarityFunction> = {
  levenshtein: levenshteinSimilarity,
  "damerau-levenshtein": damerauLevenshteinSimilarity,
  jaro: jaroSimilarity,
  "jaro-winkler": jaroWinklerSimilarity,
  jaccard: jaccardSimilarity,
  dice: diceSimilarity,
  cosine: cosineSimilarity,
  soundex: soundexSimilarity,
  metaphone: metaphoneSimilarity,
};
