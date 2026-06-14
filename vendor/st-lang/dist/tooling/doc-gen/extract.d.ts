import type { DocModule } from './types';
export interface ExtractOptions {
    includeInternal?: boolean;
}
/**
 * Entrada principal. Recorre `rootDir` recursivamente, parsea cada
 * archivo `.ts` y devuelve un `DocModule` por archivo con contenido.
 *
 * Archivos sin exports documentados se omiten (no aparecen en el
 * resultado) para mantener el output compacto.
 */
export declare function extractDocs(rootDir: string, opts?: ExtractOptions): DocModule[];
//# sourceMappingURL=extract.d.ts.map