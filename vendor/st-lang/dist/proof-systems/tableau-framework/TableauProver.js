"use strict";
// ============================================================
// Tableau Framework — TableauProver<F>
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableauProver = void 0;
class TableauProver {
    rules = [];
    closureConditions = [];
    registerRule(rule) {
        this.rules.push(rule);
    }
    registerClosureCondition(check) {
        this.closureConditions.push(check);
    }
    prove(root, maxDepth = 50) {
        const rootClone = cloneBranch(root);
        const rootEntry = { branch: rootClone, superseded: false };
        const allEntries = [rootEntry];
        // Work-list: pairs of (entry, depth).
        const workList = [
            { entry: rootEntry, depth: 0 },
        ];
        while (workList.length > 0) {
            const item = workList.shift();
            if (!item)
                break;
            const { entry, depth } = item;
            const { branch } = entry;
            if (branch.closed || entry.superseded)
                continue;
            // Check closure before any expansion.
            this.checkClosure(branch);
            if (branch.closed)
                continue;
            if (depth >= maxDepth)
                continue;
            // Find the first applicable rule.
            let expanded = false;
            for (let i = 0; i < branch.nodes.length; i++) {
                const node = branch.nodes[i];
                if (!node)
                    continue;
                const rule = this.rules.find((r) => r.match(node, branch));
                if (!rule)
                    continue;
                const expansions = rule.apply(node, branch);
                if (expansions.length === 0)
                    continue;
                // Remaining nodes after removing the expanded node.
                const remaining = [
                    ...branch.nodes.slice(0, i),
                    ...branch.nodes.slice(i + 1),
                ];
                if (expansions.length === 1 && expansions[0]) {
                    // α-rule: extend this branch in place (no split).
                    branch.nodes = [...remaining, ...expansions[0]];
                    this.checkClosure(branch);
                    if (!branch.closed) {
                        workList.unshift({ entry, depth: depth + 1 });
                    }
                }
                else {
                    // β-rule: mark this entry as superseded, create children.
                    entry.superseded = true;
                    for (const newNodes of expansions) {
                        const childBranch = cloneBranch({ nodes: [...remaining, ...newNodes], closed: false });
                        const childEntry = { branch: childBranch, superseded: false };
                        allEntries.push(childEntry);
                        this.checkClosure(childBranch);
                        if (!childBranch.closed) {
                            workList.push({ entry: childEntry, depth: depth + 1 });
                        }
                    }
                }
                expanded = true;
                break;
            }
            // No rule fired — saturated branch, run closure one more time.
            if (!expanded) {
                this.checkClosure(branch);
            }
        }
        // Collect all branches (for the public API).
        const allBranches = allEntries.map((e) => e.branch);
        // Leaf branches: not superseded (true terminal nodes of the tree).
        const leafEntries = allEntries.filter((e) => !e.superseded);
        const open = leafEntries.filter((e) => !e.branch.closed).map((e) => e.branch);
        const tableClosed = open.length === 0;
        return {
            root: rootClone,
            branches: allBranches,
            open,
            closed: tableClosed,
        };
    }
    checkClosure(branch) {
        if (branch.closed)
            return;
        for (const cond of this.closureConditions) {
            const reason = cond(branch);
            if (reason !== null) {
                branch.closed = true;
                branch.reason = reason;
                return;
            }
        }
    }
}
exports.TableauProver = TableauProver;
function cloneBranch(branch) {
    return {
        nodes: branch.nodes.map((n) => ({ ...n })),
        closed: branch.closed,
        reason: branch.reason,
    };
}
//# sourceMappingURL=TableauProver.js.map