export type CoqEmitMode = 'tactic' | 'proofterm' | 'both';
export interface CoqV2ExportOptions {
    /** Default: 'STExportV2' */
    moduleName?: string;
    /**
     * Imports adicionales (sin el `Require Import` prefix). Si se omite, se
     * infiere a partir de la fórmula (Classical/Arith según sea necesario).
     */
    imports?: string[];
    /** Default: 'tactic'. 'both' emite tactic + proofterm comentado. */
    emitMode?: CoqEmitMode;
    /** Default: true. Si true, agrega `auto` como tactic fallback. */
    useAuto?: boolean;
    /** Default: true. Si true, usa hints registrados (`auto with stdb`). */
    useHints?: boolean;
    /** Default: false. Si true, genera bloque `Hint Resolve ...`. */
    emitHints?: boolean;
}
/**
 * Heurística simple: si una variable aparece como argumento de un predicado
 * aritmético (`<`, `>`, `+`, `=`, etc.) la consideramos `nat`. Si aparece
 * en un predicado simbólico, la consideramos `Prop`. Default: `Type`.
 */
export declare function inferDependentSorts(formula: unknown): Map<string, string>;
/**
 * Convierte una fórmula ST en un tipo Coq, con cuantificadores tipados según
 * la inferencia dependiente. Caso por defecto: Prop.
 */
export declare function formulaToCoqType(formula: unknown): string;
export type TacticStrategy = 'auto' | 'tauto' | 'firstorder' | 'intuition' | 'lia' | 'omega' | 'reflexivity' | 'admit' | 'custom';
/**
 * Elige la mejor tactic automática según las features de la fórmula.
 * Reglas (ordenadas):
 *   1. equality syntactically idéntica (a = a) → reflexivity.
 *   2. aritmética puramente lineal (<, >, +, -, =, lia) → lia.
 *   3. cuantificadores de primer orden con predicados → firstorder.
 *   4. propositional clásico con ∨ + ¬ → tauto.
 *   5. propositional con implicaciones encadenadas → intuition.
 *   6. fallback → auto.
 */
export declare function chooseStrategy(formula: unknown): TacticStrategy;
/**
 * Genera un proof term (lambda) directo desde un Proof object.
 * Soporta patrones básicos: identidad, MP, conjunción/disyunción intro-elim.
 * Para casos no manejados devuelve un placeholder con TODO.
 */
export declare function ndProofToProofTerm(proof: unknown): string;
/**
 * Genera líneas `Hint Resolve` / `Hint Rewrite` para una base `stdb`.
 * - Axiomas con head implicación → `Hint Resolve`.
 * - Igualdades universales → `Hint Rewrite`.
 * - Theorems "obvios" (identidad, P→P) también van como Hint Resolve.
 */
export declare function generateHints(axioms: unknown[], theorems: unknown[]): string[];
/**
 * Exporta una fórmula ST a Coq como módulo V2 con tactic strategy automática.
 */
export declare function exportToCoqV2(formula: unknown, opts?: CoqV2ExportOptions): string;
/**
 * Exporta un Proof ST a Coq como módulo V2, derivando tactics desde steps
 * y, opcionalmente, un proof term reconstruido.
 */
export declare function exportProofToCoqV2(proof: unknown, opts?: CoqV2ExportOptions): string;
/**
 * Exporta una teoría completa: axiomas + theorems con hints derivados.
 */
export declare function exportTheoryToCoqV2(axioms: unknown[], theorems: unknown[], opts?: CoqV2ExportOptions): string;
//# sourceMappingURL=index.d.ts.map