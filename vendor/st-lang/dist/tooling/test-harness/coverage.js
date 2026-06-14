"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runWithCoverage = runWithCoverage;
async function runWithCoverage(suite, runner) {
    let passing = 0;
    let failing = 0;
    let errored = 0;
    const tagDistribution = new Map();
    for (const c of suite.cases) {
        for (const t of c.tags ?? []) {
            tagDistribution.set(t, (tagDistribution.get(t) ?? 0) + 1);
        }
        try {
            const ok = await runner(c);
            if (ok)
                passing += 1;
            else
                failing += 1;
        }
        catch {
            errored += 1;
        }
    }
    return {
        totalCases: suite.cases.length,
        passing,
        failing,
        errored,
        tagDistribution,
    };
}
//# sourceMappingURL=coverage.js.map