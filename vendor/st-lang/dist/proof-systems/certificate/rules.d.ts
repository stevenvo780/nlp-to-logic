import type { CertRuleChecker } from './types';
/**
 * Tabla de reglas estándar. El verificador busca primero en esta tabla
 * (o en una tabla custom pasada como parámetro). Si la regla no
 * existe, registra un error pero no aborta para listar todos.
 */
export declare const STANDARD_RULES: Map<string, CertRuleChecker>;
//# sourceMappingURL=rules.d.ts.map