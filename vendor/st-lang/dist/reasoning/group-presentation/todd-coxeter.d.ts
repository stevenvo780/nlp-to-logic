import type { GroupPresentation, Generator, Word } from './types';
export interface CosetTable {
    numCosets: number;
    generators: Generator[];
    table: Map<number, Map<Generator, number>>;
}
export declare function toddCoxeter(presentation: GroupPresentation, subgroupGens?: Word[], maxCosets?: number): CosetTable | 'incomplete';
export declare function groupOrder(presentation: GroupPresentation, maxCosets?: number): number | 'infinite' | 'unknown';
export declare function isInSubgroup(word: Word, table: CosetTable): boolean;
//# sourceMappingURL=todd-coxeter.d.ts.map