/**
 * Autologic — Clase facade con estado (para sesiones)
 *
 * Envuelve formalize() con configuración persistente y
 * permite agregar marcadores personalizados.
 */
import type { FormalizeOptions, FormalizationResult, AutologicConfig, Language, MarkerDefinition, DiscourseAnalysis } from './types';
/**
 * Clase principal con estado para sesiones de formalización.
 *
 * @example
 * ```ts
 * const al = new Autologic({ language: 'es', defaultProfile: 'classical.propositional' });
 * const r1 = al.formalize("Si llueve, la calle se moja.");
 * const analysis = al.analyze("Si P entonces Q, pero no Q, luego no P.");
 * ```
 */
export declare class Autologic {
    private config;
    private customMarkers;
    private history;
    constructor(config?: AutologicConfig);
    /**
     * Formaliza texto natural a código ST.
     */
    formalize(text: string, options?: FormalizeOptions): FormalizationResult;
    /**
     * Solo analiza sin generar ST. Retorna el análisis discursivo.
     */
    analyze(text: string, language?: Language): DiscourseAnalysis;
    /**
     * Valida código ST existente.
     */
    validate(stCode: string): {
        ok: boolean;
        errors: string[];
    };
    /**
     * Agrega un marcador discursivo personalizado.
     */
    addMarker(marker: {
        text: string;
        role: MarkerDefinition['role'];
        language?: Language;
    }): void;
    /**
     * Obtiene el historial de formalizaciones.
     */
    getHistory(): FormalizationResult[];
    /**
     * Limpia el historial.
     */
    clearHistory(): void;
    /**
     * Obtiene la configuración actual.
     */
    getConfig(): Required<AutologicConfig>;
    /**
     * Actualiza la configuración.
     */
    setConfig(config: Partial<AutologicConfig>): void;
}
//# sourceMappingURL=autologic.d.ts.map