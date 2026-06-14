/**
 * Un término BAN es un objeto del dominio: principal (agente), clave,
 * nonce, mensaje compuesto, mensaje cifrado, hash o término genérico.
 */
export type BANTerm = {
    kind: 'principal';
    name: string;
} | {
    kind: 'key';
    name: string;
    shared?: [string, string];
} | {
    kind: 'nonce';
    name: string;
} | {
    kind: 'message';
    content: BANTerm[];
} | {
    kind: 'encrypted';
    message: BANTerm;
    key: BANTerm;
} | {
    kind: 'hashed';
    message: BANTerm;
} | {
    kind: 'compound';
    parts: BANTerm[];
} | {
    kind: 'atom';
    name: string;
};
/**
 * Una fórmula BAN es una proposición sobre creencias, posesión o
 * propiedades de términos. Es lo que las reglas manipulan.
 *
 * Nota: tratamos `said` y `said-message` por separado porque BAN distingue
 * entre "P dijo una fórmula completa" (raro) y "P dijo un término"
 * (caso usual; lo que aparece en mensajes ciphered).
 */
export type BANFormula = {
    kind: 'believes';
    principal: BANTerm;
    about: BANFormula;
} | {
    kind: 'sees';
    principal: BANTerm;
    what: BANTerm;
} | {
    kind: 'said';
    principal: BANTerm;
    what: BANFormula;
} | {
    kind: 'said-message';
    principal: BANTerm;
    what: BANTerm;
} | {
    kind: 'jurisdiction';
    principal: BANTerm;
    over: BANFormula;
} | {
    kind: 'fresh';
    what: BANTerm;
} | {
    kind: 'sharedKey';
    a: BANTerm;
    b: BANTerm;
    key: BANTerm;
} | {
    kind: 'publicKey';
    principal: BANTerm;
    key: BANTerm;
} | {
    kind: 'sharedSecret';
    a: BANTerm;
    b: BANTerm;
    secret: BANTerm;
} | {
    kind: 'controls';
    principal: BANTerm;
    statement: BANFormula;
} | {
    kind: 'formula-and';
    left: BANFormula;
    right: BANFormula;
};
export interface BANRule {
    name: string;
    description: string;
}
export interface ProtocolStep {
    from: string;
    to: string;
    message: BANTerm;
}
export interface Protocol {
    name: string;
    participants: string[];
    initialAssumptions: BANFormula[];
    steps: ProtocolStep[];
    goals: BANFormula[];
}
export interface ProtocolAnalysis {
    satisfied: BANFormula[];
    unsatisfied: BANFormula[];
    trace: BANFormula[];
}
//# sourceMappingURL=types.d.ts.map