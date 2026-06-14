import { Formula } from '../../../types';
/**
 * Reescribe la formula al nucleo {atom, true, false, not, and, or, implies}
 * preservando las locaciones. Las formulas no proposicionales se dejan tal
 * cual: el prover las tratara como atomicas y normalmente no podra cerrar
 * la prueba salvo coincidencia sintactica exacta.
 */
export declare function normalizeForG3(f: Formula): Formula;
/**
 * Canoniza una formula a una representacion textual estable que ignora
 * `source` y normaliza orden interno donde aplica. Sirve como clave para
 * comparar formulas en multisets.
 */
export declare function formulaKey(f: Formula): string;
//# sourceMappingURL=normalize.d.ts.map