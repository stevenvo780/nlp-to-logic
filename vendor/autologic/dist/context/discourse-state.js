"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalDrt = exports.DiscourseState = void 0;
class DiscourseState {
    prevStates = new Map();
    statementCounter = 1;
    registerStatement(node) {
        const id = `s${this.statementCounter++}`;
        this.prevStates.set(id, node);
        return id;
    }
    getLastStatementId() {
        if (this.statementCounter === 1)
            return undefined;
        return `s${this.statementCounter - 1}`;
    }
    resolvePronoun(pronoun) {
        if (pronoun.toLowerCase() === 'esto' || pronoun.toLowerCase() === 'lo' || pronoun.toLowerCase() === 'lo anterior') {
            return this.getLastStatementId();
        }
        return undefined;
    }
}
exports.DiscourseState = DiscourseState;
exports.globalDrt = new DiscourseState();
//# sourceMappingURL=discourse-state.js.map