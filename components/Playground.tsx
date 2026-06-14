'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { PROFILES, statusHolds, statusLabel, type PipelineResult } from '@/lib/profiles';
import { EXAMPLES, FEATURED_EXAMPLES } from '@/lib/examples';

type Language = 'es' | 'en';

const DEFAULT_TEXT = EXAMPLES[0].text;

/**
 * Wrapper con Suspense requerido por Next.js cuando useSearchParams()
 * se usa en un componente de cliente (App Router).
 */
export default function Playground() {
  return (
    <Suspense fallback={null}>
      <PlaygroundInner />
    </Suspense>
  );
}

function PlaygroundInner() {
  const searchParams = useSearchParams();
  const [text, setText] = useState<string>(DEFAULT_TEXT);
  const [profile, setProfile] = useState<string>(EXAMPLES[0].profile);
  const [language, setLanguage] = useState<Language>('es');

  // Cargar ejemplo desde ?ejemplo=<id> (vinculado desde /casos)
  useEffect(() => {
    const id = searchParams?.get('ejemplo');
    if (!id) return;
    const ex = EXAMPLES.find((e) => e.id === id);
    if (!ex) return;
    setText(ex.text);
    setProfile(ex.profile);
  }, [searchParams]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PipelineResult | null>(null);

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/formalize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, profile, language }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail ? `${data.error} — ${data.detail}` : data.error ?? 'Error desconocido');
        setResult(null);
      } else {
        setResult(data as PipelineResult);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setResult(null);
    } finally {
      setLoading(false);
    }
  }, [text, profile, language]);

  const loadExample = useCallback((id: string) => {
    const ex = EXAMPLES.find((e) => e.id === id);
    if (!ex) return;
    setText(ex.text);
    setProfile(ex.profile);
    setResult(null);
    setError(null);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {/* Controles */}
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm text-muted">Perfil logico</label>
        <select
          value={profile}
          onChange={(e) => setProfile(e.target.value)}
          className="rounded-md border border-border bg-panel-2 px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
        >
          {PROFILES.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label} ({p.hint})
            </option>
          ))}
        </select>

        <label className="ml-2 text-sm text-muted">Idioma</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          className="rounded-md border border-border bg-panel-2 px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
        >
          <option value="es">Espanol</option>
          <option value="en">Ingles</option>
        </select>

        <button
          onClick={run}
          disabled={loading || !text.trim()}
          className="ml-auto rounded-md bg-accent px-5 py-2 text-sm font-semibold text-[var(--on-primary)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Procesando...' : 'Formalizar y ejecutar →'}
        </button>
      </div>

      {/* Ejemplos */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs uppercase tracking-wide text-muted">Ejemplos</span>
        {FEATURED_EXAMPLES.map((ex) => (
          <button
            key={ex.id}
            onClick={() => loadExample(ex.id)}
            title={ex.note}
            className="rounded-full border border-border bg-panel-2 px-3 py-1 text-xs text-muted transition hover:border-accent hover:text-foreground"
          >
            {ex.title}
          </button>
        ))}
      </div>

      {/* Tres paneles */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Panel title="1 · Texto natural" subtitle="entrada en lenguaje humano" accent="accent-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            spellCheck={false}
            className="thin-scroll h-72 w-full resize-none rounded-md border border-border bg-panel-2 p-3 font-sans text-sm leading-relaxed text-foreground outline-none focus:border-accent"
            placeholder="Escribe un argumento en lenguaje natural..."
          />
        </Panel>

        <Panel title="2 · Formula logica (ST)" subtitle="generada por autologic" accent="accent">
          <CodeBlock
            text={result?.stCode ?? '// El codigo ST aparecera aqui tras formalizar.'}
            empty={!result}
          />
          {result && result.detectedPatterns.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {result.detectedPatterns.map((p) => (
                <span
                  key={p}
                  className="rounded bg-accent/10 px-2 py-0.5 font-mono text-[11px] text-accent"
                >
                  {p}
                </span>
              ))}
            </div>
          )}
        </Panel>

        <Panel title="3 · Resultado de ejecucion" subtitle="evaluado por st-lang" accent="ok">
          <ResultPanel result={result} error={error} loading={loading} />
        </Panel>
      </div>
    </div>
  );
}

