import { IntuitFormula, KripkeIntuitModel } from './types';
/**
 * API pública: si `formula` NO es válida intuicionistamente,
 * devuelve un modelo Kripke cuya raíz (w0) la refuta. Si es
 * válida (dentro de la cota explorada), devuelve `null`.
 *
 * El budget por defecto es la cota de filtración |sub(formula)|,
 * recortada al techo factible según el nº de átomos.
 */
export declare function kripkeCounterModel(formula: IntuitFormula, options?: {
    maxWorlds?: number;
}): KripkeIntuitModel | null;
/**
 * Helper: ¿la fórmula es válida intuicionistamente bajo modelos hasta
 * la cota de completitud (filtración por subfórmulas, recortada al techo
 * factible)? Útil en tests para cruzar con el prover. Si se pasa
 * `maxWorlds`, fija explícitamente la cota.
 */
export declare function isIPCValid(formula: IntuitFormula, maxWorlds?: number): boolean;
//# sourceMappingURL=kripke.d.ts.map