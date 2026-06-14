import type { MonoidalCategory } from './types';
import { type FinSetMor, type FinSetObj } from './fin-set';
/**
 * Construye la categoría monoidal (FinSet, ×, 1). Recibe la lista
 * de objetos generadores; añade automáticamente la unidad 1.
 *
 * Esta versión es estricta hasta isomorfismo canónico: los unitores
 * y asociador se comprueban por igualdad estructural de los
 * elementos serializados (`x` vs `*∥x` vs `x∥*`), siguiendo la
 * convención `mkProductObj`. En lugar de verificar conmutatividad
 * de diagramas complejos, comparamos los carriers normalizados.
 */
export declare function FinSetMonoidal(objs: ReadonlyArray<FinSetObj>, generators?: ReadonlyArray<FinSetMor>): MonoidalCategory<FinSetObj, FinSetMor>;
//# sourceMappingURL=monoidal.d.ts.map