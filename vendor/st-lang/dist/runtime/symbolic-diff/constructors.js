"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cst = cst;
exports.v = v;
exports.add = add;
exports.mul = mul;
exports.sub = sub;
exports.div = div;
exports.pow = pow;
exports.neg = neg;
exports.fn = fn;
exports.sin = sin;
exports.cos = cos;
exports.tan = tan;
exports.log = log;
exports.exp = exp;
/** Creates a numeric constant expression node. */
function cst(value) {
    return { kind: 'const', value };
}
/** Creates a variable expression node with the given name. */
function v(name) {
    return { kind: 'var', name };
}
/**
 * Creates an addition expression. With zero args returns `cst(0)`;
 * with one arg returns it directly (no wrapper node).
 */
function add(...args) {
    if (args.length === 0)
        return cst(0);
    if (args.length === 1) {
        const only = args[0];
        if (only === undefined)
            return cst(0);
        return only;
    }
    return { kind: 'add', args };
}
/**
 * Creates a multiplication expression. With zero args returns `cst(1)`;
 * with one arg returns it directly (no wrapper node).
 */
function mul(...args) {
    if (args.length === 0)
        return cst(1);
    if (args.length === 1) {
        const only = args[0];
        if (only === undefined)
            return cst(1);
        return only;
    }
    return { kind: 'mul', args };
}
/** Creates a subtraction expression `left - right`. */
function sub(left, right) {
    return { kind: 'sub', left, right };
}
/** Creates a division expression `left / right`. */
function div(left, right) {
    return { kind: 'div', left, right };
}
/** Creates a power expression `base ^ exp`. */
function pow(base, exp) {
    return { kind: 'pow', base, exp };
}
/** Creates a unary negation expression `-arg`. */
function neg(arg) {
    return { kind: 'neg', arg };
}
/** Creates a unary function expression for any supported `UnaryFn` name. */
function fn(name, arg) {
    return { kind: name, arg };
}
/** Creates a `sin(arg)` expression node. */
function sin(arg) {
    return { kind: 'sin', arg };
}
/** Creates a `cos(arg)` expression node. */
function cos(arg) {
    return { kind: 'cos', arg };
}
/** Creates a `tan(arg)` expression node. */
function tan(arg) {
    return { kind: 'tan', arg };
}
/** Creates a natural `log(arg)` expression node. */
function log(arg) {
    return { kind: 'log', arg };
}
/** Creates an `exp(arg)` (i.e. e^arg) expression node. */
function exp(arg) {
    return { kind: 'exp', arg };
}
//# sourceMappingURL=constructors.js.map