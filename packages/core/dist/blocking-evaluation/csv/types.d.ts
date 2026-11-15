import type { BlockingOptions } from "../../blocking/types.js";
import type { CSVParseOptions, CSVParseError } from "../../csv/types.js";
import type { GroundTruthPair } from "../../evaluation/types.js";
import type { BlockingEvaluationResult } from "../types.js";
export type CSVBlockingEvaluationOptions = BlockingOptions & {
    groundTruth: GroundTruthPair[];
    sourceParseOptions?: CSVParseOptions;
    targetParseOptions?: CSVParseOptions;
};
export interface CSVBlockingEvaluationResult extends BlockingEvaluationResult {
    sourceHeaders: string[];
    targetHeaders: string[];
    parseErrors: {
        source: CSVParseError[];
        target: CSVParseError[];
    };
}
//# sourceMappingURL=types.d.ts.map