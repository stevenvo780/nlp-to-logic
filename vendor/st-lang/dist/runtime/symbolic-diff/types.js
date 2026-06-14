"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UNARY_FUNCTIONS = void 0;
exports.isUnaryFn = isUnaryFn;
exports.UNARY_FUNCTIONS = ['sin', 'cos', 'tan', 'log', 'exp'];
function isUnaryFn(kind) {
    return exports.UNARY_FUNCTIONS.includes(kind);
}
//# sourceMappingURL=types.js.map