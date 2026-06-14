/**
 * Tipos en HOL: variables de tipo, constantes (`bool`, `ind`,
 * ...) y aplicaciones de constructores de tipo (`fun(α, β)`,
 * `prod(α, β)`, ...).
 */
export type HOLType = {
    kind: 'tvar';
    name: string;
} | {
    kind: 'tconst';
    name: string;
} | {
    kind: 'tapp';
    fn: string;
    args: HOLType[];
};
/**
 * Términos HOL. Polimorfismo via `tvar` en los tipos de
 * variables/constantes. `comb` es aplicación; `abs` es
 * λ-abstracción con el tipo del parámetro registrado.
 */
export type HOLTerm = {
    kind: 'var';
    name: string;
    type: HOLType;
} | {
    kind: 'const';
    name: string;
    type: HOLType;
} | {
    kind: 'comb';
    fn: HOLTerm;
    arg: HOLTerm;
} | {
    kind: 'abs';
    param: string;
    paramType: HOLType;
    body: HOLTerm;
};
/**
 * Secuente abstracto. Las hipótesis son una multiset modelada
 * como array; la igualdad se chequea por α-equivalencia.
 */
export interface HOLSequent {
    hyps: HOLTerm[];
    concl: HOLTerm;
}
/**
 * Teorema HOL: hipótesis + conclusión + huella de la regla
 * usada y los teoremas-premisa. Solo se obtiene aplicando una
 * regla primitiva — no hay constructor público.
 */
export interface HOLTheorem {
    readonly hyps: HOLTerm[];
    readonly concl: HOLTerm;
    readonly rule: string;
    readonly derived?: HOLTheorem[];
}
//# sourceMappingURL=types.d.ts.map