"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mutateNumber = mutateNumber;
exports.mutateString = mutateString;
exports.mutateBoolean = mutateBoolean;
function mutateNumber(n) {
    return [n + 1, n - 1, 0, -n, 2 * n];
}
function mutateString(s) {
    const out = [];
    out.push('');
    out.push(`${s} `);
    if (s.length > 0) {
        out.push(s.slice(0, -1));
        out.push(s.slice(1));
        out.push(s.toUpperCase() === s ? s.toLowerCase() : s.toUpperCase());
    }
    else {
        out.push('x');
        out.push('xx');
        out.push('X');
    }
    return out;
}
function mutateBoolean(b) {
    return [!b];
}
//# sourceMappingURL=mutation.js.map