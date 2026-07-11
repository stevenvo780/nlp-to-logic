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
  let f: FormalizationResult;
  try {
    f = formalize(text, {
      profile,
      language,
      validateOutput: false,
      includeComments: true,
    });
  } catch {
    // Error en formalización: log en servidor, no exponer al cliente
    return {
      ok: false,
      stCode: '',
      execution: {
        ok: false,
        exitCode: -1,
        stdout: '',
        stderr: 'Error en la formalización del texto.',
        statuses: [],
        results: [],
      },
      detectedPatterns: [],
      atoms: [],
      diagnostics: [
        {
          severity: 'error',
          message: 'Formalización fallida. Revise el formato de su entrada.',
        },
      ],
      durationMs: Date.now() - startedAt,
    };
  }

  // 2. Ejecutar el codigo ST en proceso con la API de st-lang (con timeout implícito).
  let exec: STEvalResult;
  try {
    exec = evaluate(f.stCode);
  } catch {
    // Error en evaluación: log en servidor, no exponer al cliente
    exec = {
      ok: false,
      stdout: '',
      stderr: 'Error en la evaluación del código lógico.',
      exitCode: -1,
      results: [],
      diagnostics: [],
    };
  }

  // Límites de tamaño para evitar respuestas masivas
  const MAX_STCODE_SIZE = 50000;
  const MAX_STDOUT_SIZE = 100000;
  const MAX_STDERR_SIZE = 5000;
  const MAX_ATOMS = 1000;
  const MAX_DIAGNOSTICS = 100;

  const results = (exec.results ?? [])
    .slice(0, 100) // Limitar resultados
    .map((r) => ({
      kind: (r as { kind?: string }).kind ?? 'result',
      status: (r as { status?: string }).status ?? 'unknown',
      detail:
        (r as { message?: string }).message ??
        (r as { detail?: string }).detail ??
        undefined,
    }));

  const stCodeSanitized = (f.stCode ?? '')
    .substring(0, MAX_STCODE_SIZE)
    .trim();
  const stdoutSanitized = ((exec.stdout ?? '')
    .substring(0, MAX_STDOUT_SIZE))
    .trim();
  const stderrSanitized = ((exec.stderr ?? '')
    .substring(0, MAX_STDERR_SIZE))
    .trim();

  return {
    ok: f.ok && exec.exitCode === 0,
    stCode: stCodeSanitized,
    execution: {
      ok: exec.exitCode === 0,
      exitCode: exec.exitCode,
      stdout: stdoutSanitized,
      stderr: stderrSanitized,
      statuses: results.map((r) => r.status),
      results,
    },
    detectedPatterns: (f.analysis?.detectedPatterns ?? []).slice(0, 50),
    atoms: Array.from(f.atoms ?? new Map())
      .slice(0, MAX_ATOMS)
      .map(([id, t]) => ({ id, text: t })),
    diagnostics: (f.diagnostics ?? [])
      .slice(0, MAX_DIAGNOSTICS)
      .map((d) => ({
        severity: d.severity,
        message: d.message.substring(0, 500),
      })),
    durationMs: Date.now() - startedAt,
  };
}
