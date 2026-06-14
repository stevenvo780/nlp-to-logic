/**
 * Un agente con valuation sobre outcomes. Cada outcome se identifica
 * con un string (típicamente itemId, pero puede codificar bundles
 * para combinatorial auctions, e.g. "A+B").
 */
export interface Agent {
    id: string;
    /** valuation.get(outcome) = utilidad si recibe ese outcome. Default 0 si missing. */
    valuation: Map<string, number>;
}
/**
 * Resultado de un mechanism: quién se queda con qué y cuánto paga.
 */
export interface MechanismOutcome {
    /** allocation.get(agentId) = item que recibe (o undefined si no recibe). */
    allocation: Map<string, string>;
    /** payments.get(agentId) = pago del agente al mechanism (>= 0 típicamente). */
    payments: Map<string, number>;
}
/**
 * Resultado de una single-item auction.
 */
export interface AuctionResult {
    /** Id del ganador (o '' si nadie supera el reserve / no hay bids). */
    winner: string;
    /** Pago del ganador. 0 si no hubo ganador. */
    payment: number;
}
/**
 * Auction con bids sealed (cada bidder reporta un valor secreto).
 */
export interface SealedBidAuction {
    bids: Map<string, number>;
}
/**
 * Distribución (i.i.d. por bidder) sobre la valuation. Necesitamos CDF
 * y PDF en cerrado para Myerson; el dominio acota el soporte.
 */
export interface BidderDistribution {
    cdf: (v: number) => number;
    pdf: (v: number) => number;
    domain: [number, number];
}
//# sourceMappingURL=types.d.ts.map