import type { Expr, UnaryFn } from './types';
/** Creates a numeric constant expression node. */
export declare function cst(value: number): Expr;
/** Creates a variable expression node with the given name. */
export declare function v(name: string): Expr;
/**
 * Creates an addition expression. With zero args returns `cst(0)`;
 * with one arg returns it directly (no wrapper node).
 */
export declare function add(...args: Expr[]): Expr;
/**
 * Creates a multiplication expression. With zero args returns `cst(1)`;
 * with one arg returns it directly (no wrapper node).
 */
export declare function mul(...args: Expr[]): Expr;
/** Creates a subtraction expression `left - right`. */
export declare function sub(left: Expr, right: Expr): Expr;
/** Creates a division expression `left / right`. */
export declare function div(left: Expr, right: Expr): Expr;
/** Creates a power expression `base ^ exp`. */
export declare function pow(base: Expr, exp: Expr): Expr;
/** Creates a unary negation expression `-arg`. */
export declare function neg(arg: Expr): Expr;
/** Creates a unary function expression for any supported `UnaryFn` name. */
export declare function fn(name: UnaryFn, arg: Expr): Expr;
/** Creates a `sin(arg)` expression node. */
export declare function sin(arg: Expr): Expr;
/** Creates a `cos(arg)` expression node. */
export declare function cos(arg: Expr): Expr;
/** Creates a `tan(arg)` expression node. */
export declare function tan(arg: Expr): Expr;
/** Creates a natural `log(arg)` expression node. */
export declare function log(arg: Expr): Expr;
/** Creates an `exp(arg)` (i.e. e^arg) expression node. */
export declare function exp(arg: Expr): Expr;
//# sourceMappingURL=constructors.d.ts.map