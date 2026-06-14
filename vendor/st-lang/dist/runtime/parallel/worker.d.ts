/**
 * ST Parallel Profile Worker — ejecutado en un hilo separado (worker_threads).
 *
 * Recibe un WorkerTask con la fórmula serializada y el nombre del perfil,
 * evalúa checkValid() y devuelve WorkerResponse al hilo principal.
 */
import type { Formula, RunResult } from '../../types';
import '../../logic/profiles';
export interface WorkerTask {
    profileName: string;
    formula: Formula;
    timeoutMs: number;
    workerId: number;
}
export interface WorkerResponse {
    workerId: number;
    profileName: string;
    result: RunResult | {
        error: string;
    };
}
//# sourceMappingURL=worker.d.ts.map