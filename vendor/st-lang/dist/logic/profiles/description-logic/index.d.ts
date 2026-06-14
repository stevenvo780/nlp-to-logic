export type { DLConcept, DLConceptKind, DLAxiom, DLAxiomKind, DLKnowledgeBase } from './types';
export { TOP, BOTTOM, atomic, not, and, or, exists, forall, subsumes, equivalent, instance, roleInstance, emptyKB, } from './types';
export { toNNF, conceptHash, conceptEqual, conceptToString } from './nnf';
export { isSatisfiable, isSubsumed, isInstance, classify } from './tableau';
//# sourceMappingURL=index.d.ts.map