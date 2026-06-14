/**
 * Pool de notas pedagógicas contextuales para enriquecer los resultados del motor.
 * Cada operación/resultado tiene varias notas posibles; se elige una al azar.
 */
export type NoteContext = {
    op: 'satisfiable';
    sat: boolean;
} | {
    op: 'valid';
    valid: boolean;
} | {
    op: 'equivalent';
    equiv: boolean;
} | {
    op: 'derive';
    ok: boolean;
    steps?: number;
    rules?: string[];
} | {
    op: 'prove';
    ok: boolean;
} | {
    op: 'countermodel';
    found: boolean;
};
export declare function pickEducationalNote(ctx: NoteContext): string;
//# sourceMappingURL=educational-notes.d.ts.map