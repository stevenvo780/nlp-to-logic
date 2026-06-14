"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormulaFactory = void 0;
/**
 * Motor de Internado de Fórmulas (Hash-Consing)
 * Asegura que fórmulas idénticas compartan la misma instancia en memoria.
 */
class FormulaFactory {
    static cache = new Map();
    /**
     * Crea o recupera una instancia única de una fórmula.
     */
    static create(f) {
        if (!f)
            return f;
        // Generar hash estructural
        const hash = this.hash(f);
        // Si ya existe en caché, devolver la instancia existente
        const cached = this.cache.get(hash);
        if (cached) {
            return cached;
        }
        // Si no existe, congelar la nueva instancia y guardarla
        // Importante: No modificamos f.source para no perder info de depuración,
        // pero el hash ignora el source para permitir la compartición estructural.
        this.cache.set(hash, f);
        return f;
    }
    /**
     * Genera un hash único basado únicamente en la estructura de la fórmula.
     * Ignora metadatos como 'source' o 'id'.
     */
    static hash(f) {
        const parts = [f.kind];
        if (f.name)
            parts.push(`n:${f.name}`);
        if (f.variable)
            parts.push(`v:${f.variable}`);
        if (f.value !== undefined)
            parts.push(`val:${f.value}`);
        if (f.params) {
            parts.push(`p:${f.params.join(',')}`);
        }
        if (f.args && f.args.length > 0) {
            parts.push('a[');
            for (const arg of f.args) {
                parts.push(this.hash(arg));
                parts.push(',');
            }
            parts.push(']');
        }
        return parts.join('|');
    }
    /**
     * Limpia la caché de fórmulas (útil para liberar RAM entre ejecuciones pesadas).
     */
    static clear() {
        this.cache.clear();
    }
    /**
     * Devuelve el número de fórmulas únicas en memoria.
     */
    static size() {
        return this.cache.size;
    }
}
exports.FormulaFactory = FormulaFactory;
//# sourceMappingURL=formula-factory.js.map