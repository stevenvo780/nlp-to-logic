import { Formula } from '../types';
interface ClassificationResult {
    formulaClassification?: string;
    reasoningSchema?: string;
    formulaAnalysis: {
        mainConnective?: string;
        depth: number;
        complexity: number;
        subFormulas: string[];
        atomCount: number;
        connectivesUsed: string[];
    };
}
export declare function formulasEqual(a: Formula, b: Formula): boolean;
export declare function unify(f: Formula, template: Formula, mapping: Map<string, Formula>): boolean;
export declare function classifyFormula(f: Formula): ClassificationResult;
export {};
//# sourceMappingURL=formula-classifier.d.ts.map