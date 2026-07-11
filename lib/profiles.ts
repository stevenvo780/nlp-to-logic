/**
 * profiles.ts — Constantes y helpers SEGUROS PARA EL CLIENTE.
 *
 * Este modulo NO importa el motor ST ni autologic. Solo contiene metadatos
 * (lista de perfiles, etiquetas de estado) usados tanto por el componente de
 * cliente como por el servidor. Mantener separado del pipeline evita que el
 * motor (codigo Node-only) entre en el bundle del navegador.
 */

/** Mismo union de perfiles que expone autologic, replicado como string union
 * para no tener que importar la libreria desde el cliente. */
export type LogicProfileId =
  | 'classical.propositional'
  | 'classical.first_order'
  | 'modal.k'
  | 'deontic.standard'
  | 'epistemic.s5'
  | 'intuitionistic.propositional'
  | 'temporal.ltl'
  | 'paraconsistent.belnap'
  | 'aristotelian.syllogistic'
  | 'probabilistic.basic'
  | 'arithmetic';

export const PROFILES: { id: LogicProfileId; label: string; hint: string }[] = [
  { id: 'classical.propositional', label: 'Proposicional clásica', hint: '→  &  |  !  ↔' },
  { id: 'classical.first_order', label: 'Primer orden', hint: '∀  ∃  predicados' },
  { id: 'modal.k', label: 'Modal K', hint: '□  ◇' },
  { id: 'deontic.standard', label: 'Deóntica', hint: 'O (obligación)  P (permisión)' },
  { id: 'epistemic.s5', label: 'Epistémica S5', hint: 'K (conocimiento)' },
  { id: 'intuitionistic.propositional', label: 'Intuicionista', hint: 'sin tercero excluido' },
  { id: 'temporal.ltl', label: 'Temporal LTL', hint: 'X  U  G  F' },
  { id: 'paraconsistent.belnap', label: 'Paraconsistente Belnap', hint: '4 valores' },
  { id: 'aristotelian.syllogistic', label: 'Silogística aristotélica', hint: 'todo / algún / ningún' },
  { id: 'probabilistic.basic', label: 'Probabilística', hint: 'P(·) ∈ [0,1]' },
  { id: 'arithmetic', label: 'Aritmética', hint: '+  *  =  <' },
];

const STATUS_LABEL: Record<string, string> = {
  provable: 'DERIVABLE / VÁLIDO',
  valid: 'VÁLIDO (tautología)',
  derivable: 'DERIVABLE',
  satisfiable: 'SATISFACIBLE',
  unsatisfiable: 'INSATISFACIBLE',
  refutable: 'REFUTABLE (no se sostiene)',
  invalid: 'INVÁLIDO (hay contramodelo)',
  unprovable: 'NO DEMOSTRABLE',
  underivable: 'NO DERIVABLE',
  unknown: 'INDETERMINADO',
  equivalent: 'EQUIVALENTE',
};

export function statusLabel(status: string): string {
  return STATUS_LABEL[status.toLowerCase()] ?? status;
}

/** true si el status representa una afirmacion logica que SE sostiene. */
export function statusHolds(status: string): boolean {
  const s = status.toLowerCase();
  return ['provable', 'valid', 'derivable', 'satisfiable', 'equivalent'].includes(s);
}

/** Forma serializable del resultado del pipeline (compartida cliente/servidor). */
export interface PipelineResult {
  ok: boolean;
  stCode: string;
  execution: {
    ok: boolean;
    exitCode: number;
    stdout: string;
    stderr: string;
    statuses: string[];
    results: { kind: string; status: string; detail?: string }[];
  };
  detectedPatterns: string[];
  atoms: { id: string; text: string }[];
  diagnostics: { severity: string; message: string }[];
  durationMs: number;
}
