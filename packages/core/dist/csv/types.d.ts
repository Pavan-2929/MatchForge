import { MatchingOptions, MatchCandidate } from "../types/matching.js";
export interface CSVParseOptions {
    delimiter?: string;
    skipEmptyLines?: boolean | "greedy";
}
export interface CSVParseError {
    type: string;
    code: string;
    message: string;
    row?: number;
}
export interface CSVParseResult {
    records: Record<string, string>[];
    headers: string[];
    errors: CSVParseError[];
    rowCount: number;
}
export type CSVRecord = Record<string, string>;
export type CSVMatchOptions = MatchingOptions & {
    sourceParseOptions?: CSVParseOptions;
    targetParseOptions?: CSVParseOptions;
};
export interface CSVMatchCandidate extends MatchCandidate<CSVRecord> {
    targetRecordNumber: number;
}
export interface CSVRecordMatch {
    source: CSVRecord;
    sourceRecordNumber: number;
    candidates: CSVMatchCandidate[];
    matched: boolean;
}
export interface CSVUnmatchedRecord {
    record: CSVRecord;
    sourceRecordNumber: number;
}
export interface CSVMatchResult {
    matches: CSVRecordMatch[];
    unmatched: CSVUnmatchedRecord[];
    totalSourceRecords: number;
    totalTargetRecords: number;
    sourceHeaders: string[];
    targetHeaders: string[];
    parseErrors: {
        source: CSVParseError[];
        target: CSVParseError[];
    };
}
export interface CSVExportOptions {
    delimiter?: string;
}
//# sourceMappingURL=types.d.ts.map