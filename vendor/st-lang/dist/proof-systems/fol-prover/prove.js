"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.proveFOL = proveFOL;
const cnf_1 = require("./cnf");
const resolve_1 = require("./resolve");
const DEFAULT_TIMEOUT_MS = 2000;
const DEFAULT_MAX_STEPS = 5000;
function proveFOL(premises, goal, opts = {}) {
    const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    const maxSteps = opts.maxSteps ?? DEFAULT_MAX_STEPS;
    const premiseClauses = premises.flatMap((p) => (0, cnf_1.toCNF)(p));
    const negatedGoal = { kind: 'not', args: [goal] };
    const negatedGoalClauses = (0, cnf_1.toCNF)(negatedGoal);
    if (premiseClauses.some((c) => c.length === 0) ||
        negatedGoalClauses.some((c) => c.length === 0)) {
        return { proven: true, steps: [] };
    }
    const result = (0, resolve_1.runResolutionLoop)({
        premiseClauses,
        negatedGoalClauses,
        timeoutMs,
        maxSteps,
    });
    const out = {
        proven: result.proven,
        steps: result.steps,
    };
    if (result.timeoutHit)
        out.timeoutHit = true;
    if (result.reason)
        out.reason = result.reason;
    return out;
}
//# sourceMappingURL=prove.js.map