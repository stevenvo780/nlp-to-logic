import { LLMParsedResult } from './llm-parser';
import { LogicProfile } from './types';
/**
 * Loads @huggingface/transformers asynchronously and runs local ONNX inference
 * using our fine-tuned Qwen2.5-0.5B model hosted on HuggingFace or loaded locally.
 */
export declare function runDistilledWebInference(text: string, profile: LogicProfile, systemPrompt: string, customModelUrl?: string): Promise<LLMParsedResult>;
//# sourceMappingURL=local-slm-web.d.ts.map