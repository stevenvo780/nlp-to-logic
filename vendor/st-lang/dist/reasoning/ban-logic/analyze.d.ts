import type { BANFormula, Protocol, ProtocolAnalysis } from './types';
export interface SaturateOptions {
    /** Máximo de iteraciones del punto fijo. Default: 200. */
    maxIterations?: number;
    /** Máximo de fórmulas nuevas a derivar. Default: 1024. */
    maxDerivations?: number;
}
/**
 * Aplica las reglas BAN al estado hasta punto fijo. Devuelve el estado
 * saturado y la lista de derivaciones nuevas (no incluye las iniciales).
 */
export declare function saturate(initial: ReadonlyArray<BANFormula>, opts?: SaturateOptions): {
    state: BANFormula[];
    trace: BANFormula[];
};
/**
 * Idealización mínima: cada step `from → to: msg` produce la
 * fórmula `to ◁ msg`. Asumimos que el receptor literalmente ve el
 * mensaje que se le envía.
 *
 * (BAN tradicional pide idealización manual para descartar texto
 * inseguro como nombres en claro; aquí preservamos todos los
 * subtérminos, que es la lectura conservadora.)
 */
export declare function idealize(p: Protocol): BANFormula[];
/**
 * Analiza un protocolo: parte de las assumptions + idealización,
 * satura, y verifica goals.
 */
export declare function analyzeProtocol(p: Protocol, opts?: SaturateOptions): ProtocolAnalysis;
//# sourceMappingURL=analyze.d.ts.map