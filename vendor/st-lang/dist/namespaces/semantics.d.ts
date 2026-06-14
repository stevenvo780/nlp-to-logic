/**
 * Namespace: Semantics
 *
 * Capas semánticas y puentes de interpretación: text-layer (claims/passages
 * con grafo de dependencias), MDX bridge, game semantics dialógico (IPC
 * Lorenzen-Felscher), profile-bridge (traducciones entre lógicas), y
 * coinducción (streams, bisimulación).
 *
 * Importa así:
 *   import { Semantics } from '@stevenvo780/st-lang';
 *   const state = Semantics.textLayer.createTextLayerState();
 *   const win = Semantics.gameSemantics.winningStrategy(formula);
 */
import * as textLayerCompiler from '../semantics/text-layer/compiler';
import * as textLayerV2 from '../semantics/text-layer/v2';
import * as gameSemantics from '../semantics/game-semantics';
import * as profileBridge from '../logic/profile-bridge';
import * as coinduction from '../semantics/coinduction';
export { textLayerCompiler, textLayerV2, gameSemantics, profileBridge, coinduction };
export declare const textLayer: typeof textLayerCompiler;
//# sourceMappingURL=semantics.d.ts.map