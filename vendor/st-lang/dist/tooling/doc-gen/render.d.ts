import type { DocModule } from './types';
/**
 * Renderiza la documentación a Markdown. La salida es un Map en
 * el que la clave es la ruta del archivo `.md` correspondiente
 * (relativa) y el valor es su contenido textual.
 *
 * Además del archivo por módulo, se incluye `index.md` con el
 * overview generado por `renderIndex`.
 */
export declare function renderMarkdown(modules: DocModule[]): Map<string, string>;
/**
 * Serializa la estructura completa a JSON pretty-printed.
 *
 * Útil cuando el consumidor (otro generador, un buscador, un
 * sitio estático) prefiere consumir la data cruda.
 */
export declare function renderJSON(modules: DocModule[]): string;
/**
 * Construye un `index.md` resumen con:
 *  - conteo total de módulos y símbolos
 *  - tabla por módulo con # de exports y descripción opcional
 *  - sub-tablas por kind (functions, classes, etc.)
 */
export declare function renderIndex(modules: DocModule[]): string;
/**
 * `tooling/doc-gen/extract.ts` → `tooling/doc-gen/extract.md`.
 */
export declare function toMarkdownPath(modulePath: string): string;
//# sourceMappingURL=render.d.ts.map