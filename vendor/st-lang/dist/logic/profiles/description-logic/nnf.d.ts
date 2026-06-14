import { DLConcept } from './types';
export declare function toNNF(c: DLConcept): DLConcept;
/**
 * Hash canónico de un concepto. Dos conceptos sintácticamente iguales
 * (módulo orden de hijos en and/or) producen el mismo hash.
 */
export declare function conceptHash(c: DLConcept): string;
export declare function conceptEqual(a: DLConcept, b: DLConcept): boolean;
/**
 * Render legible para tracing / mensajes.
 */
export declare function conceptToString(c: DLConcept): string;
//# sourceMappingURL=nnf.d.ts.map