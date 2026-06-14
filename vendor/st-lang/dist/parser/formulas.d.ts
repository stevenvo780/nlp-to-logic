import { Formula } from '../types';
import { ParserState } from './state';
export declare const MODAL_ALIASES: Record<string, Record<string, 'box' | 'diamond' | 'box_not'>>;
export declare function parseFormula(s: ParserState): Formula;
export declare function formulaToString(f: Formula): string;
export declare function parseIdList(s: ParserState): string[];
//# sourceMappingURL=formulas.d.ts.map