"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simplify = simplify;
exports.exprEquals = exprEquals;
const constructors_1 = require("./constructors");
function isConst(expr, value) {
    return expr.kind === 'const' && expr.value === value;
}
function asConst(expr) {
    return expr.kind === 'const' ? expr.value : null;
}
function flattenAdd(args) {
    const out = [];
    for (const a of args) {
        if (a.kind === 'add')
            out.push(...flattenAdd(a.args));
        else
            out.push(a);
    }
    return out;
}
function flattenMul(args) {
    const out = [];
    for (const a of args) {
        if (a.kind === 'mul')
            out.push(...flattenMul(a.args));
        else
            out.push(a);
    }
    return out;
}
/**
 * Simplificación algebraica: constant folding + identidades básicas
 * (x+0=x, x*1=x, x*0=0, x^0=1, x^1=x, neg(neg(x))=x).
 *
 * No intenta factorización ni canonicalización total (eso sería CAS).
 * Aplica recursivamente hasta punto fijo (máx 10 pases).
 */
function simplify(expr) {
    let current = expr;
    for (let i = 0; i < 10; i++) {
        const next = simplifyOnce(current);
        if (exprEquals(next, current))
            return next;
        current = next;
    }
    return current;
}
function simplifyOnce(expr) {
    switch (expr.kind) {
        case 'const':
        case 'var':
            return expr;
        case 'neg': {
            const a = simplifyOnce(expr.arg);
            if (a.kind === 'const')
                return (0, constructors_1.cst)(-a.value);
            if (a.kind === 'neg')
                return a.arg;
            return { kind: 'neg', arg: a };
        }
        case 'add': {
            const simplified = expr.args.map(simplifyOnce);
            const flat = flattenAdd(simplified);
            let constSum = 0;
            const nonConst = [];
            for (const term of flat) {
                const c = asConst(term);
                if (c !== null)
                    constSum += c;
                else
                    nonConst.push(term);
            }
            if (nonConst.length === 0)
                return (0, constructors_1.cst)(constSum);
            const finalArgs = constSum === 0 ? nonConst : [...nonConst, (0, constructors_1.cst)(constSum)];
            if (finalArgs.length === 1) {
                const only = finalArgs[0];
                if (only !== undefined)
                    return only;
            }
            return { kind: 'add', args: finalArgs };
        }
        case 'mul': {
            const simplified = expr.args.map(simplifyOnce);
            const flat = flattenMul(simplified);
            let constProd = 1;
            const nonConst = [];
            for (const factor of flat) {
                const c = asConst(factor);
                if (c !== null)
                    constProd *= c;
                else
                    nonConst.push(factor);
            }
            if (constProd === 0)
                return (0, constructors_1.cst)(0);
            if (nonConst.length === 0)
                return (0, constructors_1.cst)(constProd);
            const finalArgs = constProd === 1 ? nonConst : [(0, constructors_1.cst)(constProd), ...nonConst];
            if (finalArgs.length === 1) {
                const only = finalArgs[0];
                if (only !== undefined)
                    return only;
            }
            return { kind: 'mul', args: finalArgs };
        }
        case 'sub': {
            const l = simplifyOnce(expr.left);
            const r = simplifyOnce(expr.right);
            if (l.kind === 'const' && r.kind === 'const')
                return (0, constructors_1.cst)(l.value - r.value);
            if (isConst(r, 0))
                return l;
            if (isConst(l, 0))
                return simplifyOnce({ kind: 'neg', arg: r });
            return { kind: 'sub', left: l, right: r };
        }
        case 'div': {
            const l = simplifyOnce(expr.left);
            const r = simplifyOnce(expr.right);
            if (isConst(r, 1))
                return l;
            if (isConst(l, 0) && !isConst(r, 0))
                return (0, constructors_1.cst)(0);
            if (l.kind === 'const' && r.kind === 'const' && r.value !== 0)
                return (0, constructors_1.cst)(l.value / r.value);
            return { kind: 'div', left: l, right: r };
        }
        case 'pow': {
            const base = simplifyOnce(expr.base);
            const exponent = simplifyOnce(expr.exp);
            if (isConst(exponent, 0))
                return (0, constructors_1.cst)(1);
            if (isConst(exponent, 1))
                return base;
            if (isConst(base, 0))
                return (0, constructors_1.cst)(0);
            if (isConst(base, 1))
                return (0, constructors_1.cst)(1);
            if (base.kind === 'const' && exponent.kind === 'const') {
                return (0, constructors_1.cst)(Math.pow(base.value, exponent.value));
            }
            return { kind: 'pow', base, exp: exponent };
        }
        case 'sin':
        case 'cos':
        case 'tan':
        case 'log':
        case 'exp': {
            const arg = simplifyOnce(expr.arg);
            if (arg.kind === 'const') {
                switch (expr.kind) {
                    case 'sin':
                        return (0, constructors_1.cst)(Math.sin(arg.value));
                    case 'cos':
                        return (0, constructors_1.cst)(Math.cos(arg.value));
                    case 'tan':
                        return (0, constructors_1.cst)(Math.tan(arg.value));
                    case 'log':
                        if (arg.value > 0)
                            return (0, constructors_1.cst)(Math.log(arg.value));
                        break;
                    case 'exp':
                        return (0, constructors_1.cst)(Math.exp(arg.value));
                }
            }
            return { kind: expr.kind, arg };
        }
    }
}
function exprEquals(a, b) {
    if (a.kind !== b.kind)
        return false;
    switch (a.kind) {
        case 'const':
            return a.value === b.value;
        case 'var':
            return a.name === b.name;
        case 'add':
        case 'mul': {
            const bMulti = b;
            if (a.args.length !== bMulti.args.length)
                return false;
            for (let i = 0; i < a.args.length; i++) {
                const aArg = a.args[i];
                const bArg = bMulti.args[i];
                if (aArg === undefined || bArg === undefined)
                    return false;
                if (!exprEquals(aArg, bArg))
                    return false;
            }
            return true;
        }
        case 'sub':
        case 'div': {
            const bBin = b;
            return exprEquals(a.left, bBin.left) && exprEquals(a.right, bBin.right);
        }
        case 'pow': {
            const bPow = b;
            return exprEquals(a.base, bPow.base) && exprEquals(a.exp, bPow.exp);
        }
        case 'neg':
            return exprEquals(a.arg, b.arg);
        case 'sin':
        case 'cos':
        case 'tan':
        case 'log':
        case 'exp':
            return exprEquals(a.arg, b.arg);
    }
}
//# sourceMappingURL=simplify.js.map