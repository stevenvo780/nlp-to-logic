"use strict";
// ============================================================
// Markov Logic — Grounding de fórmulas
// ============================================================
//
// `ground(theory)` produce TODAS las instancias cerradas (sin
// variables libres) de cada fórmula de la teoría, una por
// combinación de constantes compatible con los tipos del
// predicado en el que aparece la variable.
//
// La inferencia de tipos por variable se hace en una primera pasada
// sobre la fórmula: por cada átomo `Pred(x, y, ...)` consultamos
// `predicates[Pred].types` y asignamos el tipo de cada argumento a la
// variable correspondiente. Si la misma variable aparece en dos
// posiciones tipadas distintamente, se reporta error (typing claro
// como pide la convención del workspace).
Object.defineProperty(exports, "__esModule", { value: true });
exports.atomKey = atomKey;
exports.evaluateGround = evaluateGround;
exports.renderGround = renderGround;
exports.groundFormula = groundFormula;
exports.ground = ground;
exports.allGroundAtoms = allGroundAtoms;
const parser_1 = require("./parser");
function buildPredicateMap(theory) {
    const out = {};
    for (const p of theory.predicates) {
        out[p.name] = p.types;
    }
    return out;
}
/** Recorre `node` y devuelve `{ variable → tipo }` inferido. */
function inferVariableTypes(node, predMap, src) {
    const out = {};
    const visit = (n) => {
        switch (n.kind) {
            case 'atom': {
                const types = predMap[n.predicate];
                if (!types) {
                    throw new Error(`Predicado "${n.predicate}" no declarado (fórmula: "${src}")`);
                }
                if (types.length !== n.args.length) {
                    throw new Error(`Predicado "${n.predicate}" espera ${types.length} args, recibió ${n.args.length} (fórmula: "${src}")`);
                }
                for (let i = 0; i < n.args.length; i++) {
                    const arg = n.args[i];
                    const t = types[i];
                    if ((0, parser_1.isVariable)(arg)) {
                        const prev = out[arg];
                        if (prev !== undefined && prev !== t) {
                            throw new Error(`Variable "${arg}" usada con tipos distintos: "${prev}" vs "${t}" en "${src}"`);
                        }
                        out[arg] = t;
                    }
                }
                return;
            }
            case 'not':
                visit(n.arg);
                return;
            case 'and':
            case 'or':
            case 'implies':
                visit(n.left);
                visit(n.right);
                return;
        }
    };
    visit(node);
    return out;
}
/** Sustituye variables → constantes y devuelve nuevo nodo. */
function substitute(node, sub) {
    switch (node.kind) {
        case 'atom':
            return {
                kind: 'atom',
                predicate: node.predicate,
                args: node.args.map((a) => ((0, parser_1.isVariable)(a) && sub[a] !== undefined ? sub[a] : a)),
            };
        case 'not':
            return { kind: 'not', arg: substitute(node.arg, sub) };
        case 'and':
            return { kind: 'and', left: substitute(node.left, sub), right: substitute(node.right, sub) };
        case 'or':
            return { kind: 'or', left: substitute(node.left, sub), right: substitute(node.right, sub) };
        case 'implies':
            return {
                kind: 'implies',
                left: substitute(node.left, sub),
                right: substitute(node.right, sub),
            };
    }
}
/** Canonical key para un ground atom: "Pred(a1,a2,...)". */
function atomKey(predicate, args) {
    return `${predicate}(${args.join(',')})`;
}
/** Recopila los atom keys que aparecen en `node`. */
function collectAtoms(node, acc) {
    switch (node.kind) {
        case 'atom':
            acc.add(atomKey(node.predicate, node.args));
            return;
        case 'not':
            collectAtoms(node.arg, acc);
            return;
        case 'and':
        case 'or':
        case 'implies':
            collectAtoms(node.left, acc);
            collectAtoms(node.right, acc);
            return;
    }
}
/** Evalúa un nodo ya groundeado contra un mundo. */
function evaluateGround(node, world) {
    switch (node.kind) {
        case 'atom': {
            const key = atomKey(node.predicate, node.args);
            return world.groundAtoms[key] === true;
        }
        case 'not':
            return !evaluateGround(node.arg, world);
        case 'and':
            return evaluateGround(node.left, world) && evaluateGround(node.right, world);
        case 'or':
            return evaluateGround(node.left, world) || evaluateGround(node.right, world);
        case 'implies':
            return !evaluateGround(node.left, world) || evaluateGround(node.right, world);
    }
}
/** Renderiza un nodo groundeado a string canónico. */
function renderGround(node) {
    switch (node.kind) {
        case 'atom':
            return atomKey(node.predicate, node.args);
        case 'not':
            return `¬${renderGround(node.arg)}`;
        case 'and':
            return `(${renderGround(node.left)} ∧ ${renderGround(node.right)})`;
        case 'or':
            return `(${renderGround(node.left)} ∨ ${renderGround(node.right)})`;
        case 'implies':
            return `(${renderGround(node.left)} → ${renderGround(node.right)})`;
    }
}
/** Producto cartesiano de los dominios de cada variable. */
function cartesian(vars, varTypes, constants, src) {
    if (vars.length === 0)
        return [{}];
    // build domain per var
    const domains = vars.map((v) => {
        const t = varTypes[v];
        if (!t) {
            throw new Error(`No pude inferir el tipo de la variable "${v}" en "${src}"`);
        }
        const dom = constants[t];
        if (!dom) {
            throw new Error(`Tipo "${t}" no tiene constantes declaradas (fórmula: "${src}")`);
        }
        return dom;
    });
    const out = [];
    const buf = new Array(vars.length).fill('');
    const rec = (i) => {
        if (i === vars.length) {
            const sub = {};
            for (let j = 0; j < vars.length; j++) {
                sub[vars[j]] = buf[j] ?? '';
            }
            out.push(sub);
            return;
        }
        const dom = domains[i];
        for (const c of dom) {
            buf[i] = c;
            rec(i + 1);
        }
    };
    rec(0);
    return out;
}
/** Groundea una sola fórmula. */
function groundFormula(formula, predMap, constants) {
    const ast = (0, parser_1.parseFOL)(formula.formula);
    const varTypes = inferVariableTypes(ast, predMap, formula.formula);
    const vars = (0, parser_1.freeVariables)(ast);
    const subs = cartesian(vars, varTypes, constants, formula.formula);
    const out = [];
    for (const sub of subs) {
        const ground = substitute(ast, sub);
        const atomSet = new Set();
        collectAtoms(ground, atomSet);
        const atoms = Array.from(atomSet);
        out.push({
            groundFormula: renderGround(ground),
            weight: formula.weight,
            satisfied: (w) => evaluateGround(ground, w),
            violations: (w) => (evaluateGround(ground, w) ? 0 : 1),
            atoms,
        });
    }
    return out;
}
/** Groundea TODAS las fórmulas de la teoría. */
function ground(theory) {
    const predMap = buildPredicateMap(theory);
    const out = [];
    for (const f of theory.formulas) {
        for (const g of groundFormula(f, predMap, constantsOf(theory))) {
            out.push(g);
        }
    }
    return out;
}
function constantsOf(theory) {
    return theory.constants;
}
/** Enumera TODOS los ground atoms de la teoría (Herbrand base). */
function allGroundAtoms(theory) {
    const out = [];
    for (const p of theory.predicates) {
        const arity = p.types.length;
        if (arity === 0) {
            out.push(atomKey(p.name, []));
            continue;
        }
        // cartesian over each arg's type
        const domains = p.types.map((t) => {
            const d = theory.constants[t];
            if (!d)
                throw new Error(`Tipo "${t}" sin constantes (predicado "${p.name}")`);
            return d;
        });
        const buf = new Array(arity).fill('');
        const rec = (i) => {
            if (i === arity) {
                out.push(atomKey(p.name, buf.slice()));
                return;
            }
            const dom = domains[i];
            for (const c of dom) {
                buf[i] = c;
                rec(i + 1);
            }
        };
        rec(0);
    }
    return out;
}
//# sourceMappingURL=grounding.js.map