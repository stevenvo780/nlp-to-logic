"use strict";
// ============================================================
// ST Lexer — Tokens
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.KEYWORDS = exports.PROFILE_KEYWORDS = exports.CORE_KEYWORDS = exports.TokenType = void 0;
exports.getKeywordsForProfile = getKeywordsForProfile;
var TokenType;
(function (TokenType) {
    // Keywords
    TokenType["LOGIC"] = "LOGIC";
    TokenType["AXIOM"] = "AXIOM";
    TokenType["THEOREM"] = "THEOREM";
    TokenType["DERIVE"] = "DERIVE";
    TokenType["FROM"] = "FROM";
    TokenType["CHECK"] = "CHECK";
    TokenType["VALID"] = "VALID";
    TokenType["SATISFIABLE"] = "SATISFIABLE";
    TokenType["EQUIVALENT"] = "EQUIVALENT";
    TokenType["PROVE"] = "PROVE";
    TokenType["COUNTERMODEL"] = "COUNTERMODEL";
    TokenType["TRUTH_TABLE"] = "TRUTH_TABLE";
    TokenType["LET"] = "LET";
    TokenType["PASSAGE"] = "PASSAGE";
    TokenType["FORMALIZE"] = "FORMALIZE";
    TokenType["AS"] = "AS";
    TokenType["CLAIM"] = "CLAIM";
    TokenType["SUPPORT"] = "SUPPORT";
    TokenType["CONFIDENCE"] = "CONFIDENCE";
    TokenType["CONTEXT"] = "CONTEXT";
    TokenType["RENDER"] = "RENDER";
    TokenType["FORALL"] = "FORALL";
    TokenType["EXISTS"] = "EXISTS";
    TokenType["ANALYZE"] = "ANALYZE";
    TokenType["EXPLAIN"] = "EXPLAIN";
    TokenType["REFUTE"] = "REFUTE";
    TokenType["NEXT"] = "NEXT";
    TokenType["UNTIL"] = "UNTIL";
    TokenType["IMPORT"] = "IMPORT";
    TokenType["EXPORT"] = "EXPORT";
    TokenType["ASSUME"] = "ASSUME";
    TokenType["SHOW"] = "SHOW";
    TokenType["QED"] = "QED";
    TokenType["THEORY"] = "THEORY";
    TokenType["EXTENDS"] = "EXTENDS";
    TokenType["PRIVATE"] = "PRIVATE";
    TokenType["PRINT"] = "PRINT";
    TokenType["SET"] = "SET";
    TokenType["IF"] = "IF";
    TokenType["ELSE"] = "ELSE";
    TokenType["FOR"] = "FOR";
    TokenType["IN"] = "IN";
    TokenType["WHILE"] = "WHILE";
    TokenType["FN"] = "FN";
    TokenType["RETURN"] = "RETURN";
    // v3 — Definitions, sources, glossary
    TokenType["DEFINE"] = "DEFINE";
    TokenType["UNFOLD"] = "UNFOLD";
    TokenType["FOLD"] = "FOLD";
    TokenType["SOURCE_KW"] = "SOURCE_KW";
    TokenType["INTERPRET"] = "INTERPRET";
    TokenType["GLOSSARY"] = "GLOSSARY";
    TokenType["DESCRIPTION"] = "DESCRIPTION";
    TokenType["AT"] = "AT";
    // Operators
    TokenType["ARROW"] = "ARROW";
    TokenType["AND"] = "AND";
    TokenType["OR"] = "OR";
    TokenType["NOT"] = "NOT";
    TokenType["BICONDITIONAL"] = "BICONDITIONAL";
    TokenType["BACK_ARROW"] = "BACK_ARROW";
    TokenType["EQUALS"] = "EQUALS";
    TokenType["NAND"] = "NAND";
    TokenType["NOR"] = "NOR";
    TokenType["XOR"] = "XOR";
    TokenType["TRUE_CONST"] = "TRUE_CONST";
    TokenType["FALSE_CONST"] = "FALSE_CONST";
    // Arithmetic operators
    TokenType["PLUS"] = "PLUS";
    TokenType["MINUS"] = "MINUS";
    TokenType["STAR"] = "STAR";
    TokenType["SLASH"] = "SLASH";
    TokenType["PERCENT"] = "PERCENT";
    TokenType["LT"] = "LT";
    TokenType["GT"] = "GT";
    TokenType["LTE"] = "LTE";
    TokenType["GTE"] = "GTE";
    // Delimiters
    TokenType["LPAREN"] = "LPAREN";
    TokenType["RPAREN"] = "RPAREN";
    TokenType["LBRACE"] = "LBRACE";
    TokenType["RBRACE"] = "RBRACE";
    TokenType["LBRACKET_DOUBLE"] = "LBRACKET_DOUBLE";
    TokenType["RBRACKET_DOUBLE"] = "RBRACKET_DOUBLE";
    TokenType["LBRACKET"] = "LBRACKET";
    TokenType["RBRACKET"] = "RBRACKET";
    // Literals
    TokenType["IDENTIFIER"] = "IDENTIFIER";
    TokenType["STRING"] = "STRING";
    TokenType["NUMBER"] = "NUMBER";
    // Punctuation
    TokenType["COMMA"] = "COMMA";
    TokenType["COLON"] = "COLON";
    TokenType["HASH"] = "HASH";
    TokenType["DOT"] = "DOT";
    // Modal Operators
    TokenType["BOX"] = "BOX";
    TokenType["DIAMOND"] = "DIAMOND";
    // Special
    TokenType["NEWLINE"] = "NEWLINE";
    TokenType["EOF"] = "EOF";
    TokenType["COMMENT"] = "COMMENT";
})(TokenType || (exports.TokenType = TokenType = {}));
/**
 * Core keywords — always reserved regardless of profile.
 */
