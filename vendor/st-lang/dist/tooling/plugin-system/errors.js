"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginValidationError = exports.PluginConflictError = void 0;
class PluginConflictError extends Error {
    pluginName;
    constructor(pluginName) {
        super(`Plugin "${pluginName}" ya está registrado. Llamá unregister("${pluginName}") antes de registrar una nueva versión.`);
        this.name = 'PluginConflictError';
        this.pluginName = pluginName;
        Object.setPrototypeOf(this, PluginConflictError.prototype);
    }
}
exports.PluginConflictError = PluginConflictError;
class PluginValidationError extends Error {
    errors;
    constructor(errors) {
        super(`Plugin inválido: ${errors.join('; ')}`);
        this.name = 'PluginValidationError';
        this.errors = errors;
        Object.setPrototypeOf(this, PluginValidationError.prototype);
    }
}
exports.PluginValidationError = PluginValidationError;
//# sourceMappingURL=errors.js.map