import { LogicNode } from '../formula/ast';
/**
 * Escudo Matemático. Detecta y extrae ecuaciones matemáticas explícitas
 * o expresadas en lenguaje natural estructurado ("sumas", "cuadrado de").
 */
export declare function extractMath(text: string): {
    original: string;
    shieldedText: string;
    nodes: Map<string, LogicNode>;
};
//# sourceMappingURL=math-parser.d.ts.map