import type { BDDNode, BDDStats } from './types';
export declare class BDDManager {
    numVars: number;
    private readonly TRUE;
    private readonly FALSE;
    private uniqueTable;
    private nextId;
    private reductions;
    private memoAnd;
    private memoOr;
    private memoXor;
    private memoIte;
    private memoNot;
    varOrder: number[];
    constructor(numVars: number);
    /**
     * Cambia el orden global de variables. Invalida memo caches porque
     * el orden afecta la estructura de los nodos. NO reordena nodos ya
     * construidos — si los reutilizas tras setVarOrder pueden quedar
     * inconsistentes; recomendado para sesiones nuevas.
     */
    setVarOrder(order: number[]): void;
    /** Posición de la variable v dentro del orden actual (0 = top). */
    private orderPos;
    /** Devuelve la variable "top" de un nodo o +∞ si es terminal. */
    private topVarPos;
    true_(): BDDNode;
    false_(): BDDNode;
    /**
     * Crea/recupera un nodo interno con reducción (R1) + (R2).
     */
    private makeNode;
    /** BDD de la variable i: nodo (i, FALSE, TRUE). */
    variable(i: number): BDDNode;
    /**
     * Negación: implementada como ITE(b, FALSE, TRUE).
     * Con memo dedicado para evitar recomputación.
     */
    not_(b: BDDNode): BDDNode;
    and_(a: BDDNode, b: BDDNode): BDDNode;
    or_(a: BDDNode, b: BDDNode): BDDNode;
    xor(a: BDDNode, b: BDDNode): BDDNode;
    /** A → B ≡ ¬A ∨ B */
    implies(a: BDDNode, b: BDDNode): BDDNode;
    /** A ↔ B ≡ ¬(A ⊕ B) */
    iff(a: BDDNode, b: BDDNode): BDDNode;
    /**
     * If-Then-Else canónico: ite(c, t, e).
     * Equivale a (c ∧ t) ∨ (¬c ∧ e). Implementado con descomposición
     * Shannon directa para mejor caché.
     */
    ite(cond: BDDNode, thenB: BDDNode, elseB: BDDNode): BDDNode;
    /**
     * Cofactor de b respecto a (variable v = val).
     * Si v no aparece o aparece más profundo, retorna b sin cambios.
     */
    private cofactor;
    /**
     * Apply algorithm de Bryant — combinador binario con memoization.
     * Maneja AND, OR, XOR (los más usados); el resto se deriva.
     */
    private applyOp;
    private memoFor;
    private applyTerminal;
    /** ∃v. b ≡ b[v:=0] ∨ b[v:=1] */
    exists(v: number, b: BDDNode): BDDNode;
    /** ∀v. b ≡ b[v:=0] ∧ b[v:=1] */
    forall(v: number, b: BDDNode): BDDNode;
    /**
     * Cuenta el número de asignaciones satisfactorias sobre `numVars`.
     * Usa bigint para soportar funciones con muchas variables.
     */
    satCount(b: BDDNode): bigint;
    /**
     * Conteo con "skip" de variables ausentes en la rama:
     * cada variable saltada multiplica por 2.
     */
    private satCountAt;
    isSatisfiable(b: BDDNode): boolean;
    isValid(b: BDDNode): boolean;
    /**
     * Equivalencia estructural. Como el manager canonicaliza, basta con
     * comparar identidad de referencias.
     */
    equivalent(a: BDDNode, b: BDDNode): boolean;
    /**
     * Evalúa b sobre una asignación `assignment[i] = valor de la var i`.
     */
    evaluate(b: BDDNode, assignment: boolean[]): boolean;
    /**
     * Construye un BDD desde CNF. Cada clausula es un array de literales
     * en la convención DIMACS:
     *   - literal i > 0  →  variable (i-1) positiva
     *   - literal i < 0  →  variable (-i-1) negada
     * El resultado es el AND de las disyunciones de cada clausula.
     *
     * Optimización: ordena clausulas por longitud creciente para que la
     * unidad de propagación temprana mantenga el BDD pequeño.
     */
    fromCNF(clauses: number[][]): BDDNode;
    /**
     * Construye un BDD desde una fórmula simbólica con sintaxis libre.
     * Soporta: `{ kind: 'var', index: number }`, `{ kind: 'true' }`,
     * `{ kind: 'false' }`, `{ kind: 'not', child }`,
     * `{ kind: 'and'|'or'|'xor'|'implies'|'iff', left, right }`,
     * `{ kind: 'ite', cond, then, else }`.
     *
     * Si llega algo no reconocido lanza error — el formato es estricto
     * para evitar `any` silenciosos.
     */
    fromFormula(formula: {
        kind: string;
        [k: string]: unknown;
    }): BDDNode;
    stats(): BDDStats;
    /**
     * Cuenta los nodos alcanzables desde `b` (sin contar terminales).
     * Útil para comparar tamaños bajo distintos órdenes de variables.
     */
    countReachable(b: BDDNode): number;
}
//# sourceMappingURL=manager.d.ts.map