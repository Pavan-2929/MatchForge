import { normalizeString } from "../preprocessing/normalize.js";
import { algorithmRegistry } from "./algorithmRegistry.js";

import type { SimilarityMethod } from "../types/matching.js";

import type { NormalizeOptions } from "../types/preprocessing.js";
import type { QGramOptions } from "../types/similarity.js";

export interface CompareOptions {
  method?: SimilarityMethod;
  normalization?: NormalizeOptions;
  algorithmOptions?: QGramOptions;
}

export function compareRecords(
  a: string,
  b: string,
  options: CompareOptions = {},
): number {

  const {
    method = "jaro-winkler",
    normalization = {},
    algorithmOptions = {},
  } = options;
  
  const normalizedA = normalizeString(a, normalization);
  const normalizedB = normalizeString(b, normalization);

  const similarityFunction = algorithmRegistry[method];

  return similarityFunction(normalizedA, normalizedB, algorithmOptions);
}
