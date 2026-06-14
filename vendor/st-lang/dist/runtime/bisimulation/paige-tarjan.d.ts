import type { LTS, BisimulationResult } from './types';
/**
 * Particiona el LTS según bisimulación fuerte usando Paige-Tarjan.
 * Devuelve la partición canónica donde dos estados están en el mismo bloque
 * sii son fuertemente bisimilares.
 */
export declare function paigeTarjan(lts: LTS): BisimulationResult;
//# sourceMappingURL=paige-tarjan.d.ts.map