"use strict";
// ============================================================
// ST Argumentation — GraphViz DOT exporter
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.dotExport = dotExport;
function escapeDotId(id) {
    return id.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}
function dotExport(af) {
    const lines = [];
    lines.push('digraph AF {');
    lines.push('  rankdir=LR;');
    lines.push('  node [shape=circle];');
    const sortedArgs = Array.from(af.arguments).sort();
    for (const arg of sortedArgs) {
        lines.push(`  "${escapeDotId(arg)}";`);
    }
    for (const [from, to] of af.attacks) {
        lines.push(`  "${escapeDotId(from)}" -> "${escapeDotId(to)}";`);
    }
    lines.push('}');
    return lines.join('\n');
}
//# sourceMappingURL=dot.js.map