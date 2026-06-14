/**
 * Connectors — Mapa de marcador → operador ST
 *
 * Define la correspondencia entre roles discursivos y operadores lógicos ST.
 */
import type { MarkerRole, LogicProfile } from '../types';
/** Operadores ST por tipo de conexión */
export declare const ST_OPERATORS: {
    readonly implication: "->";
    readonly biconditional: "<->";
    readonly conjunction: "&";
    readonly disjunction: "|";
    readonly negation: "!";
    readonly universal: "forall";
    readonly existential: "exists";
    readonly necessity: "[]";
    readonly possibility: "<>";
    readonly temporal_next: "next";
    readonly temporal_until: "until";
    readonly temporal_always: "always";
    readonly temporal_eventually: "eventually";
};
/**
 * Obtiene el operador ST correspondiente a un rol de marcador.
 */
export declare function roleToOperator(role: MarkerRole): string | null;
/**
 * Verifica si un perfil soporta un operador dado.
 */
export declare function profileSupportsOperator(profile: LogicProfile, operator: string): boolean;
//# sourceMappingURL=connectors.d.ts.map