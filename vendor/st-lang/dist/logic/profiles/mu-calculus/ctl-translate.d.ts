import type { MuFormula } from './types';
/** Subset de CTL que el translator entiende. Reproduce la forma del AST
 *  de `src/profiles/ctl/types.ts` para que se pueda pasar tal cual. */
export type CTLLike = {
    kind: 'atom';
    name: string;
} | {
    kind: 'true';
} | {
    kind: 'false';
} | {
    kind: 'not';
    arg: CTLLike;
} | {
    kind: 'and';
    args: CTLLike[];
} | {
    kind: 'or';
    args: CTLLike[];
} | {
    kind: 'implies';
    left: CTLLike;
    right: CTLLike;
} | {
    kind: 'EX';
    arg: CTLLike;
} | {
    kind: 'AX';
    arg: CTLLike;
} | {
    kind: 'EF';
    arg: CTLLike;
} | {
    kind: 'AF';
    arg: CTLLike;
} | {
    kind: 'EG';
    arg: CTLLike;
} | {
    kind: 'AG';
    arg: CTLLike;
} | {
    kind: 'EU';
    left: CTLLike;
    right: CTLLike;
} | {
    kind: 'AU';
    left: CTLLike;
    right: CTLLike;
};
/**
 * Traduce una fórmula CTL a su equivalente en μ-cálculo.
 *
 * Acepta el shape estructural del AST de CTL (sin importar la fuente
 * exacta) — útil para evitar acoplamiento directo con `src/profiles/ctl`.
 */
export declare function ctlToMu(ctlFormula: {
    kind: string;
    [k: string]: unknown;
}): MuFormula;
//# sourceMappingURL=ctl-translate.d.ts.map