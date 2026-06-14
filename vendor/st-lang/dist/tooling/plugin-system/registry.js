"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileRegistry = void 0;
const errors_1 = require("./errors");
const validate_1 = require("./validate");
class ProfileRegistry {
    static plugins = new Map();
    static register(plugin) {
        const result = (0, validate_1.validatePlugin)(plugin);
        if (!result.valid) {
            throw new errors_1.PluginValidationError(result.errors);
        }
        if (ProfileRegistry.plugins.has(plugin.name)) {
            throw new errors_1.PluginConflictError(plugin.name);
        }
        ProfileRegistry.plugins.set(plugin.name, plugin);
    }
    static unregister(name) {
        return ProfileRegistry.plugins.delete(name);
    }
    static get(name) {
        return ProfileRegistry.plugins.get(name);
    }
    static list() {
        const out = [];
        for (const plugin of ProfileRegistry.plugins.values()) {
            const info = { name: plugin.name, version: plugin.version };
            if (plugin.description !== undefined) {
                info.description = plugin.description;
            }
            out.push(info);
        }
        return out;
    }
    static has(name) {
        return ProfileRegistry.plugins.has(name);
    }
    static size() {
        return ProfileRegistry.plugins.size;
    }
    static clear() {
        ProfileRegistry.plugins.clear();
    }
}
exports.ProfileRegistry = ProfileRegistry;
//# sourceMappingURL=registry.js.map