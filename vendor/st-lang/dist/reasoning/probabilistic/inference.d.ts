import type { InferenceOptions, PProgram, PosteriorSummary } from './types';
/**
 * Enumera todas las trayectorias del programa, multiplicando la
 * probabilidad de cada decisión discreta y descartando ramas con
 * `observe(false)`. Soporta `factor(logW)` agregando exp(logW) al
 * peso. No soporta distribuciones continuas (uniform, normal) ni
 * `poisson` — lanza error si las encuentra.
 *
 * `maxStates` protege de explosión combinatoria: corta la
 * enumeración cuando el número de ramas pendientes la supera.
 */
export declare function enumerate<T>(program: PProgram<T>, maxStates?: number): PosteriorSummary<T>;
/**
 * Muestrea N trazas del prior; cualquier traza con `observe(false)`
 * o `factor(-Infinity)` se descarta y se reintenta.
 *
 * `factor(logW)` con `logW < 0` se trata como aceptación
 * probabilística: con prob `exp(logW)` la traza se acepta, en
 * caso contrario se descarta. `logW > 0` es legal pero raro;
 * se acepta siempre (rejection no maneja pesos > 1).
 */
export declare function rejectionSample<T>(program: PProgram<T>, opts?: InferenceOptions): PosteriorSummary<T>;
/**
 * Muestrea trazas del prior y acumula log-pesos de `observe`
 * (treated as -Infinity si false, 0 si true) y `factor`. Devuelve
 * los samples + sus pesos normalizados; el histograma y mean/std
 * reflejan estos pesos.
 *
 * Reporta ESS = (Σwᵢ)² / Σwᵢ² como diagnóstico de degeneración.
 */
export declare function importanceSample<T>(program: PProgram<T>, opts?: InferenceOptions): PosteriorSummary<T>;
/**
 * MCMC Metropolis-Hastings sobre el espacio de trazas del programa.
 *
 * Convenciones:
 *   - `burnIn` itera sin contar (default 1000).
 *   - `thin` toma 1 de cada N (default 1).
 *   - Single-site: en cada iteración, re-muestrea UN sample site
 *     (elegido uniforme) y re-ejecuta. Si el número de sample sites
 *     cambia entre trazas, igual funciona (re-ejecutamos forzando
 *     el valor anterior en los sites que coinciden).
 *   - Reporta `acceptanceRate` para diagnóstico.
 */
export declare function metropolisHastings<T>(program: PProgram<T>, opts?: InferenceOptions): PosteriorSummary<T>;
//# sourceMappingURL=inference.d.ts.map