import { Formula } from '../types';
import { LogicProfile } from '../logic/profiles/interface';
/** Información sobre una falacia detectada. */
export interface FallacyInfo {
    /** Nombre de la falacia (español). */
    name: string;
    /** Descripción pedagógica breve. */
    description: string;
    /** Patrón lógico asociado (notación Unicode). */
    pattern: string;
}
/**
 * Ejecuta todos los detectores de falacias sobre un argumento.
 *
 * @param premises  Lista de fórmulas-premisa.
 * @param conclusion Fórmula-conclusión.
 * @param profile   Perfil lógico activo (para contexto futuro).
 * @returns Lista de falacias detectadas (vacía si el argumento parece correcto).
 */
export declare function detectFallacies(premises: Formula[], conclusion: Formula, profile: LogicProfile): FallacyInfo[];
//# sourceMappingURL=fallacies.d.ts.map