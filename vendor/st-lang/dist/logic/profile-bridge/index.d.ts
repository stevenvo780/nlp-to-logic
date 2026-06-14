import type { Formula } from '../../types';
import type { LTLFormula } from '../profiles/ltl-sat/types';
import type { CTLFormula } from '../profiles/ctl/types';
export type Profile = 'classical' | 'intuitionistic' | 'S4' | 'LTL' | 'CTL' | 'fuzzy';
export interface GenericFormula {
    profile: Profile;
    ast: unknown;
}
export type Validity = 'preserved' | 'one-way' | 'partial';
export interface Translation {
    source: Profile;
    target: Profile;
    translate(formula: unknown): unknown;
    validity: Validity;
}
/** Aplica la traducción ¬¬ de Glivenko recursivamente.
 *
 * Reglas (Glivenko 1929):
 *   atom p         → ¬¬p
 *   ¬φ             → ¬¬(¬φ')        = ¬φ'     (¬¬¬ ≡ ¬)
 *   φ ∧ ψ          → ¬¬(φ' ∧ ψ')
 *   φ ∨ ψ          → ¬¬(φ' ∨ ψ')
 *   φ → ψ          → ¬¬(φ' → ψ')
 *   φ ↔ ψ          → ¬¬(φ' ↔ ψ')
 *   ⊤              → ⊤
 *   ⊥              → ⊥
 *
 * Resultado: clásicamente válido si y solo si el original lo es en IPC.
 */
export declare function glivenkoTranslation(intuitFormula: unknown): Formula;
/** Aplica la traducción de Gödel-McKinsey-Tarski: clasical → S4.
 *
 * Reglas (Gödel 1933):
 *   atom p         → □p
 *   ¬φ             → □¬φ'
 *   φ ∧ ψ          → φ' ∧ ψ'
 *   φ ∨ ψ          → φ' ∨ ψ'
 *   φ → ψ          → □(φ' → ψ')
 *   φ ↔ ψ          → □(φ' ↔ ψ')
 *   ⊤              → ⊤
 *   ⊥              → ⊥
 *
 * Corrección: φ es tautología clásica sii godelTranslation(φ) es
 * tautología S4 (Gödel 1933, McKinsey-Tarski 1948).
 */
export declare function godelTranslation(classicalFormula: unknown): Formula;
export declare function ltlToCTL(ltlFormula: unknown): CTLFormula;
export declare function ctlToLTL(ctlFormula: unknown): LTLFormula;
export declare const TRANSLATIONS: Translation[];
/**
 * Encuentra la ruta más corta desde `from` hasta `to` en el grafo
 * de traducciones disponibles (BFS).
 *
 * Devuelve la secuencia de perfiles [from, ..., to] o null si no hay ruta.
 */
export declare function findTranslationPath(from: Profile, to: Profile): Profile[] | null;
/**
 * Traduce una fórmula genérica al perfil `target` siguiendo el camino
 * de traducciones más corto disponible.
 *
 * Devuelve null si no existe ruta desde `formula.profile` hasta `target`.
 */
export declare function translateFormula(formula: GenericFormula, target: Profile): GenericFormula | null;
//# sourceMappingURL=index.d.ts.map