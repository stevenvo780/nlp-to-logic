import type { Category, MorId } from './types';
/**
 * Objeto FinSet = nombre + conjunto de elementos. El nombre actúa
 * como identidad estable; los elementos viven como strings.
 */
export interface FinSetObj {
    readonly name: string;
    readonly elements: ReadonlyArray<string>;
}
/**
 * Morfismo FinSet: función total entre los elementos de src y tgt.
 * `id` es la clave única en `morphisms`. Construirla via
 * `mkFinSetMor` garantiza coherencia con la categoría.
 */
export interface FinSetMor {
    readonly id: MorId;
    readonly src: string;
    readonly tgt: string;
    readonly fn: ReadonlyMap<string, string>;
}
/**
 * Construye un morfismo en FinSet validando que `fn` cubra
 * todos los elementos del dominio y que sus imágenes vivan en el
 * codominio. Lanza si el cliente intenta crear una función parcial
 * o con valores fuera de tgt.
 */
export declare function mkFinSetMor(name: string, src: FinSetObj, tgt: FinSetObj, table: Record<string, string> | ReadonlyMap<string, string>): FinSetMor;
/**
 * Construye FinSet sobre un conjunto explícito de objetos y morfismos.
 * Cierra automáticamente bajo identidades y composiciones (transitive
 * closure) para que `verifyAssociativity` no falle por morfismos
 * intermedios faltantes.
 *
 * `maxClosureSteps` limita la expansión por seguridad cuando la
 * categoría tiene ciclos densos; default 4 es suficiente para
 * todos los tests del módulo.
 */
export declare function FinSet(objs: ReadonlyArray<FinSetObj>, generators?: ReadonlyArray<FinSetMor>, maxClosureSteps?: number): Category<FinSetObj, FinSetMor>;
//# sourceMappingURL=fin-set.d.ts.map