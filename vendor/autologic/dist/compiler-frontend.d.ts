/**
 * El frontend del compilador que intercepta las oraciones lógicas complejas
 * y usa directamente el AST y los módulos CFG para evitar el tokenizer fallido.
 */
export declare function compileComplexLogic(text: string, profile: string): {
    formula: string;
    type: 'axiom' | 'check';
}[] | null;
//# sourceMappingURL=compiler-frontend.d.ts.map