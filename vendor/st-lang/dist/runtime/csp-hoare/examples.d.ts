import type { Process } from './types';
/**
 * Máquina expendedora simple: acepta una moneda y luego ofrece al
 * entorno elegir entre té y café.
 *
 *   VM = coin → ((tea → STOP) □ (coffee → STOP))
 *
 * Para uso en bucle infinito, ver `vendingMachineLoop`.
 */
export declare function vendingMachine(): Process;
/** Versión recursiva: tras servir, vuelve al estado inicial. */
export declare function vendingMachineLoop(): Process;
/**
 * Filósofo `i` (dining philosophers a la Hoare): toma su tenedor
 * izquierdo (`L`), luego el derecho (`R`), come, los suelta y repite.
 *
 *   PHIL_i = picks_up.L → picks_up.R → eats → puts_down.R → puts_down.L → STOP
 *
 * El bloqueo clásico aparece cuando todos los filósofos toman primero
 * el izquierdo y luego intentan tomar el derecho: ya nadie lo tendrá
 * libre. Lo detectamos con `isDeadlocked` sobre la composición paralela.
 */
export declare function philosopher(name: string): Process;
/**
 * Composición paralela de `n` filósofos circulares con sus tenedores
 * compartidos. El alfabeto de sincronización es exactamente el conjunto
 * de eventos `pick.*` y `put.*` que comparten filósofo y fork.
 *
 * Con `n ≥ 2` y la estrategia ingenua (todos toman primero el izquierdo)
 * llegamos a deadlock estructural una vez todos hicieron `pick.L`.
 */
export declare function diningPhilosophers(n: number): Process;
//# sourceMappingURL=examples.d.ts.map