export type ApiKind = 'function' | 'class' | 'interface' | 'type' | 'const' | 'enum' | 'namespace';
export interface ApiParameter {
    name: string;
    type: string;
    description: string;
    optional: boolean;
}
export interface ApiReturns {
    type: string;
    description: string;
}
export interface ApiDoc {
    name: string;
    kind: ApiKind;
    description: string;
    signature: string;
    parameters?: ApiParameter[];
    returns?: ApiReturns;
    examples?: string[];
    remarks?: string;
    see?: string[];
    deprecated?: boolean;
    module: string;
    filePath: string;
    lineNumber: number;
    exported: boolean;
}
export interface DocModule {
    path: string;
    description?: string;
    exports: ApiDoc[];
}
export interface DocOptions {
    rootDir: string;
    outputDir: string;
    includeInternal?: boolean;
    template?: 'markdown' | 'json' | 'html-minimal';
}
export interface JSDocTag {
    tag: string;
    content: string;
}
export interface ParsedJSDoc {
    description: string;
    tags: JSDocTag[];
}
export interface GenerateResult {
    filesWritten: string[];
    warnings: string[];
}
//# sourceMappingURL=types.d.ts.map