import type { Category, Cone, Diagram } from './types';
import { type FinSetMor, type FinSetObj } from './fin-set';
/**
 * Verifica que `cone` sea un cono sobre `diagram` en `cat`:
 * para cada arista `e: i→j` del diagrama, `e ∘ leg(i) = leg(j)`.
 */
export declare function isCone<O, M>(cat: Category<O, M>, diagram: Diagram<O, M>, cone: Cone<O, M>): boolean;
/**
 * Comprueba si `cone` es límite del diagrama: para cada otro cono
 * candidato sobre el diagrama, existe un único morfismo `u : apex' → apex`
 * que conmuta con las patas. La búsqueda es por enumeración sobre
 * los morfismos registrados en `cat`; sirve bien para categorías finitas
 * pequeñas (FinSet con objetos chicos).
 */
export declare function isLimit<O, M>(cat: Category<O, M>, diagram: Diagram<O, M>, cone: Cone<O, M>): boolean;
/**
 * Producto binario en FinSet: A×B con proyecciones π1, π2.
 * Construye el objeto producto como un nuevo `FinSetObj` con
 * elementos `(a,b)` codificados como `"a∥b"` y lo registra en `cat`.
 *
 * Devuelve `null` si los objetos no pertenecen a la categoría.
 *
 * Nota: la categoría `cat` debe poder admitir nuevos objetos. Para
 * nuestro uso pedimos que sea una `FinSet`-categoría construida con
 * los carriers explícitos. En lugar de mutar `cat`, esta función
 * regresa el producto + las proyecciones y deja al cliente
 * reconstruir una categoría extendida si lo necesita.
 */
export declare function product(cat: Category<FinSetObj, FinSetMor>, a: FinSetObj, b: FinSetObj): {
    obj: FinSetObj;
    pi1: FinSetMor;
    pi2: FinSetMor;
    cat: Category<FinSetObj, FinSetMor>;
} | null;
/**
 * Coproducto binario en FinSet: unión disjunta A⊔B. Usa prefijos
 * `L:` y `R:` para tag-ear los elementos y produce las inyecciones
 * canónicas in1, in2.
 */
export declare function coproduct(cat: Category<FinSetObj, FinSetMor>, a: FinSetObj, b: FinSetObj): {
    obj: FinSetObj;
    in1: FinSetMor;
    in2: FinSetMor;
    cat: Category<FinSetObj, FinSetMor>;
} | null;
/**
 * Igualador en FinSet de un par paralelo `f, g : A → B`. El igualador
 * es el subconjunto `E = { x ∈ A | f(x) = g(x) }` con inclusión `eq : E ↪ A`.
 */
export declare function equalizer(cat: Category<FinSetObj, FinSetMor>, f: FinSetMor, g: FinSetMor): {
    obj: FinSetObj;
    eq: FinSetMor;
    cat: Category<FinSetObj, FinSetMor>;
} | null;
/**
 * Coigualador (colimite dual): cociente A/~ donde x ~ y si existe
 * z ∈ S con f(z)=x ∧ g(z)=y (cierre transitivo-simétrico).
 */
export declare function coequalizer(cat: Category<FinSetObj, FinSetMor>, f: FinSetMor, g: FinSetMor): {
    obj: FinSetObj;
    q: FinSetMor;
    cat: Category<FinSetObj, FinSetMor>;
} | null;
//# sourceMappingURL=limits.d.ts.map