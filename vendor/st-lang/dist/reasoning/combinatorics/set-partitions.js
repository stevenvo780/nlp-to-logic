"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setPartitions = setPartitions;
exports.setPartitionsCount = setPartitionsCount;
const special_numbers_1 = require("./special-numbers");
function setPartitions(items) {
    const n = items.length;
    if (n === 0)
        return [[]];
    const result = [];
    // restricted growth strings: a[i] indica el bloque de items[i].
    const assignment = new Array(n).fill(0);
    function recurse(i, maxUsed) {
        if (i === n) {
            const blocks = [];
            for (let b = 0; b <= maxUsed; b++) {
                blocks.push([]);
            }
            for (let idx = 0; idx < n; idx++) {
                const bIdx = assignment[idx];
                const item = items[idx];
                if (bIdx === undefined)
                    throw new Error('setPartitions: assignment inválido');
                if (item === undefined && !(idx in items)) {
                    throw new Error('setPartitions: ítem inválido');
                }
                const block = blocks[bIdx];
                if (block === undefined)
                    throw new Error('setPartitions: bloque inválido');
                block.push(item);
            }
            result.push(blocks);
            return;
        }
        for (let b = 0; b <= maxUsed + 1; b++) {
            assignment[i] = b;
            recurse(i + 1, Math.max(maxUsed, b));
        }
    }
    recurse(0, -1);
    return result;
}
function setPartitionsCount(n) {
    return (0, special_numbers_1.bellNumber)(n);
}
//# sourceMappingURL=set-partitions.js.map