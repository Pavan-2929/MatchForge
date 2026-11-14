import type { DuplicateOptions, DuplicatePair, DuplicateResult } from "./types.js";
export declare function findDuplicatePairs<T extends object>(records: T[], options: DuplicateOptions): DuplicatePair[];
export declare function createDuplicateGroups<T extends object>(records: T[], pairs: DuplicatePair[]): DuplicateResult<T>;
export declare function findDuplicates<T extends object>(records: T[], options: DuplicateOptions): DuplicateResult<T>;
//# sourceMappingURL=findDuplicates.d.ts.map