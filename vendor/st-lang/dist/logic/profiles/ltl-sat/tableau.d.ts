import { LTLFormula } from './types';
/** Convierte una fórmula LTL a Negation Normal Form (NNF): negaciones empujadas hasta átomos. */
export declare function toNNF(f: LTLFormula): LTLFormula;
/**
 * Calcula la clausura de subfórmulas de `f` (incluyendo duales de F, G, U, R via X).
 * El conjunto resultado es el universo de fórmulas sobre el que se construyen los atoms.
 */
export declare function closure(f: LTLFormula): LTLFormula[];
/**
 * Subconjunto de la clausura localmente consistente con las reglas de tableau.
 * Cada `Atom` representa un estado posible del autómata de Büchi implícito.
 */
export interface Atom {
    id: number;
    /** Fórmulas presentes en este átomo (clave canónica → fórmula). */
    formulas: Map<string, LTLFormula>;
    /** Literales positivos presentes (para trazas legibles). */
    positiveLiterals: string[];
    /** Literales negativos presentes (para trazas legibles). */
    negativeLiterals: string[];
}
/**
 * Genera todos los atoms localmente consistentes a partir de la clausura dada.
 * Usa backtracking con poda de contradicciones átomo/¬átomo.
 * Límite de seguridad: 200 000 atoms para evitar explosión exponencial.
 */
export declare function enumerateAtoms(closureFormulas: LTLFormula[]): Atom[];
/**
 * Construye la relación de transición entre atoms.
 * A → B sii para toda Xφ ∈ A se cumple φ ∈ B.
 * @returns Mapa de id de atom origen a lista de ids de atoms destino.
 */
export declare function transitions(atoms: Atom[]): Map<number, number[]>;
/**
 * Eventualidad LTL que debe cumplirse dentro del lazo aceptante.
 * F ψ y φ U ψ son eventualidades; se satisfacen cuando ψ aparece en algún estado del ciclo.
 */
export interface Eventuality {
    /** Clave canónica de la eventualidad (F ψ o φ U ψ). */
    key: string;
    /** Clave de la fórmula testigo ψ que debe estar presente en el ciclo. */
    witnessFormulaKey: string;
}
/** Extrae todas las eventualidades (F ψ y φ U ψ) presentes en un atom. */
export declare function eventualitiesIn(atom: Atom): Eventuality[];
/** Describe un atom por sus literales: "p,¬q" o "∅" si está vacío. */
export declare function describeAtom(a: Atom): string;
/** Alias de `formulaToString` para uso en contextos de depuración del tableau. */
export declare function describeFormula(f: LTLFormula): string;
//# sourceMappingURL=tableau.d.ts.map