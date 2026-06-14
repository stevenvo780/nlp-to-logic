/**
 * ST Parallel Profile Pool — ejecuta múltiples perfiles lógicos en paralelo.
 *
 * Usa Node.js worker_threads cuando está disponible; si no (browser o
 * entorno sin soporte), cae a evaluación secuencial con Promise.resolve().
 */
import type { Formula, RunResult } from '../../types';
import '../../logic/profiles';
export type ProfileName = string;
export interface ParallelEvalOptions {
    profiles: ProfileName[];
    poolSize?: number;
    timeoutMs?: number;
    shareWorkPool?: boolean;
}
export interface ParallelEvalResult {
    perProfile: Record<ProfileName, RunResult | {
        error: string;
    }>;
    totalMs: number;
    speedup: number;
}
/**
 * Evalúa una fórmula lógica con múltiples perfiles en paralelo.
 *
 * Si worker_threads no está disponible (browser), ejecuta secuencialmente.
 */
export declare function evalParallel(formula: Formula, opts: ParallelEvalOptions): Promise<ParallelEvalResult>;
/**
 * Cierra todos los workers del pool compartido.
 * Llamar al final del proceso si shareWorkPool=true.
 */
export declare function shutdownPool(): Promise<void>;
//# sourceMappingURL=index.d.ts.map