"use strict";
// ============================================================
// ST Argumentation — Core predicates sobre AF de Dung
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFramework = createFramework;
exports.attackersOf = attackersOf;
exports.attackedBy = attackedBy;
exports.attackedBySet = attackedBySet;
exports.isConflictFree = isConflictFree;
exports.defends = defends;
exports.hasAttack = hasAttack;
exports.isAdmissible = isAdmissible;
exports.characteristicFunction = characteristicFunction;
exports.setsEqual = setsEqual;
exports.isSubset = isSubset;
function createFramework(args, attacks) {
    const argSet = new Set(args);
    const attackList = [];
    for (const [a, b] of attacks) {
        if (!argSet.has(a)) {
            throw new Error(`Attack source "${a}" not in arguments`);
        }
        if (!argSet.has(b)) {
            throw new Error(`Attack target "${b}" not in arguments`);
        }
        attackList.push([a, b]);
    }
    return { arguments: argSet, attacks: attackList };
}
function attackersOf(af, arg) {
    const result = new Set();
    for (const [a, b] of af.attacks) {
        if (b === arg)
            result.add(a);
    }
    return result;
}
function attackedBy(af, arg) {
    const result = new Set();
    for (const [a, b] of af.attacks) {
        if (a === arg)
            result.add(b);
    }
    return result;
}
function attackedBySet(af, set) {
    const result = new Set();
    for (const [a, b] of af.attacks) {
        if (set.has(a))
            result.add(b);
    }
    return result;
}
function isConflictFree(af, set) {
    for (const [a, b] of af.attacks) {
        if (set.has(a) && set.has(b))
            return false;
    }
    return true;
}
function defends(af, set, arg) {
    const attackers = attackersOf(af, arg);
    for (const attacker of attackers) {
        let defended = false;
        for (const member of set) {
            if (hasAttack(af, member, attacker)) {
                defended = true;
                break;
            }
        }
        if (!defended)
            return false;
    }
    return true;
}
function hasAttack(af, from, to) {
    for (const [a, b] of af.attacks) {
        if (a === from && b === to)
            return true;
    }
    return false;
}
function isAdmissible(af, set) {
    if (!isConflictFree(af, set))
        return false;
    for (const member of set) {
        if (!defends(af, set, member))
            return false;
    }
    return true;
}
function characteristicFunction(af, set) {
    const result = new Set();
    for (const arg of af.arguments) {
        if (defends(af, set, arg))
            result.add(arg);
    }
    return result;
}
function setsEqual(a, b) {
    if (a.size !== b.size)
        return false;
    for (const x of a)
        if (!b.has(x))
            return false;
    return true;
}
function isSubset(a, b) {
    if (a.size > b.size)
        return false;
    for (const x of a)
        if (!b.has(x))
            return false;
    return true;
}
//# sourceMappingURL=framework.js.map