function Panel({
  title,
  subtitle,
  accent,
  children,
}: {
  title: string;
  subtitle: string;
  accent: 'accent' | 'accent-2' | 'ok';
  children: React.ReactNode;
}) {
  const bar =
    accent === 'accent'
      ? 'bg-accent'
      : accent === 'accent-2'
        ? 'bg-accent-2'
        : 'bg-ok';
  return (
    <section className="flex flex-col rounded-lg border border-border bg-panel p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className={`h-3 w-1 rounded-full ${bar}`} />
        <div>
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          <p className="text-xs text-muted">{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function CodeBlock({ text, empty }: { text: string; empty?: boolean }) {
  return (
    <pre
      className={`thin-scroll h-72 overflow-auto rounded-md border border-border bg-panel-2 p-3 font-mono text-xs leading-relaxed ${
        empty ? 'text-muted' : 'text-foreground'
      }`}
    >
      {text}
    </pre>
  );
}

function ResultPanel({
  result,
  error,
  loading,
}: {
  result: PipelineResult | null;
  error: string | null;
  loading: boolean;
}) {
  if (loading) {
    return <div className="h-72 animate-pulse rounded-md border border-border bg-panel-2" />;
  }
  if (error) {
    return (
      <div className="h-72 overflow-auto rounded-md border border-err/40 bg-err/5 p-3 text-sm text-err">
        {error}
      </div>
    );
  }
  if (!result) {
    return (
      <div className="flex h-72 items-center justify-center rounded-md border border-border bg-panel-2 text-sm text-muted">
        El resultado logico aparecera aqui.
      </div>
    );
  }

  return (
    <div className="thin-scroll flex h-72 flex-col gap-3 overflow-auto rounded-md border border-border bg-panel-2 p-3">
      {/* Resumen de statuses */}
      {result.execution.results.length > 0 ? (
        <div className="flex flex-col gap-2">
          {result.execution.results.map((r, i) => {
            const holds = statusHolds(r.status);
            return (
              <div
                key={i}
                className={`rounded-md border px-3 py-2 text-sm ${
                  holds
                    ? 'border-ok/40 bg-ok/5 text-ok'
                    : 'border-warn/40 bg-warn/5 text-warn'
                }`}
              >
                <span className="font-mono text-xs uppercase opacity-70">{r.kind}</span>
                <div className="font-semibold">{statusLabel(r.status)}</div>
                {r.detail && <div className="mt-1 text-xs opacity-80">{r.detail}</div>}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-sm text-muted">
          El codigo ST no produjo comandos logicos ejecutables (solo declaraciones).
        </div>
      )}

      {/* Salida cruda del interprete */}
      {result.execution.stdout && (
        <details className="text-xs">
          <summary className="cursor-pointer text-muted hover:text-foreground">
            Salida del interprete ST
          </summary>
          <pre className="thin-scroll mt-2 overflow-auto rounded bg-background p-2 font-mono text-foreground">
            {result.execution.stdout}
          </pre>
        </details>
      )}

      {/* Atomos (trazabilidad) */}
      {result.atoms.length > 0 && (
        <details className="text-xs">
          <summary className="cursor-pointer text-muted hover:text-foreground">
            Atomos extraidos ({result.atoms.length})
          </summary>
          <ul className="mt-2 space-y-1">
            {result.atoms.map((a) => (
              <li key={a.id} className="font-mono text-foreground">
                <span className="text-accent">{a.id}</span> = &quot;{a.text}&quot;
              </li>
            ))}
          </ul>
        </details>
      )}

      {/* Diagnosticos */}
      {result.diagnostics.length > 0 && (
        <details className="text-xs">
          <summary className="cursor-pointer text-muted hover:text-foreground">
            Diagnosticos ({result.diagnostics.length})
          </summary>
          <ul className="mt-2 space-y-1">
            {result.diagnostics.map((d, i) => (
              <li key={i} className="text-muted">
                <span className="uppercase opacity-70">{d.severity}:</span> {d.message}
              </li>
            ))}
          </ul>
        </details>
      )}

      <div className="mt-auto pt-1 text-[11px] text-muted">
        Pipeline en proceso · {result.durationMs} ms · exitCode {result.execution.exitCode}
      </div>
    </div>
  );
}
