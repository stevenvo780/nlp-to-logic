import type { ProofState, RankedTactic, RankingModel, TacticRecord } from './types';
/**
 * Inicializa modelo vacío con feature names canónicos.
 * Los pesos arrancan en 0 — equivalente a "uniform prior".
 */
export declare function createEmptyModel(): RankingModel;
interface TrainOptions {
    /** Pasadas sobre el dataset. Default: 50. */
    epochs?: number;
    /** Learning rate. Default: 0.1. */
    learningRate?: number;
    /** L2 regularization. Default: 0.001 — leve, evita pesos enormes. */
    l2?: number;
}
/**
 * Entrena un `RankingModel` via logistic regression mini-batch full-epoch.
 *
 * Para cada record: target = `successful ? 1 : 0`, ponderado por
 * `1 / (1 + proofDepthRemaining ?? 0)` cuando está presente — tácticas
 * que dejan menos profundidad pesan más.
 *
 * Las features son las de `extractFeatures(record.beforeState)`.
 */
export declare function trainModel(records: TacticRecord[], opts?: TrainOptions): RankingModel;
/**
 * Rankea candidatas por score descendente. Las tácticas sin pesos
 * aprendidos reciben score 0 (bias 0 + features × 0) y quedan al
 * final establemente (sort estable por index).
 */
export declare function rankTactics(state: ProofState, model: RankingModel, candidates: string[]): RankedTactic[];
/**
 * Update online: 1 paso de gradient descent con el record nuevo.
 * Devuelve un modelo nuevo (no mutación in-place del Map original).
 *
 * Útil cuando el agente IA acaba de probar una táctica y queremos
 * incorporar la señal sin re-entrenar desde cero.
 */
export declare function updateModel(model: RankingModel, record: TacticRecord, learningRate?: number): RankingModel;
/** Probabilidad calibrada [0,1] de éxito según el modelo. */
export declare function tacticSuccessProbability(state: ProofState, model: RankingModel, tactic: string): number;
export {};
//# sourceMappingURL=model.d.ts.map