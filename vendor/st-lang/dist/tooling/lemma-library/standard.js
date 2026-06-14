"use strict";
// ============================================================
// standardLibrary() — ensamble de la biblioteca curada base
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.standardLibrary = standardLibrary;
const library_1 = require("./library");
const propositional_1 = require("./propositional");
const arithmetic_1 = require("./arithmetic");
const set_theory_1 = require("./set-theory");
const modal_1 = require("./modal");
const firstorder_1 = require("./firstorder");
function standardLibrary() {
    const lib = new library_1.LemmaLibrary();
    for (const lemma of propositional_1.PROPOSITIONAL_LEMMAS)
        lib.add(lemma);
    for (const lemma of arithmetic_1.ARITHMETIC_LEMMAS)
        lib.add(lemma);
    for (const lemma of set_theory_1.SET_THEORY_LEMMAS)
        lib.add(lemma);
    for (const lemma of modal_1.MODAL_LEMMAS)
        lib.add(lemma);
    for (const lemma of firstorder_1.FIRSTORDER_LEMMAS)
        lib.add(lemma);
    return lib;
}
//# sourceMappingURL=standard.js.map