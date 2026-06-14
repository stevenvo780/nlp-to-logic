export declare class PluginConflictError extends Error {
    readonly pluginName: string;
    constructor(pluginName: string);
}
export declare class PluginValidationError extends Error {
    readonly errors: string[];
    constructor(errors: string[]);
}
//# sourceMappingURL=errors.d.ts.map