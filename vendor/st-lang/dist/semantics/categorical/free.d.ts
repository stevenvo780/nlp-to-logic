import type { Category, MorId } from './types';
/**
 * Morfismo de la categoría libre = path. Representamos un path
 * como la lista de nombres de aristas (o vacío para la identidad)
 * junto con su origen y destino.
 */
export interface FreeMor {
    readonly id: MorId;
    readonly src: string;
    readonly tgt: string;
    readonly path: ReadonlyArray<string>;
}
/**
 * Construye la categoría libre. `generators` es una lista de tripletas
 * `[from, to, name]` donde `name` debe ser único globalmente.
 *
 * `maxLength` acota la longitud máxima de paths considerados al
 * "materializar" la categoría como `Map<MorId, FreeMor>`. Esto es
 * inevitable: la categoría libre sobre un grafo con ciclos es
 * infinita. Para tests usamos `maxLength=3`.
 */
export declare function Free(vertices: ReadonlyArray<string>, generators: ReadonlyArray<readonly [string, string, string]>, maxLength?: number): Category<string, FreeMor>;
//# sourceMappingURL=free.d.ts.map