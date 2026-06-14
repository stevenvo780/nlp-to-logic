/**
 * ST Text Layer — Compilador texto -> formula/claim
 */
import { Anchor, Formula, Theory, Diagnostic, TextLayerState, DefinitionEntry, SourceInfo, InterpretationEntry } from '../../types';
export type { TextLayerState };
/** Crea un `TextLayerState` vacío listo para recibir passages, claims y definiciones. */
export declare function createTextLayerState(): TextLayerState;
/**
 * Parsea una ruta de anchor con formato `"archivo.md#fragmento"` en un `Anchor`.
 * Infiere el tipo (`heading`, `paragraph`, `range`, `block`) a partir del fragmento.
 * @throws Si la cadena es inválida, vacía, tiene múltiples `#`, o el fragmento no se reconoce.
 */
export declare function parseAnchorPath(raw: string): Anchor;
/**
 * Registra un passage en el estado, parseando `anchorPath` con `parseAnchorPath`.
 * @returns Diagnósticos de error si el anchor es inválido; vacío en caso de éxito.
 */
export declare function registerPassage(state: TextLayerState, name: string, anchorPath: string): Diagnostic[];
/**
 * Registra una formalización (passage + fórmula) en el estado.
 * Emite un warning si el passage referenciado no existe aún.
 */
export declare function registerFormalization(state: TextLayerState, name: string, passageName: string, formula: Formula): Diagnostic[];
/**
 * Registra un claim con fórmula directa o referencia a una formalización.
 * Emite un warning si `formalizationRef` no apunta a ningún pasaje o formalización conocida.
 */
export declare function registerClaim(state: TextLayerState, name: string, formula?: Formula, formalizationRef?: string): Diagnostic[];
/**
 * Asocia una fuente bibliográfica (`sourceName`) como soporte de un claim.
 * Emite un warning si el claim no existe en el estado.
 */
export declare function registerSupport(state: TextLayerState, claimName: string, sourceName: string): Diagnostic[];
/**
 * Registra el nivel de confianza `value ∈ [0,1]` para un claim.
 * @returns Error si `value` está fuera de rango; warning si el claim no existe.
 */
export declare function registerConfidence(state: TextLayerState, claimName: string, value: number): Diagnostic[];
/**
 * Registra texto de contexto libre asociado a un claim.
 * Emite un warning si el claim no existe en el estado.
 */
export declare function registerContext(state: TextLayerState, claimName: string, text: string): Diagnostic[];
/**
 * Copia todos los claims con fórmula (directa o vía formalización) a `theory.claims`.
 * @returns Diagnósticos de error para claims con referencia a formalización inexistente.
 */
export declare function compileClaimsToTheory(state: TextLayerState, theory: Theory): Diagnostic[];
/**
 * Registra una entrada de definición formal en el estado (v3).
 * Emite un warning si el nombre ya fue definido anteriormente.
 */
export declare function registerDefinition(state: TextLayerState, entry: DefinitionEntry): Diagnostic[];
/**
 * Registra una fuente bibliográfica en el estado (v3).
 * Emite un warning si el `source.id` ya fue registrado.
 */
export declare function registerSource(state: TextLayerState, source: SourceInfo): Diagnostic[];
/**
 * Registra una entrada de interpretación semántica bajo la clave `key` (v3).
 * Sobreescribe silenciosamente si la clave ya existe.
 */
export declare function registerInterpretation(state: TextLayerState, key: string, entry: InterpretationEntry): Diagnostic[];
//# sourceMappingURL=compiler.d.ts.map