import { Formula, TableauTraceEntry } from '../../../types';
export interface LabeledNode {
    readonly formula: Formula;
    readonly world: string;
}
export interface GammaWatcher {
    readonly innerFormula: Formula;
    readonly sourceWorld: string;
}
export interface Branch {
    literals: LabeledNode[];
    pending: LabeledNode[];
    accessibility: Map<string, Set<string>>;
    nextWorlds: Map<string, string>;
    worlds: Set<string>;
    gammaWatchers: GammaWatcher[];
    processed: Set<string>;
    worldCounter: number;
    branchId: string;
    trace: TableauTraceEntry[];
}
/**
 * FrameRules parametriza el comportamiento del tableau según
 * las propiedades de la relación de accesibilidad.
 */
export interface FrameRules {
    /**
     * Gamma (□φ): ¿en qué mundos se instancia inner?
     * Recibe el mundo fuente, branch actual, y devuelve los mundos target.
     */
    gammaTargets(sourceWorld: string, branch: Branch): string[];
    /**
     * Delta (◇φ): crea un mundo nuevo. ¿Qué gamma-watchers se instancian?
     * Recibe el mundo fuente, nuevo mundo, y branch.
     * Devuelve los gamma-watchers que deben instanciarse en newWorld.
     */
    deltaGammaWatchers(sourceWorld: string, newWorld: string, branch: Branch): GammaWatcher[];
    /**
     * Hook opcional post-saturación: ¿forzar creación de mundos?
     * Ej: serialidad en KD, reflexividad en T.
     * Devuelve true si se agregaron nodos (continuar expansión).
     */
    enforceFrameConditions?(branch: Branch): boolean;
    /**
     * Si está activo, X(φ) reutiliza un único sucesor inmediato por mundo.
     * Esto evita tratar `next` como un diamante modal arbitrario.
     */
    deterministicNext?: boolean;
}
/** K: sin restricciones — gamma solo a accesibles, delta solo instancia watchers del source */
export declare const FRAME_K: FrameRules;
/** KD: K + serialidad (todo mundo tiene al menos un sucesor) */
export declare const FRAME_KD: FrameRules;
/** S5: relación universal — gamma se instancia en TODOS los mundos */
export declare const FRAME_S5: FrameRules;
/** T (reflexivo): K + reflexividad */
export declare const FRAME_T: FrameRules;
/** S4: reflexivo + transitivo */
export declare const FRAME_S4: FrameRules;
export declare function formulaEqual(a: Formula, b: Formula): boolean;
export declare function formulaHash(f: Formula): string;
export declare function eliminateConnectives(f: Formula): Formula;
export declare function fullNNF(f: Formula): Formula;
export interface ExpandResult {
    closed: boolean;
    openBranch?: Branch;
    trace: TableauTraceEntry[];
}
export declare function makeBranch(nodes: LabeledNode[]): Branch;
export declare function checkTableau(formula: Formula, rules: FrameRules, isValidityCheck: boolean): ExpandResult;
export declare function isValid(formula: Formula, rules: FrameRules): boolean;
export declare function isSatisfiable(formula: Formula, rules: FrameRules): boolean;
//# sourceMappingURL=tableau-engine.d.ts.map