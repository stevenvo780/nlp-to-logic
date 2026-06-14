import type { HOTerm, HOSubst } from './types';
export declare function freeVarsHO(t: HOTerm): Set<string>;
export declare function allNamesHO(t: HOTerm, acc?: Set<string>): Set<string>;
export declare function freshName(avoid: Set<string>, base?: string): string;
export declare function resetFreshCounter(): void;
export declare function substituteHO(t: HOTerm, varName: string, replacement: HOTerm): HOTerm;
export declare function applyHOSubst(t: HOTerm, subst: HOSubst): HOTerm;
export declare function normalize(t: HOTerm): HOTerm;
declare function flattenApp(t: HOTerm): {
    fn: HOTerm;
    args: HOTerm[];
};
export { flattenApp };
//# sourceMappingURL=normalize.d.ts.map