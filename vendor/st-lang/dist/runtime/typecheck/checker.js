"use strict";
// ============================================================
// ST TypeChecker — Validación estática con sugerencias humanas
// ============================================================
//
// TypeChecker implementa BaseASTVisitor<TypeError[]> y recorre
// el AST emitiendo errores antes de evaluar. El caller decide
// si abortar o continuar (no bloquea evaluate por defecto).
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeChecker = void 0;
exports.typeCheck = typeCheck;
const visitor_1 = require("../../ast/visitor");
const types_1 = require("./types");
const levenshtein_1 = require("./levenshtein");
function mkScope(parent) {
    return {
        declared: new Map(parent?.declared),
        predicates: new Map(parent?.predicates),
        functions: new Map(parent?.functions),
        insideFn: parent?.insideFn ?? false,
        imports: parent ? [...parent.imports] : [],
    };
}
// ── Helper: location robusta ──────────────────────────────────
function loc(node) {
    return node.source ?? { line: 0, column: 0 };
}
// ── TypeChecker ───────────────────────────────────────────────
class TypeChecker extends visitor_1.BaseASTVisitor {
    profile;
    scope;
    /** Axioms y teoremas declarados (nombres) — para duplicados */
    axiomNames = new Map();
    theoremNames = new Map();
    /** Imports vistos en este programa (para TC007) */
    importsSeen = [];
    /** Nombre del archivo actual */
    file;
    constructor(profile = '', file = '<unknown>') {
        super();
        this.profile = profile;
        this.file = file;
        this.scope = mkScope();
    }
    defaultResult(_node) {
        return [];
    }
    // ── Utilidades privadas ───────────────────────────────────
    err(code, severity, message, location, suggestion) {
        return { code, severity, message, location, suggestion };
    }
    /** Todos los nombres declarados en el scope actual (para sugerencias) */
    allDeclaredNames() {
        return this.scope.declared.keys();
    }
    /** Comprueba si el perfil actual es modal */
    isModalProfile() {
        if (!this.profile)
            return false;
        return types_1.MODAL_PROFILES.has(this.profile);
    }
    /** Comprueba si el perfil actual es temporal */
    isTemporalProfile() {
        if (!this.profile)
            return false;
        return types_1.TEMPORAL_PROFILES.has(this.profile);
    }
    /** Comprueba si el perfil actual soporta FO (cuantificadores) */
    isFirstOrderProfile() {
        if (!this.profile)
            return false;
        return types_1.FIRST_ORDER_PROFILES.has(this.profile);
    }
    /**
     * Recorre una Formula recursivamente buscando errores.
     * Devuelve lista de errores encontrados.
     */
    checkFormula(f, location) {
        const errors = [];
        switch (f.kind) {
            // TC004: Modalidades en perfil no-modal
            case 'modal_necessity':
            case 'modal_possibility': {
                if (!this.isModalProfile() && this.profile !== '') {
                    const sym = f.kind === 'modal_necessity' ? '□' : '◇';
                    errors.push(this.err('TC004', 'error', `Modalidad '${sym}' usada en perfil no-modal '${this.profile}'. ` +
                        `Los operadores modales solo están disponibles en perfiles como modal.k, epistemic.s5, deontic.standard.`, f.source ?? location, `Cambia el perfil a 'modal.k' o elimina el operador '${sym}'.`));
                }
                break;
            }
            // TC004b: Temporales en perfil no-temporal
            case 'temporal_next':
            case 'temporal_until': {
                if (!this.isTemporalProfile() && this.profile !== '') {
                    const sym = f.kind === 'temporal_next' ? 'X' : 'U';
                    errors.push(this.err('TC004', 'error', `Operador temporal '${sym}' usado en perfil no-temporal '${this.profile}'. ` +
                        `Los operadores temporales solo están disponibles en 'temporal.ltl'.`, f.source ?? location, `Cambia el perfil a 'temporal.ltl' o elimina el operador.`));
                }
                break;
            }
            // TC001 + TC002: Predicados — identidad y aridad
            case 'predicate': {
                if (f.name) {
                    const arity = (f.params ?? f.terms ?? []).length;
                    const knownArity = this.scope.predicates.get(f.name);
                    if (knownArity !== undefined && knownArity !== arity) {
                        // TC002: arity mismatch
                        errors.push(this.err('TC002', 'error', `Aridad incorrecta para predicado '${f.name}': se esperaban ${knownArity} argumentos, se recibieron ${arity}.`, f.source ?? location));
                    }
                    // TC001 no aplica a nivel de predicado atómico (depende de dominio FO),
                    // pero si tenemos define_decl con ese nombre lo registramos.
                }
                break;
            }
            // TC005: Operaciones numéricas en contexto no-aritmético
            case 'add':
            case 'subtract':
            case 'multiply':
            case 'divide':
            case 'modulo': {
                // Solo advertir si el perfil es explícitamente no-aritmético
                if (this.profile &&
                    !this.profile.startsWith('arithmetic') &&
                    !this.profile.startsWith('classical.first')) {
                    errors.push(this.err('TC005', 'warning', `Operación aritmética '${f.kind}' usada en perfil '${this.profile}'. ` +
                        `La aritmética puede no estar soportada en este perfil.`, f.source ?? location));
                }
                break;
            }
            // TC008: fn_call en fórmula — verifica aridad de funciones
            case 'fn_call': {
                if (f.name) {
                    const declaredArity = this.scope.functions.get(f.name);
                    const callArity = (f.args ?? []).length;
                    if (declaredArity !== undefined && declaredArity !== callArity) {
                        errors.push(this.err('TC002', 'error', `Aridad incorrecta para función '${f.name}': se esperaban ${declaredArity} argumentos, se recibieron ${callArity}.`, f.source ?? location, undefined));
                    }
                    else if (declaredArity === undefined && this.scope.functions.size > 0) {
                        // Función no declarada con sugerencia
                        const suggestion = (0, levenshtein_1.findClosest)(f.name, this.scope.functions.keys());
                        errors.push(this.err('TC001', 'warning', `Función '${f.name}' no está declarada.`, f.source ?? location, suggestion ? `¿Quisiste decir '${suggestion}'?` : undefined));
                    }
                }
                break;
            }
        }
        // Recurrir en sub-fórmulas
        if (f.args) {
            for (const sub of f.args) {
                errors.push(...this.checkFormula(sub, location));
            }
        }
        return errors;
    }
    /**
     * Visita recursivamente una lista de statements en un scope dado.
     */
    visitStatements(stmts, scope) {
        const savedScope = this.scope;
        if (scope)
            this.scope = scope;
        const errors = [];
        for (const stmt of stmts) {
            errors.push(...(0, visitor_1.visit)(stmt, this));
        }
        this.scope = savedScope;
        return errors;
    }
    // ── Visitors ──────────────────────────────────────────────
    visitLogicDecl(node) {
        this.profile = node.profile;
        return [];
    }
    visitAxiomDecl(node) {
        const errors = [];
        const location = loc(node);
        // TC006: Duplicado
        if (this.axiomNames.has(node.name)) {
            const prev = this.axiomNames.get(node.name) ?? { line: 0, column: 0 };
            errors.push(this.err('TC006', 'error', `Axioma '${node.name}' ya fue declarado (primera declaración en línea ${prev.line}).`, location));
        }
        else {
            this.axiomNames.set(node.name, location);
            this.scope.declared.set(node.name, 'axiom');
        }
        // Chequear la fórmula
        errors.push(...this.checkFormula(node.formula, location));
        return errors;
    }
    visitTheoremDecl(node) {
        const errors = [];
        const location = loc(node);
        // TC006: Duplicado
        if (this.theoremNames.has(node.name)) {
            const prev = this.theoremNames.get(node.name) ?? { line: 0, column: 0 };
            errors.push(this.err('TC006', 'error', `Teorema '${node.name}' ya fue declarado (primera declaración en línea ${prev.line}).`, location));
        }
        else {
            this.theoremNames.set(node.name, location);
            this.scope.declared.set(node.name, 'theorem');
        }
        errors.push(...this.checkFormula(node.formula, location));
        return errors;
    }
    visitDeriveCmd(node) {
        const errors = [];
        const location = loc(node);
        errors.push(...this.checkFormula(node.goal, location));
        // TC001: Premisas no declaradas
        for (const premise of node.premises) {
            if (!this.scope.declared.has(premise)) {
                const suggestion = (0, levenshtein_1.findClosest)(premise, this.allDeclaredNames());
                errors.push(this.err('TC001', 'error', `Premisa '${premise}' usada en 'derive' no está declarada.`, location, suggestion ? `¿Quisiste decir '${suggestion}'?` : undefined));
            }
        }
        return errors;
    }
    visitCheckValidCmd(node) {
        return this.checkFormula(node.formula, loc(node));
    }
    visitCheckSatisfiableCmd(node) {
        return this.checkFormula(node.formula, loc(node));
    }
    visitCheckEquivalentCmd(node) {
        return [
            ...this.checkFormula(node.left, loc(node)),
            ...this.checkFormula(node.right, loc(node)),
        ];
    }
    visitProveCmd(node) {
        const errors = [];
        const location = loc(node);
        errors.push(...this.checkFormula(node.goal, location));
        // TC001: Premisas no declaradas
        for (const premise of node.premises) {
            if (!this.scope.declared.has(premise)) {
                const suggestion = (0, levenshtein_1.findClosest)(premise, this.allDeclaredNames());
                errors.push(this.err('TC001', 'error', `Premisa '${premise}' usada en 'prove' no está declarada.`, location, suggestion ? `¿Quisiste decir '${suggestion}'?` : undefined));
            }
        }
        return errors;
    }
    visitCountermodelCmd(node) {
        return this.checkFormula(node.formula, loc(node));
    }
    visitTruthTableCmd(node) {
        return this.checkFormula(node.formula, loc(node));
    }
    visitLetDecl(node) {
        const errors = [];
        const location = loc(node);
        // TC003: Registrar el binding (antes de chequear la fórmula para evitar
        // falso positivo en definiciones recursivas — aceptamos forward-ref)
        this.scope.declared.set(node.name, 'let');
        if (node.letType === 'formula' || node.letType === 'formalize') {
            const formula = node.letType === 'formula' ? node.formula : node.formula;
            if (formula) {
                errors.push(...this.checkFormula(formula, location));
            }
        }
        return errors;
    }
    visitAnalyzeCmd(node) {
        const errors = [];
        const location = loc(node);
        for (const p of node.premises) {
            errors.push(...this.checkFormula(p, location));
        }
        errors.push(...this.checkFormula(node.conclusion, location));
        return errors;
    }
    visitExplainCmd(node) {
        return this.checkFormula(node.formula, loc(node));
    }
    visitImportDecl(node) {
        const errors = [];
        const location = loc(node);
        const path = node.path;
        // TC007: Circular import (detección básica — mismo archivo)
        if (path === this.file) {
            errors.push(this.err('TC007', 'error', `Importación circular detectada: '${path}' se importa a sí mismo.`, location));
        }
        else if (this.importsSeen.includes(path)) {
            errors.push(this.err('TC007', 'error', `Importación duplicada: '${path}' ya fue importado en este programa.`, location));
        }
        else {
            this.importsSeen.push(path);
        }
        return errors;
    }
    visitProofBlock(node) {
        const errors = [];
        const location = loc(node);
        const innerScope = mkScope(this.scope);
        // Registrar suposiciones en el scope del bloque
        for (const assumption of node.assumptions) {
            innerScope.declared.set(assumption.name, 'axiom');
            errors.push(...this.checkFormula(assumption.formula, location));
        }
        errors.push(...this.checkFormula(node.goal, location));
        errors.push(...this.visitStatements(node.body, innerScope));
        return errors;
    }
    visitTheoryDecl(node) {
        const errors = [];
        const theoryScope = mkScope(this.scope);
        // Registrar la teoría en el scope externo
        this.scope.declared.set(node.name, 'let');
        // Parámetros de la teoría en el scope interno
        if (node.params) {
            for (const param of node.params) {
                theoryScope.declared.set(param, 'param');
            }
        }
        // TC006: nombre duplicado de teoría (ya se manejará con el declared map)
        const savedAxioms = new Map(this.axiomNames);
        const savedTheorems = new Map(this.theoremNames);
        const savedScope = this.scope;
        this.scope = theoryScope;
        for (const member of node.members) {
            errors.push(...(0, visitor_1.visit)(member.statement, this));
        }
        this.scope = savedScope;
        // Restaurar nombre maps globales (las teorías tienen su propio espacio)
        this.axiomNames = savedAxioms;
        this.theoremNames = savedTheorems;
        return errors;
    }
    visitIfStmt(node) {
        const errors = [];
        for (const branch of node.branches) {
            errors.push(...this.checkFormula(branch.formula, loc(node)));
            errors.push(...this.visitStatements(branch.body));
        }
        if (node.elseBranch) {
            errors.push(...this.visitStatements(node.elseBranch));
        }
        return errors;
    }
    visitForStmt(node) {
        const errors = [];
        const location = loc(node);
        const innerScope = mkScope(this.scope);
        innerScope.declared.set(node.variable, 'let');
        for (const item of node.items) {
            errors.push(...this.checkFormula(item, location));
        }
        errors.push(...this.visitStatements(node.body, innerScope));
        return errors;
    }
    visitWhileStmt(node) {
        const errors = [];
        errors.push(...this.checkFormula(node.formula, loc(node)));
        errors.push(...this.visitStatements(node.body));
        return errors;
    }
    visitFnDecl(node) {
        const errors = [];
        // Registrar la función en el scope externo con su aridad
        this.scope.declared.set(node.name, 'fn');
        this.scope.functions.set(node.name, node.params.length);
        // Scope interno: parámetros como let
        const innerScope = mkScope(this.scope);
        innerScope.insideFn = true;
        for (const param of node.params) {
            innerScope.declared.set(param, 'param');
        }
        errors.push(...this.visitStatements(node.body, innerScope));
        return errors;
    }
    visitReturnStmt(node) {
        const errors = [];
        const location = loc(node);
        // TC008: return fuera de fn
        if (!this.scope.insideFn) {
            errors.push(this.err('TC008', 'error', `'return' usado fuera de una declaración 'fn'. Solo se puede usar 'return' dentro de una función.`, location));
        }
        if (node.formula) {
            errors.push(...this.checkFormula(node.formula, location));
        }
        return errors;
    }
    visitFnCall(node) {
        const errors = [];
        const location = loc(node);
        // TC001: función no declarada
        if (!this.scope.declared.has(node.name)) {
            const suggestion = (0, levenshtein_1.findClosest)(node.name, this.allDeclaredNames());
            errors.push(this.err('TC001', 'error', `Función '${node.name}' llamada pero no declarada.`, location, suggestion ? `¿Quisiste decir '${suggestion}'?` : undefined));
        }
        else {
            // TC002: aridad
            const declaredArity = this.scope.functions.get(node.name);
            if (declaredArity !== undefined && declaredArity !== node.args.length) {
                errors.push(this.err('TC002', 'error', `Aridad incorrecta para '${node.name}': se esperaban ${declaredArity} argumentos, se recibieron ${node.args.length}.`, location));
            }
        }
        for (const arg of node.args) {
            errors.push(...this.checkFormula(arg, location));
        }
        return errors;
    }
    visitExportDecl(node) {
        return (0, visitor_1.visit)(node.statement, this);
    }
    visitDefineDecl(node) {
        const errors = [];
        const location = loc(node);
        // TC006: define duplicado
        if (this.scope.declared.has(node.name)) {
            errors.push(this.err('TC006', 'warning', `Definición '${node.name}' ya existe en el scope actual.`, location));
        }
        else {
            this.scope.declared.set(node.name, 'define');
            // Registrar como predicado si tiene params (aridad conocida)
            if (node.params !== undefined) {
                this.scope.predicates.set(node.name, node.params.length);
            }
        }
        // Scope interno con parámetros
        const innerScope = mkScope(this.scope);
        if (node.params) {
            for (const param of node.params) {
                innerScope.declared.set(param, 'param');
            }
        }
        const savedScope = this.scope;
        this.scope = innerScope;
        errors.push(...this.checkFormula(node.body, location));
        this.scope = savedScope;
        return errors;
    }
    visitUnfoldCmd(node) {
        return this.checkFormula(node.formula, loc(node));
    }
    visitFoldCmd(node) {
        return this.checkFormula(node.formula, loc(node));
    }
    visitInterpretCmd(node) {
        return this.checkFormula(node.formula, loc(node));
    }
}
exports.TypeChecker = TypeChecker;
// ── Función principal de API ──────────────────────────────────
/**
 * Ejecuta el type-checker estático sobre un Program ya parseado.
 *
 * @param program AST del programa ST
 * @param profile Nombre del perfil activo (puede estar en el AST como logic_decl)
 * @param file    Nombre del archivo (para TC007)
 * @returns Lista de TypeError[]  — vacía si no hay errores
 */
function typeCheck(program, profile = '', file) {
    const checker = new TypeChecker(profile, file ?? program.file ?? '<unknown>');
    const errors = [];
    for (const stmt of program.statements) {
        errors.push(...(0, visitor_1.visit)(stmt, checker));
    }
    return errors;
}
//# sourceMappingURL=checker.js.map