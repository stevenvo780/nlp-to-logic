import { Formula } from '../types';
/**
 * Motor de Internado de Fórmulas (Hash-Consing)
 * Asegura que fórmulas idénticas compartan la misma instancia en memoria.
 */
export declare class FormulaFactory {
    private static cache;
    /**
     * Crea o recupera una instancia única de una fórmula.
     */
    static create(f: Formula): Formula;
    /**
     * Genera un hash único basado únicamente en la estructura de la fórmula.
     * Ignora metadatos como 'source' o 'id'.
     */
    private static hash;
    /**
     * Limpia la caché de fórmulas (útil para liberar RAM entre ejecuciones pesadas).
     */
    static clear(): void;
    /**
     * Devuelve el número de fórmulas únicas en memoria.
     */
    static size(): number;
}
//# sourceMappingURL=formula-factory.d.ts.map