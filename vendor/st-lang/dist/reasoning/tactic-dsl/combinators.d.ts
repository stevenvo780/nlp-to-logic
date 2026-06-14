import type { Tactic } from './types';
export declare function seq(...tactics: Tactic[]): Tactic;
export declare function orElse(...tactics: Tactic[]): Tactic;
export declare function repeat_(t: Tactic, max?: number): Tactic;
export declare function tryAlt(t: Tactic): Tactic;
//# sourceMappingURL=combinators.d.ts.map