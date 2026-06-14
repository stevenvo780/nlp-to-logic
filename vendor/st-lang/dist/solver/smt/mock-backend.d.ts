import type { Formula } from '../../types';
import type { ConstDeclaration, SMTBackend, SMTModel, SMTResult, SMTSort } from './types';
/**
 * MockSMTBackend resuelve un subconjunto del SMT-LIB v2 sin solver externo:
 *  - constantes booleanas con asserts directos (P, ¬P, P→P, P∧¬P)
 *  - lineales triviales en una sola variable (x > c, x < c, x = c)
 *  - combinaciones con `and` / `or` / `not` recursivas
 *
 * No pretende ser completo. Devuelve `unknown` cuando no sabe.
 */
export declare class MockSMTBackend implements SMTBackend {
    readonly name = "mock";
    private scopes;
    private lastModel;
    reset(): void;
    push(): void;
    pop(levels?: number): void;
    declareConst(name: string, sort: SMTSort): void;
    assertFormula(smtlib: string): void;
    /** Versión interna (no parte del contrato público) para inyectar fórmula AST. */
    assertAst(formula: Formula, smtlib?: string): void;
    /** Versión interna para inyectar declaraciones detectadas por el serializer. */
    declareFromInference(decls: ConstDeclaration[]): void;
    checkSat(): SMTResult;
    getModel(): SMTModel | undefined;
    getUnsatCore(): string[];
    private currentScope;
    private collectAssertions;
}
//# sourceMappingURL=mock-backend.d.ts.map