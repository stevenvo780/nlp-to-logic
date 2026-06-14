import Link from 'next/link';
import Playground from '@/components/Playground';

// useSearchParams en Playground require que la pagina no sea estatica
export const dynamic = 'force-dynamic';

const STLANG_VERSION = 'v4.15';
const AUTOLOGIC_VERSION = 'v2.2';

export default function Home() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <nav className="mb-6 flex flex-wrap items-center gap-4 text-sm">
          <span className="rounded-md bg-accent/10 px-2 py-1 font-mono text-xs text-accent">
            nlp → logic
          </span>
          <span className="font-mono text-xs text-muted">
            ST · 6333 tests · SAT CDCL · 11 perfiles logicos
          </span>
          <div className="ml-auto flex items-center gap-4">
            <Link
              href="/casos"
              className="text-muted transition hover:text-foreground"
            >
              Casos validados
            </Link>
            <Link
              href="/docs"
              className="text-muted transition hover:text-foreground"
            >
              Documentacion ST
            </Link>
            <a
              href="https://github.com/stevenvo780/ST"
              target="_blank"
              rel="noreferrer"
              className="text-muted transition hover:text-foreground"
            >
              GitHub ↗
            </a>
          </div>
        </nav>

        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          De texto natural a logica formal ejecutable
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted">
          Escribe un argumento en espanol.{' '}
          <a
            href="https://github.com/stevenvo780/auto.logic"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-foreground hover:text-accent"
          >
            autologic
          </a>{' '}
          lo formaliza a codigo logico{' '}
          <strong className="text-foreground">sin usar IA</strong> (NLP basado en reglas),
          y{' '}
          <a
            href="https://github.com/stevenvo780/ST"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-foreground hover:text-accent"
          >
            ST
          </a>{' '}
          lo ejecuta con su motor logico (SAT solver CDCL propio, derivaciones, validez,
          contramodelos). Todo el pipeline corre en vivo, en proceso, sin base de datos ni
          modelos de lenguaje.
        </p>
      </header>

      <Playground />

      {/* Tarjetas explicativas */}
      <section className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        <InfoCard title="Que es interactivo">
          <p>
            <strong className="text-foreground">Todo el pipeline es en vivo.</strong> El texto
            que escribes se formaliza y se ejecuta en una funcion serverless de Vercel (runtime
            Node), llamando en proceso a las dos librerias. No hay respuestas pre-grabadas;
            cada peticion recorre el pipeline completo (~10 ms).
          </p>
        </InfoCard>
        <InfoCard title="Como funciona por dentro">
          <p>
            1.{' '}
            <code className="text-accent">autologic.formalize()</code> segmenta el texto,
            detecta ~200 marcadores discursivos y patrones de inferencia (modus ponens,
            silogismo hipotetico, cuantificadores...), y emite codigo ST.
          </p>
          <p className="mt-2">
            2. <code className="text-accent">st-lang.evaluate()</code> parsea y ejecuta ese
            codigo, devolviendo el estado logico de cada derivacion o verificacion (
            <code className="text-ok">provable</code>,{' '}
            <code className="text-warn">satisfiable</code>,{' '}
            <code className="text-err">refutable</code>...).
          </p>
        </InfoCard>
        <InfoCard title="Limites honestos">
          <p>
            El formalizador es{' '}
            <strong className="text-foreground">basado en reglas</strong>, no un LLM: brilla
            con argumentos estructurados (condicionales, silogismos, operadores
            modales/deonticos) y puede devolver{' '}
            <code className="text-warn">indeterminado</code> con prosa libre o
            correferencias ambiguas. Eso es por diseno: cero alucinacion, trazabilidad total.
          </p>
        </InfoCard>
      </section>

      {/* Tecnologia */}
      <section className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <TechCard
          title="ST — Symbolic Theory Language"
          badge="6333 tests · SAT CDCL propio"
          badgeColor="accent"
          href="https://github.com/stevenvo780/ST"
          docsHref="/docs"
        >
          <p>
            Lenguaje ejecutable de logica formal con 11 perfiles (proposicional, modal,
            deontico, epistemico, intuicionista, temporal LTL, paraconsistente Belnap,
            aristotelico, probabilistico, aritmetica y primer orden). El SAT solver CDCL es
            TypeScript puro con VSIDS, clause learning y reinicios Luby. Z3 se carga
            perezosamente solo si se necesita.
          </p>
          <ul className="mt-3 space-y-1 text-xs text-muted">
            <li>Derivaciones, tablas de verdad, contramodelos, MUS</li>
            <li>Curry-Howard, System F, tipos dependientes (MLTT)</li>
            <li>Text Layer: vincular pasajes de documentos con formulas</li>
            <li>CLI, REPL, API programatica (este playground la usa)</li>
          </ul>
        </TechCard>

        <TechCard
          title="auto.logic — NLP → logica sin IA"
          badge="bilingüe ES/EN · zero runtime deps"
          badgeColor="accent-2"
          href="https://github.com/stevenvo780/auto.logic"
          docsHref="/casos"
          docsLabel="Ver casos validados"
        >
          <p>
            Formalizador NLP basado en reglas: stemmers Snowball, ~200 marcadores discursivos
            en espanol e ingles, deteccion de patrones de inferencia. Convierte oraciones a
            codigo ST sin modelos de lenguaje, sin APIs externas, con trazabilidad total de
            cada atom → texto fuente.
          </p>
          <ul className="mt-3 space-y-1 text-xs text-muted">
            <li>Patrones: modus_ponens, modus_tollens, hypothetical_syllogism</li>
            <li>Cuantificadores: universal_generalization, universal_instantiation</li>
            <li>Operadores modales/deonticos/epistemicos detectados por marcadores</li>
            <li>11 casos dificiles validados manualmente (juridicos, filosoficos, matematicos)</li>
          </ul>
        </TechCard>
      </section>

      <footer className="mt-12 border-t border-border pt-6 text-sm text-muted">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <Link href="/casos" className="hover:text-foreground">
            Casos validados
          </Link>
          <Link href="/docs" className="hover:text-foreground">
            Documentacion ST
          </Link>
          <a
            className="hover:text-foreground"
            href="https://github.com/stevenvo780/ST"
            target="_blank"
            rel="noreferrer"
          >
            github.com/stevenvo780/ST ↗
          </a>
          <a
            className="hover:text-foreground"
            href="https://github.com/stevenvo780/auto.logic"
            target="_blank"
            rel="noreferrer"
          >
            github.com/stevenvo780/auto.logic ↗
          </a>
          <span className="ml-auto">
            Steven Vallejo · ST {STLANG_VERSION} · autologic {AUTOLOGIC_VERSION}
          </span>
        </div>
      </footer>
    </main>
  );
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-panel p-5">
      <h3 className="mb-2 text-sm font-semibold text-foreground">{title}</h3>
      <div className="text-sm leading-relaxed text-muted">{children}</div>
    </div>
  );
}

function TechCard({
  title,
  badge,
  badgeColor,
  href,
  docsHref,
  docsLabel = 'Documentacion →',
  children,
}: {
  title: string;
  badge: string;
  badgeColor: 'accent' | 'accent-2';
  href: string;
  docsHref: string;
  docsLabel?: string;
  children: React.ReactNode;
}) {
  const badgeClass = badgeColor === 'accent'
    ? 'bg-accent/10 text-accent'
    : 'bg-accent-2/10 text-accent-2';
  return (
    <div className="rounded-lg border border-border bg-panel p-5">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className={`rounded-md px-2 py-0.5 font-mono text-xs ${badgeClass}`}>
          {badge}
        </span>
      </div>
      <h3 className="mb-2 text-base font-bold text-foreground">{title}</h3>
      <div className="text-sm leading-relaxed text-muted">{children}</div>
      <div className="mt-4 flex gap-4 text-xs">
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="text-muted hover:text-foreground"
        >
          GitHub ↗
        </a>
        <Link href={docsHref} className="text-accent hover:brightness-110">
          {docsLabel}
        </Link>
      </div>
    </div>
  );
}
