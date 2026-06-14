import { FrameAxiom, ModalFormula, TableauResult } from './types';
export interface TableauOptions {
    /** Máximo número de mundos a explorar. Default heurístico. */
    maxWorlds?: number;
}
/**
 * Construye un tableau extendido para `phi` bajo los axiomas
 * de frame `axioms`. Devuelve `sat` con un modelo si existe; en
 * caso contrario `closed=true`.
 */
export declare function tableauWithAxioms(phi: ModalFormula, axioms: FrameAxiom[], options?: TableauOptions): TableauResult;
//# sourceMappingURL=tableau.d.ts.map