"use strict";
// ============================================================
// Pure-strategy Nash equilibria
// ============================================================
//
// Un perfil puro (s_1, ..., s_n) es Nash sii cada s_i es best
// response del jugador i contra (s_{-i}). Lo verificamos
// enumerando todos los perfiles y comprobando la condición.
Object.defineProperty(exports, "__esModule", { value: true });
exports.findPureNash = findPureNash;
const types_1 = require("./types");
function findPureNash(game) {
    const sizes = game.strategies;
    const total = (0, types_1.totalProfiles)(sizes);
    const equilibria = [];
    for (let idx = 0; idx < total; idx++) {
        const profile = (0, types_1.indexToProfile)(idx, sizes);
        if (isProfileNash(game, profile)) {
            equilibria.push(buildPureEquilibrium(game, profile));
        }
    }
    return equilibria;
}
function isProfileNash(game, profile) {
    const sizes = game.strategies;
    for (let p = 0; p < game.players; p++) {
        const mySize = sizes[p];
        const baseIdx = (0, types_1.profileToIndex)(profile, sizes);
        const row = game.payoffs[p];
        if (!row)
            throw new Error(`payoff missing for player ${p}`);
        const curU = row[baseIdx];
        for (let alt = 0; alt < mySize; alt++) {
            if (alt === profile[p])
                continue;
            const altProfile = profile.slice();
            altProfile[p] = alt;
            const altIdx = (0, types_1.profileToIndex)(altProfile, sizes);
            const altU = row[altIdx];
            if (altU > curU + 1e-12)
                return false;
        }
    }
    return true;
}
function isStrictPureNash(game, profile) {
    const sizes = game.strategies;
    for (let p = 0; p < game.players; p++) {
        const mySize = sizes[p];
        const baseIdx = (0, types_1.profileToIndex)(profile, sizes);
        const row = game.payoffs[p];
        if (!row)
            throw new Error(`payoff missing for player ${p}`);
        const curU = row[baseIdx];
        for (let alt = 0; alt < mySize; alt++) {
            if (alt === profile[p])
                continue;
            const altProfile = profile.slice();
            altProfile[p] = alt;
            const altIdx = (0, types_1.profileToIndex)(altProfile, sizes);
            const altU = row[altIdx];
            if (altU >= curU - 1e-12)
                return false;
        }
    }
    return true;
}
function buildPureEquilibrium(game, profile) {
    const sizes = game.strategies;
    const strategies = profile.map((s, p) => ({
        player: p,
        distribution: (0, types_1.pureDistribution)(s, sizes[p]),
    }));
    const dists = strategies.map((s) => s.distribution);
    const payoffs = new Array(game.players);
    for (let p = 0; p < game.players; p++) {
        payoffs[p] = (0, types_1.expectedPayoffFromDistributions)(game, p, dists);
    }
    return {
        strategies,
        payoffs,
        isPure: true,
        isStrict: isStrictPureNash(game, profile),
    };
}
//# sourceMappingURL=pure-nash.js.map