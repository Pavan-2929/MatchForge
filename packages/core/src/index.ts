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