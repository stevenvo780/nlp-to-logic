import { LogicNode } from './formula/ast';
import { LogicProfile } from './types';
export interface LLMConfig {
    provider: 'openai' | 'anthropic' | 'gemini' | 'custom' | 'ollama' | 'openwebui' | 'web-distilled';
    apiKey: string;
    endpoint?: string;
    model?: string;
}
export interface LLMParsedResult {
    axioms: Array<{
        name: string;
        formulaJSON: LogicNode;
    }>;
    conclusions: Array<{
        formulaJSON: LogicNode;
    }>;
}
/**
 * Llama a la API del LLM (usando fetch isomorfico) para abstraer el texto a AST.
 */
export declare function parseTextWithLLM(text: string, profile: LogicProfile, config: LLMConfig): Promise<LLMParsedResult>;
/**
 * Transforma la respuesta estructurada del LLM directamente a líneas de código ST seguras.
 * Conclusions become 'derive' statements (derived from all axioms).
 */
export declare function llmResultToST(result: LLMParsedResult): {
    formula: string;
    type: 'axiom' | 'derive' | 'check';
    deriveSources?: string[];
}[];
//# sourceMappingURL=llm-parser.d.ts.map