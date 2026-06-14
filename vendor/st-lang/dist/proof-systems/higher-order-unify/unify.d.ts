import type { HOTerm, HOSubst } from './types';
export declare function unifyPattern(t1: HOTerm, t2: HOTerm): HOSubst | null;
export declare function buildLambdaBinding(params: string[], body: HOTerm, avoidNames: Set<string>): HOTerm;
export declare function unifyMetaApp(metaName: string, boundVars: string[], body: HOTerm): HOSubst | null;
//# sourceMappingURL=unify.d.ts.map