import type { Fact, GroundedAction, STRIPSAction } from './types';
/**
 * Sustituye variables `?var` por sus valores ligados en una cadena.
 * Si la variable no está en bindings, se deja como está (permite
 * grounding parcial / debugging).
 */
export declare function substituteVars(text: string, bindings: Record<string, string>): string;
/**
 * Aplica un binding a un schema y devuelve una acción ground.
 *
 * No valida que el binding cubra todos los parámetros: lo que falte
 * queda con `?var` en el string (caller's responsibility validar).
 */
export declare function ground(action: STRIPSAction, bindings: Record<string, string>): GroundedAction;
/**
 * Aplica una acción ground a un estado, devolviendo un nuevo estado.
 *
 * Convención STRIPS estándar: primero se borran los hechos en delList,
 * luego se añaden los de addList. Si un hecho está en ambos, el
 * resultado neto es "añadido" (delete antes que add).
 *
 * NO valida preconditions — esa verificación se hace en el planner
 * antes de invocar applyAction. (Permite usarlo para forward search
 * sin redundancia.)
 */
export declare function applyAction(state: Set<Fact>, grounded: {
    addList: Set<Fact>;
    delList: Set<Fact>;
}): Set<Fact>;
/**
 * Chequea si un estado satisface las preconditions de una acción
 * ground (todas presentes).
 */
export declare function preconditionsSatisfied(state: Set<Fact>, preconditions: Set<Fact>): boolean;
/**
 * Chequea si un estado satisface el goal (goal ⊆ state).
 */
export declare function goalSatisfied(state: Set<Fact>, goal: Set<Fact>): boolean;
/**
 * Enumera el producto cartesiano de objetos para los parámetros de
 * una acción y devuelve TODAS las acciones ground posibles.
 *
 * Si el dominio tiene tipos en `objects`, por simplicidad enumeramos
 * sobre `flatObjects = union(values of objects)`. Quien necesite
 * tipos más finos puede pre-filtrar las acciones ground devueltas.
 *
 * Para |params|=2 con |objs|=10 → 100 acciones ground por schema. Es
 * fácil que esto explote, así que el planner aplica `preconditionsSatisfied`
 * como filtro early y typically la mayoría se podan.
 */
export declare function groundAll(action: STRIPSAction, objects: Record<string, string[]>): Array<{
    bindings: Record<string, string>;
    grounded: GroundedAction;
}>;
//# sourceMappingURL=ground.d.ts.map