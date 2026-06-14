export type DatalogTerm = string;
export interface DatalogAtom {
    predicate: string;
    args: DatalogTerm[];
}
export interface DatalogRule {
    head: DatalogAtom;
    body: DatalogAtom[];
}
export interface DatalogProgram {
    facts: DatalogAtom[];
    rules: DatalogRule[];
}
export interface Substitution {
    [variable: string]: DatalogTerm;
}
export interface EvaluationResult {
    facts: DatalogAtom[];
    iterations: number;
}
export interface StratifiedRule extends DatalogRule {
    negBody: DatalogAtom[];
}
/**
 * Una variable Datalog es un término cuyo primer carácter es una
 * letra mayúscula. Todo lo demás (minúsculas, dígitos, comillas)
 * cuenta como constante.
 */
export declare function isVariable(term: DatalogTerm): boolean;
/** Un átomo es ground sii ninguno de sus argumentos es variable. */
export declare function isGround(atom: DatalogAtom): boolean;
/**
 * Parsea un átomo de la forma `predicate(arg1, arg2, ...)`.
 * Devuelve null si la sintaxis es inválida.
 */
export declare function parseAtom(s: string): DatalogAtom | null;
/**
 * Parsea una regla `head :- body1, body2, ...` o un hecho `head`.
 * El punto final es opcional. Devuelve null si la sintaxis falla.
 */
export declare function parseRule(s: string): DatalogRule | null;
/**
 * Unificación de dos átomos. Devuelve la sustitución más general que
 * los unifica, o null si no son unificables.
 *
 * Reglas:
 *   - Predicados distintos o aridades distintas → fallo.
 *   - Variable vs término → bind (sin occurs check; Datalog no tiene
 *     functores compuestos así que occurs check no aplica).
 *   - Constante vs constante → match exacto.
 */
export declare function unifyAtoms(a: DatalogAtom, b: DatalogAtom): Substitution | null;
/**
 * Aplica una sustitución a un átomo, resolviendo cadenas vía walk.
 * Si una variable queda sin binding, se conserva tal cual.
 */
export declare function applySubstitution(atom: DatalogAtom, subst: Substitution): DatalogAtom;
/**
 * Evaluación bottom-up con la variante semi-naive: en cada iteración
 * sólo recomputamos sustituciones que involucran al menos un fact
 * nuevo del paso anterior. Para Datalog puro (sin negación) esto
 * computa el modelo mínimo de Herbrand en O(|reglas| · |facts|^aridad)
 * en el peor caso.
 *
 * Notas:
 *   - `opts.maxIterations` por defecto 1000. Datalog termina siempre,
 *     pero programas con muchos términos requieren un techo defensivo
 *     para no colgar tests.
 *   - Variables anónimas (no aparecen renombradas externamente) se
 *     reinstancian por regla en cada paso.
 */
export declare function evaluateBottomUp(p: DatalogProgram, opts?: {
    maxIterations?: number;
}): EvaluationResult;
/**
 * Devuelve todas las instancias ground del query derivables del
 * programa, evaluando top-down como SLD con memoización por átomo
 * (tabling). La memoización es esencial: SLD puro sobre programas
 * recursivos (ej. transitive closure) no terminaría.
 *
 * `maxDepth` limita la profundidad de resolución para evitar
 * explosión exponencial. Default 100.
 */
export declare function querySLD(p: DatalogProgram, query: DatalogAtom, maxDepth?: number): DatalogAtom[];
/**
 * Evalúa un programa con negación estratificada. En cada estrato
 * se ejecuta bottom-up con el set de facts acumulado, interpretando
 * los literales negados bajo CWA (closed world assumption): `¬p(t)`
 * es verdadero sii `p(t)` no está en el modelo del estrato previo.
 *
 * Si el programa no se puede estratificar, devuelve un resultado con
 * 0 iteraciones y solo los facts iniciales (mejor que arrojar).
 */
export declare function evaluateStratified(p: {
    facts: DatalogAtom[];
    rules: StratifiedRule[];
}): EvaluationResult;
/**
 * Magic sets: transforma un programa P y una consulta Q en un
 * programa P' tal que la evaluación bottom-up de P' computa sólo
 * los facts relevantes para Q, en vez del modelo mínimo completo.
 *
 * Implementación mínima pero funcional:
 *   - Introduce predicados `magic_<head>` con los args bound del query.
 *   - Reescribe cada regla para que su disparo dependa del magic seed
 *     correspondiente y propague seeds a literales recursivos.
 *
 * Para consultas con todos los args ground, devuelve la consulta
 * cerrada como seed inicial. Para args variables, devuelve el
 * programa original (no hay focus posible).
 */
export declare function magicSets(program: DatalogProgram, query: DatalogAtom): DatalogProgram;
/**
 * Programa canónico de clausura transitiva:
 *
 *   parent(alice, bob).
 *   parent(bob, carol).
 *   parent(carol, dave).
 *   ancestor(X, Y) :- parent(X, Y).
 *   ancestor(X, Y) :- parent(X, Z), ancestor(Z, Y).
 */
export declare function transitiveClosure(): DatalogProgram;
/**
 * Programa de alcanzabilidad en un grafo dirigido de 4 nodos:
 *
 *   edge(n1, n2). edge(n2, n3). edge(n3, n4). edge(n1, n3).
 *   reach(X, Y) :- edge(X, Y).
 *   reach(X, Y) :- edge(X, Z), reach(Z, Y).
 */
export declare function pathReachability(): DatalogProgram;
//# sourceMappingURL=index.d.ts.map