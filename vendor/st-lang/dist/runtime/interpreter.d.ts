/**
 * ST Runtime — Intérprete de scripts .st
 */
import { Theory, ExecutionOutput, LogicProfile, TextLayerState, Formula } from '../types';
import '../logic/profiles';
/**
 * Scope de una teoría (OOP): encapsula axiomas, teoremas, let-bindings y descripciones
 */
interface TheoryScope {
    name: string;
    parent?: string;
    letBindings: Map<string, Formula>;
    letDescriptions: Map<string, string>;
    axioms: Map<string, Formula>;
    theorems: Map<string, Formula>;
    /** Miembros privados — no accesibles desde fuera via dot notation */
    privateMembers: Set<string>;
}
export declare class Interpreter {
    private theory;
    private profile;
    private textLayer;
    private diagnostics;
    private results;
    private stdoutLines;
    private letBindings;
    private letDescriptions;
    private theories;
    /** Plantillas de teorías (clases) */
    private theoryTemplates;
    /** Nombre de la teoría actual (si estamos dentro de una) */
    private currentTheoryName;
    /** Funciones declaradas */
    private functions;
    /** Señal de return activa (para salir de funciones) */
    private returnSignal;
    private returnValue;
    /** Modo importación: solo registrar exports */
    private isImporting;
    /** Elementos exportados por el archivo actual */
    private exportedBindings;
    private exportedAxioms;
    private exportedTheorems;
    private exportedFunctions;
    private exportedTheories;
    /** Profundidad de llamadas a funciones (anti-recursión infinita) */
    private callDepth;
    private currentBindingFrame;
    private runtimeStepCount;
    private runtimeCallCount;
    /** Cache de resolución: fórmula original → fórmula resuelta (invalidado al cambiar bindings) */
    private resolveCache;
    private resolveCacheGeneration;
    /** Memoización automática para funciones con argumentos numéricos (fibonacci, factorial, etc.) */
    private fnMemoCache;
    private static readonly MEMO_CACHE_MAX;
    /** v3: Formal definitions (define Name(params?) := body) */
    private definitions;
    /** v3: Bibliographic sources */
    private sources;
    constructor();
    /** Registra funciones nativas (Built-ins) para metaprogramación e interactividad */
    private registerBuiltins;
    private createEmptyTheory;
    private importedFiles;
    private activeImports;
    reset(): void;
    /** Serializa una fórmula a una cadena para usar como clave de cache */
    private serializeFormulaKey;
    /** Genera la clave de memoización: nombre_función(arg1,arg2,...) */
    private memoKey;
    /** Verifica si una función es pura (sin side effects como print, set, check, axiom) */
    private isPureFn;
    private getRuntimeStepLimit;
    private getRuntimeCallLimit;
    private tickRuntimeStep;
    private isSafetyLimitMessage;
    private createBindingFrame;
    private findBindingOwner;
    private hasBinding;
    private getBinding;
    private requireFormulaBinding;
    private defineBinding;
    private setBinding;
    private captureBindingSnapshot;
    private restoreBindingSnapshot;
    private shouldEmitLocalBindings;
    execute(source: string, file?: string): ExecutionOutput;
    executeSingle(source: string): ExecutionOutput;
    private executeStatement;
    private executeStatementsIterative;
    private dispatchRuntimeStatement;
    private selectIfBody;
    private matchesRuntimeCondition;
    private getRuntimeTruthiness;
    private evaluateFormulaValue;
    private getDirectFunctionCall;
    private applyFunctionContinuation;
    private execExportDecl;
    private requireProfile;
    /**
     * Construye una teoría efímera que combina axiomas + teoremas + letBindings
     * SIN mutar la teoría persistente. Los letBindings quedan accesibles por nombre
     * como si fueran axiomas, pero solo para esta llamada a derive/prove.
     * Axiomas/teoremas reales tienen prioridad sobre letBindings con el mismo nombre.
     */
    private buildEphemeralTheory;
    /**
     * Sustituye recursivamente los átomos que coincidan con variables `let`
     * por sus fórmulas definidas. Detecta ciclos para evitar recursión infinita.
     * Soporta notación con punto: Theory.member resuelve desde el scope de la teoría.
     */
    private invalidateResolveCache;
    private resolveFormula;
    private resolveFormulaRecursive;
    private execLogicDecl;
    private execAxiomDecl;
    private execTheoremDecl;
    private execDeriveCmd;
    private execCheckValidCmd;
    private execCheckSatisfiableCmd;
    private execCheckEquivalentCmd;
    private execProveCmd;
    private execCountermodelCmd;
    private execTruthTableCmd;
    private execLetDecl;
    private execClaimDecl;
    private execSupportDecl;
    private execConfidenceDecl;
    private execContextDecl;
    private execRenderCmd;
    /** Render glossary in the specified format */
    private renderGlossary;
    /** Render full analysis document */
    private renderAnalysis;
    private execAnalyzeCmd;
    private execProofBlock;
    private execTheoryDecl;
    private instantiateTheory;
    private execPrintCmd;
    private execSetCmd;
    private execIfStmt;
    private execForStmt;
    private execWhileStmt;
    private execFnDecl;
    private execReturnStmt;
    private execDefineDecl;
    /** Detect circular definitions (A := ... A ...) */
    private checkCircularDefinition;
    /** Expand a definition by name with given arguments */
    private expandDefinition;
    /** Recursively substitute parameter names with actual argument formulas */
    private substituteParams;
    /** Expand all definitions in a formula (one level) */
    private expandDefinitionsInFormula;
    /** Try to fold a formula back into a definition reference */
    private foldFormula;
    private execUnfoldCmd;
    private execFoldCmd;
    private execSourceDecl;
    private execInterpretCmd;
    private execGlossaryCmd;
    private executeFnCall;
    private startFunctionFrame;
    private createFunctionFrame;
    private finishFunctionFrame;
    private discardFunctionFrameState;
    private replaceFunctionFrame;
    private nextRuntimeStatement;
    private executeFunctionInScope;
    private tryConstantFold;
    private executeBuiltin;
    private executeActionExpr;
    private requireActionFormula;
    private requireActionPremises;
    private bindCapturedAction;
    private createStringFormula;
    private createListFormula;
    private createAtomListFormula;
    private createNumberFormula;
    private createNumberListFormula;
    private createNestedNumberListFormula;
    private createStringListFormula;
    private createProofBindings;
    private isSuccessfulStatus;
    private collectValueAtoms;
    private execImportDecl;
    private execExplainCmd;
    private emit;
    private getVerbosity;
    private emitResult;
    private collectAtoms;
    private statusIcon;
    private formatTruthTable;
    getTheory(): Theory;
    getProfile(): LogicProfile | null;
    getTextLayer(): TextLayerState;
    getLetBindings(): Map<string, Formula>;
    getTheories(): Map<string, TheoryScope>;
}
export {};
//# sourceMappingURL=interpreter.d.ts.map