"use strict";
/**
 * ST Parallel Profile Worker — ejecutado en un hilo separado (worker_threads).
 *
 * Recibe un WorkerTask con la fórmula serializada y el nombre del perfil,
 * evalúa checkValid() y devuelve WorkerResponse al hilo principal.
 */
Object.defineProperty(exports, "__esModule", { value: true });
// Importar en el contexto del worker (Node.js worker_threads)
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { parentPort } = require('worker_threads');
// Registrar perfiles en el contexto del worker
require("../../logic/profiles");
const interface_1 = require("../../logic/profiles/interface");
if (parentPort) {
    parentPort.on('message', (task) => {
        const response = {
            workerId: task.workerId,
            profileName: task.profileName,
            result: runProfile(task),
        };
        parentPort.postMessage(response);
    });
}
function runProfile(task) {
    try {
        const profile = interface_1.registry.get(task.profileName);
        if (!profile) {
            return { error: `Perfil desconocido: "${task.profileName}"` };
        }
        const deadline = Date.now() + task.timeoutMs;
        const result = profile.checkValid(task.formula);
        if (Date.now() > deadline) {
            return { error: `Timeout: evaluación superó ${task.timeoutMs}ms` };
        }
        return result;
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        return { error: msg };
    }
}
//# sourceMappingURL=worker.js.map