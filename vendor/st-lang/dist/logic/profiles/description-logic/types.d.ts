/** Variantes sintácticas de un concepto ALC. */
export type DLConceptKind = 'top' | 'bottom' | 'atomic' | 'not' | 'and' | 'or' | 'exists' | 'forall';
export interface DLConcept {
    kind: DLConceptKind;
    /** Atomic concept name (kind = 'atomic'). */
    name?: string;
    /** Single sub-concept (kind = 'not' / 'exists' / 'forall'). */
    arg?: DLConcept;
    /** n-ary children (kind = 'and' / 'or'). */
    args?: DLConcept[];
    /** Role name (kind = 'exists' / 'forall'). */
    role?: string;
}
/** Variantes de axioma ALC: subsunción, equivalencia y aserciones de instancia. */
export type DLAxiomKind = 'subsumes' | 'equivalent' | 'instance' | 'role-instance';
export interface DLAxiom {
    kind: DLAxiomKind;
    /**
     * - subsumes / equivalent: ambos lados son DLConcept (C ⊑ D, C ≡ D).
     * - instance:              left = individuo (string), right = DLConcept.
     * - role-instance:         left = individuo, right = individuo, role = nombre del rol.
     */
    left: DLConcept | string;
    right: DLConcept | string;
    /** Solo para role-instance. */
    role?: string;
}
export interface DLKnowledgeBase {
    /** Schema-level: subsumption / equivalence. */
    tbox: DLAxiom[];
    /** Instance assertions: instance + role-instance. */
    abox: DLAxiom[];
}
/** Concepto universal ⊤ (todo individuo lo satisface). */
export declare const TOP: DLConcept;
/** Concepto vacío ⊥ (ningún individuo lo satisface). */
export declare const BOTTOM: DLConcept;
/** Crea un concepto atómico con el nombre dado. */
export declare function atomic(name: string): DLConcept;
/** Negación de un concepto: ¬C. */
export declare function not(c: DLConcept): DLConcept;
/** Intersección de conceptos: C ⊓ D. Sin argumentos devuelve ⊤. */
export declare function and(...args: DLConcept[]): DLConcept;
/** Unión de conceptos: C ⊔ D. Sin argumentos devuelve ⊥. */
export declare function or(...args: DLConcept[]): DLConcept;
/** Restricción existencial: ∃role.C. */
export declare function exists(role: string, c: DLConcept): DLConcept;
/** Restricción de valor: ∀role.C. */
export declare function forall(role: string, c: DLConcept): DLConcept;
/** Axioma TBox de subsunción: left ⊑ right. */
export declare function subsumes(left: DLConcept, right: DLConcept): DLAxiom;
/** Axioma TBox de equivalencia: left ≡ right. */
export declare function equivalent(left: DLConcept, right: DLConcept): DLAxiom;
/** Aserción ABox: `individual` pertenece a `concept`. */
export declare function instance(individual: string, concept: DLConcept): DLAxiom;
/** Aserción de rol ABox: (from, to) ∈ role. */
export declare function roleInstance(from: string, role: string, to: string): DLAxiom;
/** Devuelve una base de conocimiento vacía (TBox y ABox vacíos). */
export declare function emptyKB(): DLKnowledgeBase;
//# sourceMappingURL=types.d.ts.map