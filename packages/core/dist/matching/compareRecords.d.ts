import type { SimilarityMethod } from "../types/matching.js";
import type { NormalizeOptions } from "../types/preprocessing.js";
import type { QGramOptions } from "../types/similarity.js";
export interface CompareOptions {
    method?: SimilarityMethod;
    normalization?: NormalizeOptions;
    algorithmOptions?: QGramOptions;
}
export declare function compareRecords(a: string, b: string, options?: CompareOptions): number;
//# sourceMappingURL=compareRecords.d.ts.map