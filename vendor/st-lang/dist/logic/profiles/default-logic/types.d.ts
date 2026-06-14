export interface DefaultRule {
    id: string;
    /** Literal que debe estar en las creencias para que el default sea aplicable. */
    prerequisite: string;
    /** Cada literal debe ser consistente con las creencias (¬β no debe estar). */
    justifications: string[];
    /** Literal que se añade a las creencias cuando el default se aplica. */
    consequent: string;
}
export interface DefaultTheory {
    /** Hard facts: siempre creídos, base de toda extensión. */
    facts: string[];
    defaults: DefaultRule[];
}
export interface Extension {
    /** Cierre de creencias (facts + consequents aplicados). */
    formulas: Set<string>;
    /** IDs de los defaults aplicados en orden de aplicación. */
    appliedDefaults: string[];
}
export interface ComputeOptions {
    /** Tope de extensiones a enumerar (evita explosión combinatoria). */
    maxExtensions?: number;
    /** Tope de defaults considerados (evita teorías malformadas). */
    maxDefaults?: number;
}
export declare const DEFAULT_MAX_EXTENSIONS = 64;
export declare const DEFAULT_MAX_DEFAULTS = 64;
//# sourceMappingURL=types.d.ts.map