exports.CORE_KEYWORDS = {
    // ── English keywords ───────────────────────────────────────
    logic: TokenType.LOGIC,
    axiom: TokenType.AXIOM,
    theorem: TokenType.THEOREM,
    derive: TokenType.DERIVE,
    from: TokenType.FROM,
    check: TokenType.CHECK,
    valid: TokenType.VALID,
    satisfiable: TokenType.SATISFIABLE,
    equivalent: TokenType.EQUIVALENT,
    prove: TokenType.PROVE,
    countermodel: TokenType.COUNTERMODEL,
    truth_table: TokenType.TRUTH_TABLE,
    let: TokenType.LET,
    passage: TokenType.PASSAGE,
    formalize: TokenType.FORMALIZE,
    as: TokenType.AS,
    claim: TokenType.CLAIM,
    support: TokenType.SUPPORT,
    confidence: TokenType.CONFIDENCE,
    context: TokenType.CONTEXT,
    render: TokenType.RENDER,
    forall: TokenType.FORALL,
    exists: TokenType.EXISTS,
    analyze: TokenType.ANALYZE,
    explain: TokenType.EXPLAIN,
    print: TokenType.PRINT,
    set: TokenType.SET,
    if: TokenType.IF,
    else: TokenType.ELSE,
    for: TokenType.FOR,
    in: TokenType.IN,
    while: TokenType.WHILE,
    fn: TokenType.FN,
    return: TokenType.RETURN,
    nand: TokenType.NAND,
    nor: TokenType.NOR,
    xor: TokenType.XOR,
    true: TokenType.TRUE_CONST,
    false: TokenType.FALSE_CONST,
    verdadero: TokenType.TRUE_CONST,
    falso: TokenType.FALSE_CONST,
    define: TokenType.DEFINE,
    unfold: TokenType.UNFOLD,
    fold: TokenType.FOLD,
    source: TokenType.SOURCE_KW,
    interpret: TokenType.INTERPRET,
    glossary: TokenType.GLOSSARY,
    description: TokenType.DESCRIPTION,
    import: TokenType.IMPORT,
    importar: TokenType.IMPORT,
    export: TokenType.EXPORT,
    exportar: TokenType.EXPORT,
    assume: TokenType.ASSUME,
    asumir: TokenType.ASSUME,
    show: TokenType.SHOW,
    demostrar: TokenType.SHOW,
    qed: TokenType.QED,
    theory: TokenType.THEORY,
    teoria: TokenType.THEORY,
    extends: TokenType.EXTENDS,
    extiende: TokenType.EXTENDS,
    private: TokenType.PRIVATE,
    privado: TokenType.PRIVATE,
    // ── Spanish aliases (aliases en español) ───────────────────
    logica: TokenType.LOGIC,
    axioma: TokenType.AXIOM,
    teorema: TokenType.THEOREM,
    derivar: TokenType.DERIVE,
    desde: TokenType.FROM,
    verificar: TokenType.CHECK,
    valido: TokenType.VALID,
    satisfacible: TokenType.SATISFIABLE,
    equivalente: TokenType.EQUIVALENT,
    probar: TokenType.PROVE,
    contramodelo: TokenType.COUNTERMODEL,
    tabla_verdad: TokenType.TRUTH_TABLE,
    sea: TokenType.LET,
    pasaje: TokenType.PASSAGE,
    formalizar: TokenType.FORMALIZE,
    como: TokenType.AS,
    afirmacion: TokenType.CLAIM,
    soporte: TokenType.SUPPORT,
    confianza: TokenType.CONFIDENCE,
    contexto: TokenType.CONTEXT,
    mostrar: TokenType.RENDER,
    paratodo: TokenType.FORALL,
    existe: TokenType.EXISTS,
    analizar: TokenType.ANALYZE,
    explicar: TokenType.EXPLAIN,
    refute: TokenType.REFUTE,
    refutar: TokenType.REFUTE,
    imprimir: TokenType.PRINT,
    asignar: TokenType.SET,
    si: TokenType.IF,
    sino: TokenType.ELSE,
    para: TokenType.FOR,
    en: TokenType.IN,
    mientras: TokenType.WHILE,
    funcion: TokenType.FN,
    retornar: TokenType.RETURN,
    definir: TokenType.DEFINE,
    desplegar: TokenType.UNFOLD,
    plegar: TokenType.FOLD,
    fuente: TokenType.SOURCE_KW,
    interpretar: TokenType.INTERPRET,
    glosario: TokenType.GLOSSARY,
    descripcion: TokenType.DESCRIPTION,
};
/**
 * Profile-specific keywords — only reserved when the matching profile is active.
 * Keys are profile prefixes: a keyword activates when the current profile starts with the key.
 */
exports.PROFILE_KEYWORDS = {
    temporal: {
        next: TokenType.NEXT,
        siguiente: TokenType.NEXT,
        until: TokenType.UNTIL,
        hasta: TokenType.UNTIL,
    },
};
/**
 * Build the full keyword map for a given profile.
 * If no profile is given, all keywords (core + all profile) are active (backward compatible).
 */
function getKeywordsForProfile(profile) {
    if (!profile) {
        // No profile context: all keywords active (backward compatible)
        const all = { ...exports.CORE_KEYWORDS };
        for (const group of Object.values(exports.PROFILE_KEYWORDS)) {
            Object.assign(all, group);
        }
        return all;
    }
    const keywords = { ...exports.CORE_KEYWORDS };
    for (const [prefix, group] of Object.entries(exports.PROFILE_KEYWORDS)) {
        if (profile.startsWith(prefix)) {
            Object.assign(keywords, group);
        }
    }
    return keywords;
}
/**
 * Legacy: all keywords combined (for backward compatibility).
 */
exports.KEYWORDS = getKeywordsForProfile();
//# sourceMappingURL=tokens.js.map