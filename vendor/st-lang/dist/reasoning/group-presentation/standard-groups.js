"use strict";
// ============================================================
// Presentaciones canónicas de familias clásicas de grupos.
// ============================================================
//
// • Z_n  = ⟨a | a^n⟩
// • D_n  = ⟨r, s | r^n, s², (rs)²⟩    (dihedral de orden 2n)
// • F_n  grupo libre de rango n (sin relaciones)
// • S_n  presentación de Coxeter:
//     generadores t_1,...,t_{n-1} (transposiciones adyacentes)
//     relaciones t_i² = 1, (t_i t_{i+1})³ = 1, (t_i t_j)² = 1 si |i-j|≥2.
//   En nuestro alfabeto las letras se mapean a 'a', 'b', 'c', ...
//   con su inverso en mayúscula (aunque por ser involuciones cada
//   inverso coincide consigo mismo módulo la relación t² = 1).
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.cyclicGroupZn = cyclicGroupZn;
exports.dihedralGroupDn = dihedralGroupDn;
exports.freeGroupFn = freeGroupFn;
exports.symmetricGroupSn = symmetricGroupSn;
// repeat: helper para construir g^k.
function power(letter, k) {
    const w = [];
    for (let i = 0; i < k; i++)
        w.push(letter);
    return w;
}
function cyclicGroupZn(n) {
    if (n < 1)
        throw new Error(`cyclicGroupZn: n debe ser ≥1, recibí ${n}`);
    return {
        generators: ['a'],
        relations: [power('a', n)],
    };
}
function dihedralGroupDn(n) {
    if (n < 2)
        throw new Error(`dihedralGroupDn: n debe ser ≥2, recibí ${n}`);
    // r^n
    const rPowN = power('r', n);
    // s^2
    const sSq = ['s', 's'];
    // (rs)^2
    const rsSq = ['r', 's', 'r', 's'];
    return {
        generators: ['r', 's'],
        relations: [rPowN, sSq, rsSq],
    };
}
function freeGroupFn(n) {
    if (n < 0)
        throw new Error(`freeGroupFn: n debe ser ≥0, recibí ${n}`);
    const gens = [];
    for (let i = 0; i < n; i++) {
        gens.push(String.fromCharCode(97 + i)); // a, b, c, ...
    }
    return {
        generators: gens,
        relations: [],
    };
}
function symmetricGroupSn(n) {
    if (n < 1)
        throw new Error(`symmetricGroupSn: n debe ser ≥1, recibí ${n}`);
    if (n === 1)
        return { generators: [], relations: [] }; // trivial
    // generadores: a, b, c, ... (n-1 letras)
    const k = n - 1;
    const gens = [];
    for (let i = 0; i < k; i++)
        gens.push(String.fromCharCode(97 + i));
    const relations = [];
    // t_i² = 1
    for (const g of gens)
        relations.push([g, g]);
    // (t_i t_{i+1})³ = 1 — adyacentes "braid relation" trenza con
    // exponente 3 da relaciones simétricas.
    for (let i = 0; i < gens.length - 1; i++) {
        const a = gens[i];
        const b = gens[i + 1];
        relations.push([a, b, a, b, a, b]);
    }
    // (t_i t_j)² = 1 si |i-j| ≥ 2 (conmutan)
    for (let i = 0; i < gens.length; i++) {
        for (let j = i + 2; j < gens.length; j++) {
            const a = gens[i];
            const b = gens[j];
            relations.push([a, b, a, b]);
        }
    }
    return { generators: gens, relations };
}
//# sourceMappingURL=standard-groups.js.map