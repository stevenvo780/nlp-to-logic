"use strict";
// ============================================================
// Lemke-Howson — algoritmo de pivot para Nash de 2-player games
// ============================================================
//
// Versión clásica con tableros. Idea:
//
//   - Normalizamos pagos para que sean estrictamente positivos
//     (sumando un constante grande). Esto no cambia los Nash.
//   - Trabajamos con dos sistemas en variables x ∈ R^n, y ∈ R^m
//     más slacks r ∈ R^n, s ∈ R^m:
//         B^T x + r = 1   con x ≥ 0, r ≥ 0
//         A   y + s = 1   con y ≥ 0, s ≥ 0
//     donde A es la matriz de pagos del jugador 1 (NxM) y B la
//     de pagos del jugador 2 (NxM).
//   - Cada variable tiene una "etiqueta" en {1..n+m}. En un
//     vértice completamente etiquetado (Nash), para cada label l
//     o bien la variable es no-básica (= 0) o su complemento lo es.
//   - Empezar en el vértice trivial (x=0, y=0; r=s=1) — todas las
//     etiquetas están "cubiertas" por las variables no-básicas.
//     Soltamos una etiqueta `startLabel` y pivotamos hasta volver
//     a un vértice completamente etiquetado.
//
// Este algoritmo encuentra UN equilibrio (no necesariamente todos).
// Cambiar `startLabel` puede llevar a equilibria distintos.
//
// Implementación pedagógica: O(n+m) pivotes en práctica.
// El soporte que ya teníamos (support enumeration) sirve para juegos
// chicos. Lemke-Howson es alternativa para tamaños medios o cuando
// uno quiere "algún" Nash rápido.
Object.defineProperty(exports, "__esModule", { value: true });
exports.lemkeHowson = lemkeHowson;
const types_1 = require("./types");
const TOL = 1e-9;
function lemkeHowson(game, startLabel = 0) {
    if (game.players !== 2) {
        throw new Error('lemkeHowson supports only 2-player games');
    }
    const n = game.strategies[0];
    const m = game.strategies[1];
    if (startLabel < 0 || startLabel >= n + m) {
        throw new Error(`startLabel ${startLabel} out of range [0, ${n + m})`);
    }
    const a1 = game.payoffs[0];
    const a2 = game.payoffs[1];
    // Construir matrices A (jugador 1) y B (jugador 2)
    const A = [];
    const B = [];
    for (let i = 0; i < n; i++) {
        const rowA = [];
        const rowB = [];
        for (let j = 0; j < m; j++) {
            rowA.push(a1[i * m + j]);
            rowB.push(a2[i * m + j]);
        }
        A.push(rowA);
        B.push(rowB);
    }
    // Shift para que sean positivos
    let minVal = Infinity;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
            const av = A[i][j];
            const bv = B[i][j];
            if (av < minVal)
                minVal = av;
            if (bv < minVal)
                minVal = bv;
        }
    }
    const shift = minVal <= 0 ? 1 - minVal : 0;
    if (shift !== 0) {
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < m; j++) {
                A[i][j] = A[i][j] + shift;
                B[i][j] = B[i][j] + shift;
            }
        }
    }
    const labelOf = (v) => {
        if (v.kind === 0 || v.kind === 1)
            return v.index;
        return n + v.index;
    };
    const complementOf = (v) => {
        if (v.kind === 0)
            return { kind: 1, index: v.index };
        if (v.kind === 1)
            return { kind: 0, index: v.index };
        if (v.kind === 2)
            return { kind: 3, index: v.index };
        return { kind: 2, index: v.index };
    };
    // System 1: B^T para que las filas sean ecuaciones indexadas por j.
    const S1 = { mat: [], rhs: [] };
    for (let j = 0; j < m; j++) {
        const row = [];
        for (let i = 0; i < n; i++)
            row.push(B[i][j]);
        S1.mat.push(row);
        S1.rhs.push(1);
    }
    const S1_basic = Array.from({ length: m }, (_, j) => ({ kind: 3, index: j }));
    const S1_nonbasic = Array.from({ length: n }, (_, i) => ({ kind: 0, index: i }));
    const S2 = { mat: [], rhs: [] };
    for (let i = 0; i < n; i++) {
        const row = [];
        for (let j = 0; j < m; j++)
            row.push(A[i][j]);
        S2.mat.push(row);
        S2.rhs.push(1);
    }
    const S2_basic = Array.from({ length: n }, (_, i) => ({ kind: 1, index: i }));
    const S2_nonbasic = Array.from({ length: m }, (_, j) => ({ kind: 2, index: j }));
    // Pivot: pasar una no-básica `enter` a básica en el sistema que le
    // corresponde, y sacar de la base la que pierda con la regla del
    // cociente mínimo. Devuelve la variable que sale (Var) o null si
    // el sistema es ilimitado (no debería pasar con shift > 0).
    function pivotIn(sys, enter) {
        const S = sys === 'S1' ? S1 : S2;
        const nonbasic = sys === 'S1' ? S1_nonbasic : S2_nonbasic;
        const basic = sys === 'S1' ? S1_basic : S2_basic;
        // columna de `enter` en `nonbasic`
        let col = -1;
        for (let c = 0; c < nonbasic.length; c++) {
            const v = nonbasic[c];
            if (v.kind === enter.kind && v.index === enter.index) {
                col = c;
                break;
            }
        }
        if (col < 0)
            return null;
        // Min ratio: filas con coef > 0 de la columna entrante
        let bestRow = -1;
        let bestRatio = Infinity;
        for (let r = 0; r < S.mat.length; r++) {
            const coef = S.mat[r][col];
            if (coef <= TOL)
                continue;
            const ratio = S.rhs[r] / coef;
            if (ratio < bestRatio - TOL) {
                bestRatio = ratio;
                bestRow = r;
            }
        }
        if (bestRow < 0)
            return null; // unbounded
        // Pivot Gauss-Jordan en (bestRow, col)
        const pivot = S.mat[bestRow][col];
        const pivRow = S.mat[bestRow];
        for (let c = 0; c < pivRow.length; c++)
            pivRow[c] = pivRow[c] / pivot;
        S.rhs[bestRow] = S.rhs[bestRow] / pivot;
        for (let r = 0; r < S.mat.length; r++) {
            if (r === bestRow)
                continue;
            const rowR = S.mat[r];
            const factor = rowR[col];
            if (factor === 0)
                continue;
            for (let c = 0; c < rowR.length; c++) {
                rowR[c] = rowR[c] - factor * pivRow[c];
            }
            S.rhs[r] = S.rhs[r] - factor * S.rhs[bestRow];
        }
        const leaving = basic[bestRow];
        basic[bestRow] = enter;
        nonbasic[col] = leaving;
        return leaving;
    }
    // Selección de pivote inicial: la variable cuyo label es `startLabel`.
    // Esa variable está en `nonbasic` de uno de los dos sistemas.
    let entering;
    if (startLabel < n) {
        entering = { kind: 0, index: startLabel }; // x_{startLabel}
    }
    else {
        entering = { kind: 2, index: startLabel - n }; // y_{startLabel-n}
    }
    // Pivotear hasta que la complementaria del start vuelva a estar en
    // la base, o hasta exceder un budget para evitar loops.
    const maxIter = 4 * (n + m) * (n + m) + 50;
    let currentSystem = entering.kind === 0 ? 'S1' : 'S2';
    for (let iter = 0; iter < maxIter; iter++) {
        const leaving = pivotIn(currentSystem, entering);
        if (leaving === null)
            return null; // unbounded → no Nash recovered
        // Si la saliente es la complementaria de la variable que originalmente
        // soltamos (startLabel), terminamos.
        if (labelOf(leaving) === startLabel)
            break;
        // Caso contrario: la nueva entrante es la complementaria de la saliente,
        // en el sistema opuesto.
        entering = complementOf(leaving);
        currentSystem = entering.kind === 0 || entering.kind === 1 ? 'S1' : 'S2';
        // Pero entrar como x o como r requiere que la variable sea no-básica
        // en su sistema. x_i / r_i son complementarias y ambas viven asociadas
        // a S1. Igual y/s respecto a S2.
        if (currentSystem === 'S1') {
            // las no-básicas de S1 son x_*, las básicas son s_* o r_* o lo que
            // hayamos pivoteado. Si la variable a entrar es r_i, debe entrar a
            // S1 si está no-básica allí.
            currentSystem = 'S1';
        }
        else {
            currentSystem = 'S2';
        }
        // Si la entrante no está actualmente no-básica en S{1,2}, intercambiar
        // sistemas.
        const candidateSet = currentSystem === 'S1' ? S1_nonbasic : S2_nonbasic;
        let found = false;
        for (const v of candidateSet) {
            if (v.kind === entering.kind && v.index === entering.index) {
                found = true;
                break;
            }
        }
        if (!found) {
            currentSystem = currentSystem === 'S1' ? 'S2' : 'S1';
        }
    }
    // Extraer x e y de las básicas
    const xVec = new Array(n).fill(0);
    const yVec = new Array(m).fill(0);
    for (let r = 0; r < S1_basic.length; r++) {
        const v = S1_basic[r];
        if (v.kind === 0)
            xVec[v.index] = S1.rhs[r]; // x_i
    }
    for (let r = 0; r < S2_basic.length; r++) {
        const v = S2_basic[r];
        if (v.kind === 2)
            yVec[v.index] = S2.rhs[r]; // y_j
    }
    // Si todo terminó en (0, 0) volvimos al inicial → no encontró Nash.
    const sumX = xVec.reduce((s, v) => s + v, 0);
    const sumY = yVec.reduce((s, v) => s + v, 0);
    if (sumX < TOL || sumY < TOL)
        return null;
    // Normalizar a distribuciones de probabilidad
    const p = xVec.map((v) => v / sumX);
    const q = yVec.map((v) => v / sumY);
    // Clean up negativos por ruido numérico
    for (let i = 0; i < p.length; i++)
        if (p[i] < 0 && p[i] > -TOL)
            p[i] = 0;
    for (let j = 0; j < q.length; j++)
        if (q[j] < 0 && q[j] > -TOL)
            q[j] = 0;
    const dists = [p, q];
    const payoffs = [
        (0, types_1.expectedPayoffFromDistributions)(game, 0, dists),
        (0, types_1.expectedPayoffFromDistributions)(game, 1, dists),
    ];
    const supportP = p.filter((x) => x > TOL).length;
    const supportQ = q.filter((x) => x > TOL).length;
    const isPure = supportP === 1 && supportQ === 1;
    return {
        strategies: [
            { player: 0, distribution: p },
            { player: 1, distribution: q },
        ],
        payoffs,
        isPure,
        isStrict: false,
    };
}
//# sourceMappingURL=lemke-howson.js.map