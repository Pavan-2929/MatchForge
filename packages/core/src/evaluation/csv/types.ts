
import type { MatchingOptions } from "../../types/matching.js";
import type { CSVParseOptions, CSVParseError } from "../../csv/types.js";
import type {
  GroundTruthPair,
  EvaluationResult,
} from "../types.js";

export type CSVEvaluationOptions = MatchingOptions & {
  groundTruth: GroundTruthPair[];
  sourceParseOptions?: CSVParseOptions;
  targetParseOptions?: CSVParseOptions;
};

export interface CSVEvaluationResult extends EvaluationResult {
  sourceHeaders: string[];
  targetHeaders: string[];
  parseErrors: {
    source: CSVParseError[];
    target: CSVParseError[];
  };
}
