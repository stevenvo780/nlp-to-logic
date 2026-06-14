"use strict";
// ============================================================
// Proof Nets — Construcción a partir de un secuente
// ============================================================
//
// Dado ⊢ Γ con Γ una lista de fórmulas MLL, esta construcción
// produce un net candidato:
//
//   1. Para cada fórmula F_i de Γ se construye recursivamente su
//      "árbol de descomposición": cada nodo interno se cablea con
//      el link correspondiente (⊗ o ⅋), terminando en hojas que
//      son átomos.
//   2. Los átomos hoja se emparejan por pares duales (A con A⊥)
//      vía axiom links. El pairing es greedy: para cada átomo
//      libre busca su primer dual libre.
//
// El net producido puede o no ser correcto: si Γ no es probable
// en MLL la correctitud Danos-Regnier fallará. Las conclusiones
// son las raíces de los árboles de descomposición.
Object.defineProperty(exports, "__esModule", { value: true });
exports.constructFromSequent = constructFromSequent;
const types_1 = require("./types");
function freshNode(b, formula) {
    const id = b.nextId++;
    b.nodes.push({ id, formula });
    return id;
}
// Construye el árbol de descomposición de `f`. Devuelve el id del
// nodo raíz y la lista de ids de las hojas-átomo en orden de
// recorrido en profundidad por la izquierda.
function buildFormulaTree(b, f) {
    if (f.kind === 'atom') {
        const id = freshNode(b, f);
        return { root: id, atomLeaves: [id] };
    }
    const left = buildFormulaTree(b, f.left);
    const right = buildFormulaTree(b, f.right);
    const root = freshNode(b, f);
    b.links.push({
        kind: f.kind === 'tensor' ? 'tensor' : 'par',
        ports: [left.root, right.root, root],
    });
    return {
        root,
        atomLeaves: [...left.atomLeaves, ...right.atomLeaves],
    };
}
function constructFromSequent(formulas) {
    const b = { nodes: [], links: [], nextId: 0 };
    const conclusions = [];
    const atomLeaves = [];
    for (const f of formulas) {
        const tree = buildFormulaTree(b, f);
        conclusions.push(tree.root);
        atomLeaves.push(...tree.atomLeaves);
    }
    // Pairing greedy: para cada hoja sin asignar, busca la primera
    // hoja dual sin asignar y crea un axiom link entre ambas.
    const taken = new Set();
    for (const i of atomLeaves) {
        if (taken.has(i))
            continue;
        const fi = b.nodes[i].formula;
        let partner = null;
        for (const j of atomLeaves) {
            if (j === i || taken.has(j))
                continue;
            const fj = b.nodes[j].formula;
            if ((0, types_1.formulaEquals)(fj, (0, types_1.dual)(fi))) {
                partner = j;
                break;
            }
        }
        if (partner === null) {
            // Átomo sin par: se deja libre. El criterio de corrección
            // detectará la inconsistencia (componente desconexa).
            continue;
        }
        taken.add(i);
        taken.add(partner);
        b.links.push({ kind: 'axiom', ports: [i, partner] });
    }
    return { nodes: b.nodes, links: b.links, conclusions };
}
//# sourceMappingURL=construct.js.map