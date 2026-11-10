import type { SimilarityMethod } from "../types/matching.js";
import type { QGramOptions } from "../types/similarity.js";
export type SimilarityFunction = (a: string, b: string, options?: QGramOptions) => number;
export declare const algorithmRegistry: Record<SimilarityMethod, SimilarityFunction>;
//# sourceMappingURL=algorithmRegistry.d.ts.map