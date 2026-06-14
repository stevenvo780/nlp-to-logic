import type { Generator } from './types';
import type { CosetTable } from './todd-coxeter';
export interface CayleyGraph {
    vertices: number[];
    edges: Array<[number, Generator, number]>;
}
export declare function cayleyGraph(table: CosetTable): CayleyGraph;
//# sourceMappingURL=cayley.d.ts.map