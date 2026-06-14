/**
 * pipeline.ts — Nucleo del playground nlp-to-logic. SOLO SERVIDOR.
 *
 * `import 'server-only'` garantiza un error de build si este modulo (y por
 * tanto el motor ST/autologic) se importa accidentalmente desde un componente
 * de cliente. Las constantes/tipos compartidos viven en ./profiles.
 *
 * Une las dos librerias revividas del portafolio, EN PROCESO (sin DB, sin GPU,
 * sin spawnear procesos hijos):
 *
 *   1. @stevenvo780/autologic.formalize()  →  texto natural (ES/EN) a codigo ST
 *      (NLP basado en reglas, sin modelos de lenguaje).
 *   2. @stevenvo780/st-lang  evaluate()     →  ejecuta el codigo ST y devuelve
 *      resultados logicos estructurados (derivaciones, validez, contramodelos).
 *
 * Llamamos a formalize() con validateOutput:false para evitar que autologic
 * lance un proceso hijo (spawnSync) en la validacion. En su lugar ejecutamos ST
 * via su API programatica, seguro en serverless (Vercel Node runtime).
 */
import 'server-only';
import { formalize } from '@stevenvo780/autologic';
import type {
  FormalizationResult,
  LogicProfile,
  Language,
} from '@stevenvo780/autologic';
import { evaluate, type STEvalResult } from '@stevenvo780/st-lang/api';
import type { PipelineResult } from './profiles';

export type { PipelineResult } from './profiles';

export interface RunOptions {
  profile?: LogicProfile;
  language?: Language;
}

/**
 * Ejecuta el pipeline completo texto → ST → resultado, en proceso.
 */
export function runPipeline(text: string, opts: RunOptions = {}): PipelineResult {
  const startedAt = Date.now();
  const profile = opts.profile ?? 'classical.propositional';
  const language = opts.language ?? 'es';

  // 1. NLP → codigo ST (sin validacion via proceso hijo: la hacemos nosotros).
  const f: FormalizationResult = formalize(text, {
    profile,
    language,
    validateOutput: false,
    includeComments: true,
  });

  // 2. Ejecutar el codigo ST en proceso con la API de st-lang.
  let exec: STEvalResult;
  try {
    exec = evaluate(f.stCode);
  } catch (err) {
    exec = {
      ok: false,
      stdout: '',
      stderr: err instanceof Error ? err.message : String(err),
      exitCode: -1,
      results: [],
      diagnostics: [],
    };
  }

  const results = (exec.results ?? []).map((r) => ({
    kind: (r as { kind?: string }).kind ?? 'result',
    status: (r as { status?: string }).status ?? 'unknown',
    detail:
      (r as { message?: string }).message ??
      (r as { detail?: string }).detail ??
      undefined,
  }));

  return {
    ok: f.ok && exec.exitCode === 0,
    stCode: f.stCode,
    execution: {
      ok: exec.exitCode === 0,
      exitCode: exec.exitCode,
      stdout: exec.stdout ?? '',
      stderr: exec.stderr ?? '',
      statuses: results.map((r) => r.status),
      results,
    },
    detectedPatterns: f.analysis?.detectedPatterns ?? [],
    atoms: Array.from(f.atoms ?? new Map()).map(([id, t]) => ({ id, text: t })),
    diagnostics: (f.diagnostics ?? []).map((d) => ({
      severity: d.severity,
      message: d.message,
    })),
    durationMs: Date.now() - startedAt,
  };
}
