import type { BidderDistribution, AuctionResult } from './types';
/**
 * Virtual valuation φ(v) = v - (1 - F(v)) / f(v).
 *
 * Si f(v) ≈ 0 retornamos +Infinity (límite del término penalty).
 * Si v cae fuera del dominio, devolvemos -Infinity (no participa).
 */
export declare function virtualValuation(v: number, dist: BidderDistribution): number;
/**
 * Resuelve φ(r) = 0 por bisección en el dominio de la distribución.
 *
 * Si φ(lo) >= 0, devuelve lo. Si φ(hi) <= 0, devuelve hi. Si no, busca
 * con tolerancia 1e-8 en 80 iteraciones.
 *
 * Asume regularidad de la distribución (φ monótona creciente). En
 * uniform[0,1]: φ(v) = 2v - 1, raíz en 1/2. ✔
 */
export declare function findReserve(dist: BidderDistribution): number;
/**
 * Myerson optimal auction (single-item).
 *
 * - Si todos los φ_i(bid_i) son negativos → no se vende. winner='',
 *   payment=0, reserve = φ_i^(-1)(0) del primer bidder (referencia).
 *
 * - Si el ganador es bidder i (max φ), paga el menor v' tal que
 *   reportar v' lo habría hecho ganar:
 *
 *     paymentValue = max( reserve_i, min_v { v : φ_i(v) >= max_{j≠i} φ_j(bid_j) } )
 *
 *   En el caso IID con simétria, esto es:
 *     paymentValue = max( reserve, secondHighestBid )
 *
 *   que es exactamente Vickrey con reserve.
 */
export declare function myersonOptimal(bids: Map<string, number>, distributions: Map<string, BidderDistribution>): {
    winner: string;
    payment: number;
    reserve: number;
};
/**
 * Muestrea una valuation de una distribución por inverse-CDF
 * sampling. Usamos bisección sobre F.
 */
export declare function sampleFromDistribution(dist: BidderDistribution, u: number): number;
/**
 * Expected revenue de un mechanism via Monte Carlo: muestreamos
 * `samples` perfiles de bids (cada bidder draw de su distribución
 * independientemente, asumiendo truthful bidding para 2nd-price /
 * Myerson, o equilibrium bidding aproximado para 1st-price), corremos
 * el mechanism y promediamos el payment del ganador.
 *
 * Nota: para 1st-price con IID uniform[0,1] y n bidders, el bid
 * de equilibrio es b(v) = (n-1)/n · v. El caller debe pasar un
 * mechanism que ya implemente ese mapping si quiere comparar contra
 * 2nd-price truthful.
 */
export declare function expectedRevenue(mechanism: (bids: Map<string, number>) => AuctionResult, distributions: Map<string, BidderDistribution>, samples?: number): number;
/**
 * Helper: distribución uniform sobre [a, b]. Útil para tests.
 * (No exportada en index — solo helper interno aquí; los tests
 * pueden importarlo directamente.)
 */
export declare function uniformDistribution(a: number, b: number): BidderDistribution;
//# sourceMappingURL=myerson.d.ts.map