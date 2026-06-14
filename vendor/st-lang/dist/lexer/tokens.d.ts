export declare enum TokenType {
    LOGIC = "LOGIC",
    AXIOM = "AXIOM",
    THEOREM = "THEOREM",
    DERIVE = "DERIVE",
    FROM = "FROM",
    CHECK = "CHECK",
    VALID = "VALID",
    SATISFIABLE = "SATISFIABLE",
    EQUIVALENT = "EQUIVALENT",
    PROVE = "PROVE",
    COUNTERMODEL = "COUNTERMODEL",
    TRUTH_TABLE = "TRUTH_TABLE",
    LET = "LET",
    PASSAGE = "PASSAGE",
    FORMALIZE = "FORMALIZE",
    AS = "AS",
    CLAIM = "CLAIM",
    SUPPORT = "SUPPORT",
    CONFIDENCE = "CONFIDENCE",
    CONTEXT = "CONTEXT",
    RENDER = "RENDER",
    FORALL = "FORALL",
    EXISTS = "EXISTS",
    ANALYZE = "ANALYZE",
    EXPLAIN = "EXPLAIN",
    REFUTE = "REFUTE",
    NEXT = "NEXT",// X (temporal next)
    UNTIL = "UNTIL",// U (temporal until)
    IMPORT = "IMPORT",// import file
    EXPORT = "EXPORT",// export keyword
    ASSUME = "ASSUME",// assume (natural deduction)
    SHOW = "SHOW",// show goal
    QED = "QED",// end proof block
    THEORY = "THEORY",// theory block (OOP)
    EXTENDS = "EXTENDS",// theory inheritance
    PRIVATE = "PRIVATE",// private member (encapsulation)
    PRINT = "PRINT",// print command
    SET = "SET",// set (reassign variable)
    IF = "IF",// if conditional
    ELSE = "ELSE",// else branch
    FOR = "FOR",// for loop
    IN = "IN",// in (for x in {..})
    WHILE = "WHILE",// while loop
    FN = "FN",// function declaration
    RETURN = "RETURN",// return from function
    DEFINE = "DEFINE",// define keyword
    UNFOLD = "UNFOLD",// unfold command
    FOLD = "FOLD",// fold command
    SOURCE_KW = "SOURCE_KW",// source declaration
    INTERPRET = "INTERPRET",// interpret text as formula
    GLOSSARY = "GLOSSARY",// glossary command
    DESCRIPTION = "DESCRIPTION",// description keyword (post-define)
    AT = "AT",// @ source annotation
    ARROW = "ARROW",// ->
    AND = "AND",// &
    OR = "OR",// |
    NOT = "NOT",// !
    BICONDITIONAL = "BICONDITIONAL",// <->
    BACK_ARROW = "BACK_ARROW",// <-
    EQUALS = "EQUALS",// =
    NAND = "NAND",// ↑ (NAND)
    NOR = "NOR",// ↓ (NOR)
    XOR = "XOR",// ⊕ (XOR)
    TRUE_CONST = "TRUE_CONST",// ⊤ / true / verdadero
    FALSE_CONST = "FALSE_CONST",// ⊥ / false / falso
    PLUS = "PLUS",// +
    MINUS = "MINUS",// -
    STAR = "STAR",// *
    SLASH = "SLASH",// /
    PERCENT = "PERCENT",// %
    LT = "LT",// <
    GT = "GT",// >
    LTE = "LTE",// <=
    GTE = "GTE",// >=
    LPAREN = "LPAREN",// (
    RPAREN = "RPAREN",// )
    LBRACE = "LBRACE",// {
    RBRACE = "RBRACE",// }
    LBRACKET_DOUBLE = "LBRACKET_DOUBLE",// [[
    RBRACKET_DOUBLE = "RBRACKET_DOUBLE",// ]]
    LBRACKET = "LBRACKET",// [
    RBRACKET = "RBRACKET",// ]
    IDENTIFIER = "IDENTIFIER",
    STRING = "STRING",
    NUMBER = "NUMBER",
    COMMA = "COMMA",// ,
    COLON = "COLON",// :
    HASH = "HASH",// #
    DOT = "DOT",// .
    BOX = "BOX",// []
    DIAMOND = "DIAMOND",// <>
    NEWLINE = "NEWLINE",
    EOF = "EOF",
    COMMENT = "COMMENT"
}
export interface Token {
    type: TokenType;
    value: string;
    line: number;
    column: number;
}
/**
 * Core keywords — always reserved regardless of profile.
 */
export declare const CORE_KEYWORDS: Record<string, TokenType>;
/**
 * Profile-specific keywords — only reserved when the matching profile is active.
 * Keys are profile prefixes: a keyword activates when the current profile starts with the key.
 */
export declare const PROFILE_KEYWORDS: Record<string, Record<string, TokenType>>;
/**
 * Build the full keyword map for a given profile.
 * If no profile is given, all keywords (core + all profile) are active (backward compatible).
 */
export declare function getKeywordsForProfile(profile?: string): Record<string, TokenType>;
/**
 * Legacy: all keywords combined (for backward compatibility).
 */
export declare const KEYWORDS: Record<string, TokenType>;
//# sourceMappingURL=tokens.d.ts.map