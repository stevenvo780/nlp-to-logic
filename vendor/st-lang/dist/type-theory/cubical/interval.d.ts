import type { CubicalTerm } from './types';
export type IntervalValue = 0 | 1 | 'gen';
export declare function evalInterval(t: CubicalTerm, env?: Map<string, 0 | 1>): IntervalValue;
/**
 * Normaliza algebraicamente una expresión de intervalo aplicando las
 * leyes del retículo + involución. Si la expresión colapsa a un
 * extremo, retorna i0 o i1; en caso contrario reescribe lo posible.
 * No hace simplificaciones avanzadas (idempotencia, distributividad)
 * para mantener el módulo predecible.
 */
export declare function normalizeInterval(t: CubicalTerm): CubicalTerm;
//# sourceMappingURL=interval.d.ts.map