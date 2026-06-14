export type FOLNode = {
    kind: 'atom';
    predicate: string;
    args: string[];
} | {
    kind: 'not';
    arg: FOLNode;
} | {
    kind: 'and';
    left: FOLNode;
    right: FOLNode;
} | {
    kind: 'or';
    left: FOLNode;
    right: FOLNode;
} | {
    kind: 'implies';
    left: FOLNode;
    right: FOLNode;
};
export declare function parseFOL(input: string): FOLNode;
/** Devuelve las variables libres (lowercase) que aparecen en `node`. */
export declare function freeVariables(node: FOLNode): string[];
export declare function isVariable(name: string): boolean;
//# sourceMappingURL=parser.d.ts.map