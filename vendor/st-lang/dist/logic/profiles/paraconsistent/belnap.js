"use strict";
// ============================================================
// ST Belnap — Motor Paraconsistente de 4 Valores
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParaconsistentBelnap = void 0;
const propositional_1 = require("../classical/propositional");
const VALUES = ['T', 'F', 'B', 'N'];
/**
 * Semántica de Belnap (Lattice-based):
 * Negación: intercambia T/F, mantiene B/N.
 * And: Mínimo en el retículo de información.
 * Or: Máximo en el retículo de información.
 */
const BELNAP_NOT = {
    T: 'F',
    F: 'T',
    B: 'B',
    N: 'N',
};
// Orden de información (Truth lattice): F < B,N < T
// Para simplificar, usamos una matriz de resultados
const BELNAP_AND = {
    T: { T: 'T', F: 'F', B: 'B', N: 'N' },
    F: { T: 'F', F: 'F', B: 'F', N: 'F' },
    B: { T: 'B', F: 'F', B: 'B', N: 'F' },
    N: { T: 'N', F: 'F', B: 'F', N: 'N' },
};
const BELNAP_OR = {
    T: { T: 'T', F: 'T', B: 'T', N: 'T' },
    F: { T: 'T', F: 'F', B: 'B', N: 'N' },
    B: { T: 'T', F: 'B', B: 'B', N: 'T' },
    N: { T: 'T', F: 'N', B: 'T', N: 'N' },
};
function evaluateBelnapBitset(formula, atoms) {
    const n = atoms.length;
    if (n > 13)
        throw new Error('Demasiadas variables para tabla Belnap bitset (>13)');
    const total = Math.pow(4, n);
    const atomPos = new Map();
    const atomNeg = new Map();
    for (let j = 0; j < n; j++) {
        let pos = 0n;
        let neg = 0n;
        const period = Math.pow(4, n - 1 - j);
        for (let i = 0; i < total; i++) {
            const val = Math.floor(i / period) % 4;
            const bit = 1n << BigInt(i);
            // 0=T(1,0), 1=F(0,1), 2=B(1,1), 3=N(0,0)
            if (val === 0 || val === 2)
                pos |= bit;
            if (val === 1 || val === 2)
                neg |= bit;
        }
        atomPos.set(atoms[j], pos);
        atomNeg.set(atoms[j], neg);
    }
    function evalBelnap(f) {
        const args = f.args || [];
        switch (f.kind) {
            case 'atom': {
                const name = f.name ?? '';
                return { pos: atomPos.get(name) ?? 0n, neg: atomNeg.get(name) ?? 0n };
            }
            case 'not': {
                const inner = evalBelnap(args[0]);
                return { pos: inner.neg, neg: inner.pos };
            }
            case 'and': {
                const l = evalBelnap(args[0]);
                const r = evalBelnap(args[1]);
                return { pos: l.pos & r.pos, neg: l.neg | r.neg };
            }
            case 'or': {
                const l = evalBelnap(args[0]);
                const r = evalBelnap(args[1]);
                return { pos: l.pos | r.pos, neg: l.neg & r.neg };
            }
            case 'implies': {
                // !A | B
                const l = evalBelnap(args[0]);
                const r = evalBelnap(args[1]);
                return { pos: l.neg | r.pos, neg: l.pos & r.neg };
            }
            case 'biconditional': {
                // (A->B) & (B->A)
                const l = evalBelnap(args[0]);
                const r = evalBelnap(args[1]);
                const aToB = { pos: l.neg | r.pos, neg: l.pos & r.neg };
                const bToA = { pos: r.neg | l.pos, neg: r.pos & l.neg };
                return { pos: aToB.pos & bToA.pos, neg: aToB.neg | bToA.neg };
            }
            default:
                throw new Error(`Operador no soportado en evaluación Belnap bitset: ${f.kind}`);
        }
    }
    const result = evalBelnap(formula);
    return { pos: result.pos, neg: result.neg, total };
}
function isBelnapPure(f) {
    switch (f.kind) {
        case 'atom':
            return true;
        case 'not':
        case 'and':
        case 'or':
        case 'implies':
        case 'biconditional':
            return (f.args || []).every(isBelnapPure);
        default:
            return false;
    }
}
function belnapValueFromBits(pos, neg) {
    if (pos && !neg)
        return 'T';
    if (!pos && neg)
        return 'F';
    if (pos && neg)
        return 'B';
    return 'N';
}
class ParaconsistentBelnap {
    name = 'paraconsistent.belnap';
    description = 'Logica paraconsistente de Belnap (4-valued: T, F, Both, None)';
    checkWellFormed(formula) {
        // Reutilizamos la validación proposicional, ya que la sintaxis es idéntica
        const diags = [];
        const check = (f) => {
            if (f.kind === 'atom' && !f.name) {
                diags.push({ severity: 'error', message: 'Atomo sin nombre' });
            }
            if (f.args) {
                for (const arg of f.args)
                    check(arg);
            }
        };
        check(formula);
        return diags;
    }
    /**
     * En Belnap, una fórmula es válida si siempre evalúa a un valor "designado" (T o B).
     */
    checkValid(formula) {
        const tt = this.generateBelnapTable(formula);
        const designated = new Set(['T', 'B']);
        const isTautology = tt.rows.every((r) => designated.has(String(r.result)));
        if (isTautology) {
            return {
                status: 'valid',
                output: `${(0, propositional_1.formulaToString)(formula)} es una tautologia en Belnap (siempre designada T/B)`,
                truthTable: tt,
                diagnostics: [],
                formula,
            };
        }
        const cm = tt.rows.find((r) => !designated.has(String(r.result)));
        let output = `${(0, propositional_1.formulaToString)(formula)} no es valida en Belnap`;
        // Educational note for biconditionals: explain why equivalence ≠ tautology
        if (formula.kind === 'biconditional') {
            // Check if the two sides are functionally equivalent (same Belnap value always)
            const lhs = formula.args?.[0];
            const rhs = formula.args?.[1];
            if (lhs && rhs) {
                const ttL = this.generateBelnapTable(lhs);
                const ttR = this.generateBelnapTable(rhs);
                const areEquiv = ttL.rows.length === ttR.rows.length &&
                    ttL.rows.every((r, i) => String(r.result) === String(ttR.rows[i].result));
                if (areEquiv) {
                    output += `\n  ⚠ Nota: Los dos lados son funcionalmente equivalentes (mismo valor Belnap en toda valuación).`;
                    output += `\n  Sin embargo, el bicondicional material (A <-> B) = (A→B) ∧ (B→A) no es siempre designado`;
                    output += `\n  porque N→N = N (no designado). Use 'check equivalent' para equivalencia funcional.`;
                }
            }
        }
        return {
            status: 'invalid',
            output,
            truthTable: tt,
            model: cm ? { type: 'propositional', valuation: cm.valuation } : undefined,
            diagnostics: [],
            formula,
        };
    }
    checkSatisfiable(formula) {
        const tt = this.generateBelnapTable(formula);
        const designated = new Set(['T', 'B']);
        const isSatisfiable = tt.rows.some((r) => designated.has(String(r.result)));
        return {
            status: isSatisfiable ? 'satisfiable' : 'unsatisfiable',
            output: isSatisfiable
                ? `${(0, propositional_1.formulaToString)(formula)} es satisfacible en Belnap`
                : `${(0, propositional_1.formulaToString)(formula)} es una contradicion en Belnap (nunca designada)`,
            truthTable: tt,
            educationalNote: 'En la lógica de Belnap, P ∧ ¬P es satisfacible porque P puede tomar el valor designado B (Both).',
            diagnostics: [],
            formula,
        };
    }
    prove(goal, theory, premises) {
        const useRestricted = premises !== undefined && premises.length > 0;
        const proveDiagnostics = [];
        const axioms = [];
        if (useRestricted) {
            for (const n of premises) {
                const f = theory.axioms.get(n) || theory.theorems.get(n);
                if (f)
                    axioms.push(f);
                else
                    proveDiagnostics.push({
                        severity: 'warning',
                        message: `Premisa '${n}' no encontrada en la teoría; será ignorada en prove`,
                    });
            }
        }
        else {
            axioms.push(...theory.axioms.values());
            axioms.push(...theory.theorems.values());
        }
        if (axioms.length === 0)
            return this.checkValid(goal);
        const allFormulas = [...axioms, goal];
        const atoms = new Set();
        for (const f of allFormulas) {
            for (const a of (0, propositional_1.collectAtoms)(f))
                atoms.add(a);
        }
        const atomsArr = Array.from(atoms).sort();
        // Fast path: bitset entailment check
        const allPure = allFormulas.every(isBelnapPure);
        if (allPure && atomsArr.length <= 13 && atomsArr.length > 0) {
            const premiseBits = axioms.map((f) => evaluateBelnapBitset(f, atomsArr));
            const goalBits = evaluateBelnapBitset(goal, atomsArr);
            // Designated = pos bit set. Conjunction of all premises being designated:
            let premisesDesig = (1n << BigInt(Math.pow(4, atomsArr.length))) - 1n;
            for (const pb of premiseBits)
                premisesDesig &= pb.pos;
            // Check: wherever premises designated, goal also designated
            const goalNotDesig = ~goalBits.pos & ((1n << BigInt(Math.pow(4, atomsArr.length))) - 1n);
            if ((premisesDesig & goalNotDesig) === 0n) {
                return {
                    status: 'provable',
                    output: `${(0, propositional_1.formulaToString)(goal)} se sigue de la teoria en Belnap (preserva valores designados)`,
                    diagnostics: proveDiagnostics,
                    formula: goal,
                };
            }
            return {
                status: 'refutable',
                output: `${(0, propositional_1.formulaToString)(goal)} no es demostrable en Belnap (premisas designadas pero goal no)`,
                diagnostics: proveDiagnostics,
                formula: goal,
            };
        }
        // Fallback: classic evaluation
        const valuations = generateBelnapValuations(atomsArr);
        const designated = new Set(['T', 'B']);
        for (const v of valuations) {
            const bv = v;
            const allPremisesDesignated = axioms.every((ax) => designated.has(this.evaluateBelnap(ax, bv)));
            if (allPremisesDesignated) {
                const goalDesignated = designated.has(this.evaluateBelnap(goal, bv));
                if (!goalDesignated) {
                    return {
                        status: 'refutable',
                        output: `${(0, propositional_1.formulaToString)(goal)} no es demostrable en Belnap (premisas designadas pero goal no)`,
                        diagnostics: [],
                        formula: goal,
                    };
                }
            }
        }
        return {
            status: 'provable',
            output: `${(0, propositional_1.formulaToString)(goal)} se sigue de la teoria en Belnap (preserva valores designados)`,
            diagnostics: [],
            formula: goal,
        };
    }
    derive(goal, premises, theory) {
        const premiseFormulas = premises
            .map((p) => theory.axioms.get(p) || theory.theorems.get(p))
            .filter((f) => f !== undefined);
        if (premiseFormulas.length === 0)
            return this.checkValid(goal);
        // Entailment correcto: para toda valuación donde TODAS las premisas son
        // designadas (T o B), el goal también es designado.
        const allFormulas = [...premiseFormulas, goal];
        const atoms = new Set();
        for (const f of allFormulas) {
            for (const a of (0, propositional_1.collectAtoms)(f))
                atoms.add(a);
        }
        const atomsArr = Array.from(atoms).sort();
        const valuations = generateBelnapValuations(atomsArr);
        const designated = new Set(['T', 'B']);
        for (const v of valuations) {
            const bv = v;
            const allPremisesDesignated = premiseFormulas.every((pf) => designated.has(this.evaluateBelnap(pf, bv)));
            if (allPremisesDesignated) {
                const goalDesignated = designated.has(this.evaluateBelnap(goal, bv));
                if (!goalDesignated) {
                    return {
                        status: 'refutable',
                        output: `No se puede derivar en Belnap (premisas designadas pero goal no)`,
                        diagnostics: [],
                        formula: goal,
                    };
                }
            }
        }
        return {
            status: 'provable',
            output: `Derivacion exitosa en Belnap (preserva valores designados)`,
            diagnostics: [],
            formula: goal,
        };
    }
    countermodel(formula) {
        const tt = this.generateBelnapTable(formula);
        const designated = new Set(['T', 'B']);
        const cm = tt.rows.find((r) => !designated.has(String(r.result)));
        if (cm) {
            const valNames = {
                T: 'True — solo verdadero',
                F: 'False — solo falso',
                B: 'Both — verdadero y falso',
                N: 'Neither — ni verdadero ni falso',
            };
            let output = `Contramodelo Belnap para: ${(0, propositional_1.formulaToString)(formula)}\n`;
            output += `  Valuación:\n`;
            for (const [v, val] of Object.entries(cm.valuation)) {
                output += `    ${v} = ${val} (${valNames[String(val)] ?? val})\n`;
            }
            output += `  Resultado: ${(0, propositional_1.formulaToString)(formula)} = ${cm.result} (no designado)\n`;
            output += `\n  Explicación: En la lógica de Belnap, los valores designados son {T, B}.\n`;
            output += `  El valor "${cm.result}" no es designado, por lo que la fórmula falla bajo esta valuación.`;
            return {
                status: 'invalid',
                output,
                model: { type: 'propositional', valuation: cm.valuation },
                diagnostics: [],
                formula,
            };
        }
        return {
            status: 'valid',
            output: `No hay contramodelo en Belnap (tautologia)`,
            diagnostics: [],
            formula,
        };
    }
    explain(formula) {
        const tt = this.generateBelnapTable(formula);
        const designated = new Set(['T', 'B']);
        const isTautology = tt.rows.every((r) => designated.has(String(r.result)));
        const isSatisfiable = tt.rows.some((r) => designated.has(String(r.result)));
        const atoms = Array.from((0, propositional_1.collectAtoms)(formula));
        let out = `Lógica Paraconsistente de Belnap (4-Valores)\n`;
        out += `Fórmula: ${(0, propositional_1.formulaToString)(formula)}\n\n`;
        out += `Retículo de verdad (A4):\n`;
        out += `       T\n`;
        out += `      / \\\n`;
        out += `     B   N\n`;
        out += `      \\ /\n`;
        out += `       F\n`;
        out += `  Valores designados: {T, B} (portadores de verdad)\n\n`;
        // Per-value evaluation (#16)
        if (atoms.length <= 2) {
            out += `Evaluación por valor de ${atoms.length > 0 ? atoms[0] : 'P'}:\n`;
            for (const val of VALUES) {
                const valuation = {};
                for (const a of atoms)
                    valuation[a] = val;
                const result = this.evaluateBelnap(formula, valuation);
                const isDesig = designated.has(result);
                out += `  ${atoms.length > 0 ? atoms[0] : 'P'} = ${val} → ${(0, propositional_1.formulaToString)(formula)} = ${result}${isDesig ? ' ⊛ ← Designado' : ''}\n`;
            }
            out += `\n`;
        }
        // Designación marks in table (#17)
        out += `Tabla Belnap:\n`;
        const headerAtoms = atoms.length > 0 ? atoms : ['P'];
        out += `  ${headerAtoms.join(' | ')} | ${(0, propositional_1.formulaToString)(formula)}\n`;
        out += `  ${headerAtoms.map(() => '---').join('-+-')}---+---${'-'.repeat((0, propositional_1.formulaToString)(formula).length)}\n`;
        for (const row of tt.rows) {
            const vals = headerAtoms.map((a) => String(row.valuation[a] || 'F'));
            const res = String(row.result);
            const mark = designated.has(res) ? ' ⊛' : '';
            out += `  ${vals.join(' | ')} | ${res}${mark}\n`;
        }
        out += `  ⊛ = valor designado (T o B = porta verdad)\n\n`;
        // Laws that FAIL (#16)
        out += `Leyes clásicas que FALLAN en Belnap:\n`;
        out += `  ✗ P ∨ ¬P (Tercero excluido): Falla cuando P=N (da N, no designado)\n`;
        out += `  ✗ ¬(P ∧ ¬P) (No-contradicción): Falla cuando P=B (¬(B∧B) = ¬B = B, designado pero contradictorio)\n`;
        out += `  ✗ (P ∧ ¬P) → Q (Ex falso): Falla — la explosión no vale\n`;
        out += `  ✗ P → P (Identidad): Falla cuando P=N (N→N = N, no designado)\n\n`;
        // Laws that HOLD (#18) — as functional equivalences (≡), not material biconditionals (<->)
        out += `Equivalencias funcionales que SE MANTIENEN en Belnap (mismo valor en toda valuación):\n`;
        out += `  ✓ De Morgan: ¬(P∧Q) ≡ ¬P∨¬Q y ¬(P∨Q) ≡ ¬P∧¬Q\n`;
        out += `  ✓ Distributividad: P∧(Q∨R) ≡ (P∧Q)∨(P∧R)\n`;
        out += `  ✓ Idempotencia: P∧P ≡ P y P∨P ≡ P\n`;
        out += `  ✓ Doble negación: ¬¬P ≡ P\n`;
        out += `  ⚠ Nota: ≡ significa "mismo valor Belnap", NO que el material bicondicional (↔) sea designado.\n`;
        out += `    Ej: P ≡ P pero P↔P = N cuando P=N (no designado). Use 'check equivalent' para verificar.\n\n`;
        // Classical comparison (#19)
        out += `Comparación con lógica clásica:\n`;
        out += `  En lógica clásica, esta fórmula sería: ${isTautology ? 'TAUTOLOGÍA (siempre V)' : isSatisfiable ? 'CONTINGENTE (a veces V, a veces F)' : 'CONTRADICCIÓN (siempre F)'}\n`;
        out += `  En Belnap: ${isTautology ? 'TAUTOLOGÍA (siempre designada)' : isSatisfiable ? 'SATISFACIBLE (al menos una valuación designada)' : 'INSATISFACIBLE (nunca designada)'}\n\n`;
        out += `Estatus: ${isTautology ? 'TAUTOLOGÍA' : isSatisfiable ? 'SATISFACIBLE' : 'INSATISFACIBLE (Nunca designada)'}\n`;
        const educationalNote = `En la lógica de Belnap, una contradicción (como P ∧ ¬P) puede tomar el valor designado 'B' (Both), lo que significa que de una contradicción no se sigue cualquier cosa (no hay "explosión" / ex falso quodlibet). Belnap modela fuentes de información contradictorias que coexisten sin colapso. Está relacionada con la lógica de la relevancia.`;
        return {
            status: isTautology ? 'valid' : 'invalid',
            output: out,
            truthTable: tt,
            educationalNote,
            diagnostics: [],
            formula,
        };
    }
    checkEquivalent(a, b) {
        // En Belnap, equivalencia = mismo valor de verdad para toda valuación 4-valorada.
        // No usamos biconditional material porque A↔A puede dar N cuando A=N.
        const allFormulas = [a, b];
        const atoms = new Set();
        for (const f of allFormulas) {
            for (const at of (0, propositional_1.collectAtoms)(f))
                atoms.add(at);
        }
        const atomsArr = Array.from(atoms).sort();
        const valuations = generateBelnapValuations(atomsArr);
        for (const v of valuations) {
            const bv = v;
            const valA = this.evaluateBelnap(a, bv);
            const valB = this.evaluateBelnap(b, bv);
            if (valA !== valB) {
                return {
                    status: 'invalid',
                    output: `${(0, propositional_1.formulaToString)(a)} y ${(0, propositional_1.formulaToString)(b)} NO son equivalentes en Belnap (difieren en alguna valuación)`,
                    diagnostics: [],
                };
            }
        }
        return {
            status: 'valid',
            output: `${(0, propositional_1.formulaToString)(a)} y ${(0, propositional_1.formulaToString)(b)} son EQUIVALENTES en Belnap (mismo valor 4-valorado en toda valuación)`,
            diagnostics: [],
        };
    }
    evaluateBelnap(f, v) {
        const args = f.args || [];
        switch (f.kind) {
            case 'true':
                return 'T';
            case 'false':
                return 'F';
            case 'atom':
                return f.name ? (v[f.name] ?? 'N') : 'N';
            case 'not':
                return args[0] ? BELNAP_NOT[this.evaluateBelnap(args[0], v)] : 'N';
            case 'and':
                return args[0] && args[1]
                    ? BELNAP_AND[this.evaluateBelnap(args[0], v)][this.evaluateBelnap(args[1], v)]
                    : 'N';
            case 'or':
                return args[0] && args[1]
                    ? BELNAP_OR[this.evaluateBelnap(args[0], v)][this.evaluateBelnap(args[1], v)]
                    : 'N';
            case 'implies':
                // Implicación en Belnap (A -> B es !A | B)
                return args[0] && args[1]
                    ? BELNAP_OR[BELNAP_NOT[this.evaluateBelnap(args[0], v)]][this.evaluateBelnap(args[1], v)]
                    : 'N';
            case 'biconditional': {
                // A <-> B en Belnap = (A -> B) & (B -> A) = (!A | B) & (!B | A)
                if (!args[0] || !args[1])
                    return 'N';
                const aVal = this.evaluateBelnap(args[0], v);
                const bVal = this.evaluateBelnap(args[1], v);
                const aToB = BELNAP_OR[BELNAP_NOT[aVal]][bVal];
                const bToA = BELNAP_OR[BELNAP_NOT[bVal]][aVal];
                return BELNAP_AND[aToB][bToA];
            }
            default:
                throw new Error(`Operador lógico no soportado en evaluación Belnap: ${f.kind}`);
        }
    }
    generateBelnapTable(formula) {
        const atoms = Array.from((0, propositional_1.collectAtoms)(formula)).sort();
        const n = atoms.length;
        // Fast path: bitset evaluation for pure Belnap formulas
        if (isBelnapPure(formula) && n <= 13 && n > 0) {
            const { pos, neg, total } = evaluateBelnapBitset(formula, atoms);
            // Materialize rows from bitset results
            const rows = new Array(total);
            const designated = new Set(['T', 'B']);
            let tautCount = 0;
            let satCount = 0;
            for (let i = 0; i < total; i++) {
                const bit = BigInt(i);
                const resPos = Boolean((pos >> bit) & 1n);
                const resNeg = Boolean((neg >> bit) & 1n);
                const result = belnapValueFromBits(resPos, resNeg);
                // Reconstruct valuation
                const v = {};
                for (let j = 0; j < n; j++) {
                    const period = Math.pow(4, n - 1 - j);
                    const val = Math.floor(i / period) % 4;
                    v[atoms[j]] = ['T', 'F', 'B', 'N'][val];
                }
                rows[i] = { valuation: v, result };
                if (designated.has(result))
                    satCount++;
                if (designated.has(result))
                    tautCount++;
            }
            return {
                variables: atoms,
                rows: rows,
                isTautology: tautCount === total,
                isSatisfiable: satCount > 0,
                isContradiction: satCount === 0,
            };
        }
        // Fallback: classic evaluation
        const valuations = generateBelnapValuations(atoms);
        const rows = valuations.map((v) => ({
            valuation: v,
            result: this.evaluateBelnap(formula, v),
        }));
        return {
            variables: atoms,
            rows,
            isTautology: rows.every((r) => new Set(['T', 'B']).has(String(r.result))),
            isSatisfiable: rows.some((r) => new Set(['T', 'B']).has(String(r.result))),
            isContradiction: rows.every((r) => !new Set(['T', 'B']).has(String(r.result))),
        };
    }
    truthTable(formula) {
        return this.generateBelnapTable(formula);
    }
}
exports.ParaconsistentBelnap = ParaconsistentBelnap;
function generateBelnapValuations(atoms) {
    if (atoms.length === 0)
        return [{}];
    const list = [{}];
    for (let i = 0; i < atoms.length; i++) {
        const atom = atoms[i];
        const currentLen = list.length;
        for (let j = 0; j < currentLen; j++) {
            const base = list[j];
            const T = { ...base };
            T[atom] = 'T';
            const F = { ...base };
            F[atom] = 'F';
            const B = { ...base };
            B[atom] = 'B';
            const N = { ...base };
            N[atom] = 'N';
            list.push(T, F, B, N);
        }
        list.splice(0, currentLen);
    }
    return list;
}
//# sourceMappingURL=belnap.js.map