"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.variable = void 0;
exports.differentiate = differentiate;
exports.gradient = gradient;
const constructors_1 = require("./constructors");
const simplify_1 = require("./simplify");
/**
 * Diferenciación simbólica respecto a `varName`.
 *
 * Reglas:
 * - Linealidad: d/dx(f+g) = f' + g'
 * - Producto: d/dx(f*g) = f'*g + f*g'  (generalizado a N factores)
 * - Cociente: d/dx(f/g) = (f'*g - f*g') / g^2
 * - Cadena: d/dx(f(g(x))) = f'(g(x)) * g'(x)
 * - Potencia general: d/dx(f^g) = f^g * (g'*ln(f) + g*f'/f)
 *   (caso especial: exponente constante → g*f^(g-1)*f')
 *
 * El resultado se simplifica antes de devolverse.
 */
function differentiate(expr, varName) {
    return (0, simplify_1.simplify)(diffRaw(expr, varName));
}
function diffRaw(expr, x) {
    switch (expr.kind) {
        case 'const':
            return (0, constructors_1.cst)(0);
        case 'var':
            return (0, constructors_1.cst)(expr.name === x ? 1 : 0);
        case 'add':
            return (0, constructors_1.add)(...expr.args.map((a) => diffRaw(a, x)));
        case 'mul': {
            // d/dx(f1*f2*...*fn) = Σ_i (f1*...*fi'*...*fn)
            const terms = [];
            for (let i = 0; i < expr.args.length; i++) {
                const factors = [];
                for (let j = 0; j < expr.args.length; j++) {
                    const factor = expr.args[j];
                    if (factor === undefined)
                        continue;
                    if (i === j)
                        factors.push(diffRaw(factor, x));
                    else
                        factors.push(factor);
                }
                terms.push((0, constructors_1.mul)(...factors));
            }
            return (0, constructors_1.add)(...terms);
        }
        case 'sub':
            return (0, constructors_1.sub)(diffRaw(expr.left, x), diffRaw(expr.right, x));
        case 'div': {
            // (f/g)' = (f'g - fg') / g^2
            const f = expr.left;
            const g = expr.right;
            const num = (0, constructors_1.sub)((0, constructors_1.mul)(diffRaw(f, x), g), (0, constructors_1.mul)(f, diffRaw(g, x)));
            const den = (0, constructors_1.pow)(g, (0, constructors_1.cst)(2));
            return (0, constructors_1.div)(num, den);
        }
        case 'pow': {
            const base = expr.base;
            const exponent = expr.exp;
            // Caso 1: exponente constante → g*f^(g-1)*f'
            if (exponent.kind === 'const') {
                const n = exponent.value;
                if (n === 0)
                    return (0, constructors_1.cst)(0);
                return (0, constructors_1.mul)((0, constructors_1.cst)(n), (0, constructors_1.pow)(base, (0, constructors_1.cst)(n - 1)), diffRaw(base, x));
            }
            // Caso 2: base constante positiva → a^g * ln(a) * g'
            if (base.kind === 'const' && base.value > 0) {
                return (0, constructors_1.mul)((0, constructors_1.pow)(base, exponent), (0, constructors_1.cst)(Math.log(base.value)), diffRaw(exponent, x));
            }
            // Caso general: f^g * (g'*ln(f) + g*f'/f)
            const fPrime = diffRaw(base, x);
            const gPrime = diffRaw(exponent, x);
            const innerSum = (0, constructors_1.add)((0, constructors_1.mul)(gPrime, (0, constructors_1.log)(base)), (0, constructors_1.div)((0, constructors_1.mul)(exponent, fPrime), base));
            return (0, constructors_1.mul)((0, constructors_1.pow)(base, exponent), innerSum);
        }
        case 'neg':
            return (0, constructors_1.neg)(diffRaw(expr.arg, x));
        case 'sin':
            // d/dx sin(u) = cos(u) * u'
            return (0, constructors_1.mul)((0, constructors_1.cos)(expr.arg), diffRaw(expr.arg, x));
        case 'cos':
            // d/dx cos(u) = -sin(u) * u'
            return (0, constructors_1.mul)((0, constructors_1.neg)((0, constructors_1.sin)(expr.arg)), diffRaw(expr.arg, x));
        case 'tan':
            // d/dx tan(u) = u' / cos(u)^2
            return (0, constructors_1.div)(diffRaw(expr.arg, x), (0, constructors_1.pow)((0, constructors_1.cos)(expr.arg), (0, constructors_1.cst)(2)));
        case 'log':
            // d/dx log(u) = u' / u
            return (0, constructors_1.div)(diffRaw(expr.arg, x), expr.arg);
        case 'exp':
            // d/dx exp(u) = exp(u) * u'
            return (0, constructors_1.mul)((0, constructors_1.exp)(expr.arg), diffRaw(expr.arg, x));
    }
}
/**
 * Gradiente: lista de derivadas parciales por variable.
 */
function gradient(expr, vars) {
    return vars.map((name) => differentiate(expr, name));
}
// Re-export para que el caller pueda armar vars sin importar 'v' por separado.
exports.variable = constructors_1.v;
//# sourceMappingURL=differentiate.js.map