import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Documentación ST — Órganon · Mouseîon',
  description:
    'Referencia del lenguaje ST: 11 perfiles lógicos, SAT solver CDCL propio, comandos de derivación, scripting y API programática. El motor detrás de Órganon.',
  alternates: {
    canonical: 'https://organon.stevenvallejo.com/docs',
  },
  openGraph: {
    type: 'website',
    url: 'https://organon.stevenvallejo.com/docs',
    siteName: 'Mouseîon',
    title: 'Documentación ST — Órganon · Mouseîon',
    description:
      'Referencia del lenguaje ST: 11 perfiles lógicos, SAT solver CDCL propio, comandos de derivación, scripting y API programática.',
    locale: 'es_ES',
    images: [{ url: 'https://organon.stevenvallejo.com/og-image.png', width: 1200, height: 630, alt: 'Órganon — NLP a lógica formal · Mouseîon' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Documentación ST — Órganon · Mouseîon',
    description: 'Referencia del lenguaje ST: 11 perfiles lógicos, SAT CDCL propio, API programática.',
    images: ['https://organon.stevenvallejo.com/og-image.png'],
  },
};

export default function DocsPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-8 flex items-center gap-2 text-sm text-muted">
        <Link href="/" className="hover:text-foreground">
          Órganon
        </Link>
        <span>/</span>
        <span className="text-foreground">docs</span>
      </nav>

      <header className="mb-10">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-md bg-accent/10 px-2 py-1 font-mono text-xs text-accent">
            ST · v4.15
          </span>
          <span className="rounded-md bg-accent-2/10 px-2 py-1 font-mono text-xs text-accent-2">
            6333 tests
          </span>
          <span className="rounded-md bg-ok/10 px-2 py-1 font-mono text-xs text-ok">
            SAT CDCL propio
          </span>
        </div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          ST — Symbolic Theory Language
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted">
          ST es un lenguaje ejecutable para logica formal, argumentacion y formalización
          documental. Combina un motor logico multi-perfil (11 sistemas logicos), un SAT solver
          CDCL propio, scripting imperativo y una Text Layer para conectar formulas con texto
          humano. Este playground lo expone via API en proceso, sin base de datos ni GPU.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href="https://github.com/stevenvo780/ST"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm text-muted transition hover:border-accent hover:text-foreground"
          >
            github.com/stevenvo780/ST ↗
          </a>
          <Link
            href="/casos"
            className="inline-flex items-center gap-2 rounded-md bg-accent/10 px-4 py-2 text-sm text-accent transition hover:bg-accent/20"
          >
            Ver casos validados →
          </Link>
        </div>
      </header>

      <div className="space-y-10">
        {/* Estructura minima */}
        <Section title="1. Estructura minima de un script ST">
          <p className="mb-4 text-muted">
            Todo script ST comienza con una declaracion <Code>logic</Code> que selecciona el
            perfil logico activo. Luego se mezclan declaraciones (axiomas, teoremas, variables)
            con comandos ejecutables (derive, check, prove).
          </p>
          <CodeBlock>{`logic classical.propositional

axiom a1 : P -> Q
axiom a2 : P

derive Q from {a1, a2}
check valid (P | !P)`}</CodeBlock>
          <p className="mt-4 text-sm text-muted">
            La salida es estructurada: cada comando produce un resultado con{' '}
            <Code>status</Code> (<Code>provable</Code>, <Code>valid</Code>,{' '}
            <Code>satisfiable</Code>, etc.) que el playground muestra en el panel 3.
          </p>
        </Section>

        {/* Perfiles logicos */}
        <Section title="2. Perfiles logicos (11 sistemas)">
          <p className="mb-4 text-muted">
            El perfil determina la semantica, los operadores disponibles y el motor de
            decision. Un mismo argumento puede producir resultados distintos segun el perfil.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-2 pr-4 text-foreground">Perfil</th>
                  <th className="py-2 pr-4 text-foreground">Operadores clave</th>
                  <th className="py-2 text-foreground">Uso tipico</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-muted">
                {PROFILES_TABLE.map((p) => (
                  <tr key={p.id}>
                    <td className="py-2 pr-4 font-mono text-xs text-accent">{p.id}</td>
                    <td className="py-2 pr-4 font-mono text-xs">{p.ops}</td>
                    <td className="py-2 text-xs">{p.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* Comandos principales */}
        <Section title="3. Comandos de razonamiento">
          <div className="space-y-6">
            <CmdDoc
              cmd="derive <meta> from {<premisas>}"
              desc="Deriva una formula a partir de un conjunto explícito de premisas por nombre. Usa el motor de derivacion del perfil activo (resolucion, natural deduction, etc.)."
              example={`axiom a1 : P -> Q
axiom a2 : P
derive Q from {a1, a2}   // status: provable`}
            />
            <CmdDoc
              cmd="prove <formula>"
              desc="Prueba una formula desde la teoria acumulada (todos los axiomas declarados), sin lista explícita de premisas."
              example={`axiom a1 : P -> Q
axiom a2 : P
prove Q   // status: provable`}
            />
            <CmdDoc
              cmd="check valid <formula>"
              desc="Verifica si la formula es valida (tautologia) en el perfil activo. El SAT solver CDCL confirma que no hay modelo que la falsifique."
              example={`check valid (P | !P)        // valido (tautologia)
check valid (P -> Q)        // invalido (hay contramodelo)`}
            />
            <CmdDoc
              cmd="check satisfiable <formula>"
              desc="Verifica si existe al menos un modelo que satisfaga la formula."
              example={`check satisfiable (P & Q)   // satisfacible
check satisfiable (P & !P)  // insatisfacible`}
            />
            <CmdDoc
              cmd="check equivalent <f1>, <f2>"
              desc="Compara equivalencia logica entre dos formulas (ambas tienen los mismos modelos)."
              example={`check equivalent !(P & Q), (!P | !Q)   // De Morgan: equivalente`}
            />
            <CmdDoc
              cmd="countermodel <formula>"
              desc="Busca un modelo (asignacion de valores de verdad) que falsifique la formula. Util para encontrar contra-ejemplos."
              example={`countermodel (P -> Q)   // modelo: P=true, Q=false`}
            />
          </div>
        </Section>

        {/* Scripting */}
        <Section title="4. Scripting: variables, funciones y teorias">
          <p className="mb-4 text-muted">
            ST incluye un lenguaje de scripting completo que permite nombrar formulas, encapsular
            logica en funciones y agrupar conocimiento en teorias reutilizables.
          </p>
          <CodeBlock>{`logic classical.propositional

// Variables con etiqueta semantica
let regla = "Si estudio, apruebo" : (E -> A)
let hecho = "Estudio hoy"         : E

// Derivar usando alias
derive A from {regla, hecho}

// Funcion reutilizable
fn revisar(X) {
  check satisfiable X
  return X
}
revisar((P -> Q))

// Teoria encapsulada
theory CursoLogica {
  axiom base : E -> A
  theorem identidad : (P -> P)
}

print CursoLogica.base`}</CodeBlock>
        </Section>

        {/* Perfiles no clasicos */}
        <Section title="5. Logicas no clasicas — ejemplos">
          <div className="space-y-6">
            <SubSection title="Modal K — necesidad y posibilidad">
              <CodeBlock>{`logic modal.k

axiom ley_necesaria : □(L)          // Es necesario que se cumplan las leyes
axiom regla : □(L) -> ◇(S)         // Si es necesario L, es posible sancionar

prove ◇(S)                           // posible sancionar`}</CodeBlock>
            </SubSection>
            <SubSection title="Deontica — obligacion y prohibicion">
              <CodeBlock>{`logic deontic.standard

axiom pagar   : O(P)               // Es obligatorio pagar impuestos
axiom regla   : O(P) -> F(E)       // Si obligatorio pagar, prohibido evadir
                                   // F(x) = forbidden (prohibicion)
prove F(E)                          // prohibido evadir`}</CodeBlock>
            </SubSection>
            <SubSection title="Epistemica S5 — conocimiento">
              <CodeBlock>{`logic epistemic.s5

// K_a(P) = el agente 'a' sabe que P
axiom sabe_cerrado : K_juan(BANCO_CERRADO)
axiom regla        : K_juan(BANCO_CERRADO) -> !IRA_BANCO

prove !IRA_BANCO    // Juan no ira al banco`}</CodeBlock>
            </SubSection>
            <SubSection title="Aristotelica — silogismos">
              <CodeBlock>{`logic aristotelian.syllogistic

// forall / exists como en primer orden
axiom mayor : forall x (humano(x) -> mortal(x))
axiom menor : humano(socrates)

prove mortal(socrates)   // Modus Barbara`}</CodeBlock>
            </SubSection>
          </div>
        </Section>

        {/* Text Layer */}
        <Section title="6. Text Layer — formalizar documentos">
          <p className="mb-4 text-muted">
            La Text Layer de ST permite vincular pasajes de documentos con formulas formales y
            claims verificables. Es la caracteristica mas avanzada del lenguaje: convierte un
            documento de texto en una base de conocimiento verificable.
          </p>
          <CodeBlock>{`logic classical.propositional

// Declarar pasajes de un documento filosofico
let p1 = passage([[kant-critica.md#prolegomenos]])
let p2 = passage([[kant-critica.md#estetica-trascendental]])

// Formalizar los pasajes como formulas
let f1 = formalize p1 as (I -> J)   // Si hay intuicion pura → juicio sintetico a priori
let f2 = formalize p2 as (J -> G)   // Si juicio sintetico a priori → geometria posible

// Claims con soporte y nivel de confianza
claim c1 = f1
claim c2 = f2
support c1 <- p1
support c2 <- p2
confidence c1 = 0.92
confidence c2 = 0.88

// Derivacion formal del argumento kantiano
axiom intuicion : I   // Hay intuicion pura
axiom kant1     : I -> J
axiom kant2     : J -> G
derive G from {kant1, kant2, intuicion}   // La geometria euclidiana es posible`}</CodeBlock>
        </Section>

        {/* SAT CDCL */}
        <Section title="7. Motor SAT CDCL — tecnologia interna">
          <p className="mb-4 text-muted">
            El nucleo de ST es un SAT solver CDCL (Conflict-Driven Clause Learning) escrito
            enteramente en TypeScript. No delega a Z3 ni a binarios externos para el caso base;
            Z3 se carga de forma perezosa solo si una formula lo requiere explicitamente.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {SAT_FEATURES.map((f) => (
              <div key={f.title} className="rounded-lg border border-border bg-panel p-4">
                <h4 className="mb-1 text-sm font-semibold text-foreground">{f.title}</h4>
                <p className="text-xs leading-relaxed text-muted">{f.desc}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* API */}
        <Section title="8. API programatica (TypeScript)">
          <p className="mb-4 text-muted">
            Este playground usa directamente la API programatica de ST desde una funcion
            serverless de Vercel (runtime Node). No hay procesos hijos ni subshells.
          </p>
          <CodeBlock>{`import { evaluate, type STEvalResult } from '@stevenvo780/st-lang/api';

const source = \`
  logic classical.propositional
  axiom a1 : P -> Q
  axiom a2 : P
  derive Q from {a1, a2}
\`;

const result: STEvalResult = evaluate(source);
// result.results[0].status === 'provable'
// result.exitCode === 0
// result.stdout contiene la salida del interprete`}</CodeBlock>
          <p className="mt-4 text-sm text-muted">
            El tipo <Code>STEvalResult</Code> expone <Code>ok</Code>, <Code>exitCode</Code>,{' '}
            <Code>stdout</Code>, <Code>stderr</Code>, <Code>results</Code> (array de resultados
            estructurados) y <Code>diagnostics</Code>.
          </p>
        </Section>
      </div>

      <footer className="mt-12 border-t border-border pt-6 text-sm text-muted">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <Link href="/" className="hover:text-foreground">
            ← Volver al playground
          </Link>
          <Link href="/casos" className="hover:text-foreground">
            Casos validados →
          </Link>
          <a
            href="https://github.com/stevenvo780/ST"
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground"
          >
            Repositorio ST ↗
          </a>
          <span className="ml-auto">Órganon · ST v4.15 · 6333 tests · por Steven Vallejo</span>
        </div>
      </footer>
    </main>
  );
}

// ── Subcomponentes ────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-4 border-b border-border pb-2 text-xl font-bold text-foreground">
        {title}
      </h2>
      {children}
    </section>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold text-foreground">{title}</h3>
      {children}
    </div>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-panel px-1.5 py-0.5 font-mono text-[12px] text-accent">
      {children}
    </code>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="thin-scroll overflow-x-auto rounded-lg border border-border bg-panel-2 p-4 font-mono text-xs leading-relaxed text-foreground">
      {children}
    </pre>
  );
}

function CmdDoc({
  cmd,
  desc,
  example,
}: {
  cmd: string;
  desc: string;
  example: string;
}) {
  return (
    <div>
      <h3 className="mb-1 font-mono text-sm text-accent">{cmd}</h3>
      <p className="mb-2 text-sm text-muted">{desc}</p>
      <CodeBlock>{example}</CodeBlock>
    </div>
  );
}

// ── Datos ─────────────────────────────────────────────────────────────────────

const PROFILES_TABLE = [
  { id: 'classical.propositional', ops: '→  &  |  !  ↔  ^', use: 'Logica clasica, argumentacion basica' },
  { id: 'classical.first_order', ops: '∀  ∃  predicados', use: 'Razonamiento sobre individuos y propiedades' },
  { id: 'modal.k', ops: '□ (necesario)  ◇ (posible)', use: 'Mundos posibles, necesidad metafisica' },
  { id: 'deontic.standard', ops: 'O (obligacion)  P (permision)  F (prohibicion)', use: 'Etica, normas juridicas, compliance' },
  { id: 'epistemic.s5', ops: 'K_a (sabe a)  B_a (cree a)', use: 'Conocimiento, informacion multi-agente' },
  { id: 'intuitionistic.propositional', ops: 'sin tercero excluido, sin doble negacion', use: 'Matematicas constructivas, tipos dependientes' },
  { id: 'temporal.ltl', ops: 'X (next)  U (until)  G (always)  F (eventually)', use: 'Verificacion de sistemas, protocolos' },
  { id: 'paraconsistent.belnap', ops: '4 valores: T / F / B / N', use: 'Contradicciones sin explosion, bases de datos inconsistentes' },
  { id: 'aristotelian.syllogistic', ops: 'todo / algun / ningun + predicados', use: 'Silogismos, razonamiento juridico clasico' },
  { id: 'probabilistic.basic', ops: 'P(·) ∈ [0,1]  redes Bayesianas', use: 'Inferencia probabilistica, incertidumbre' },
  { id: 'arithmetic', ops: '+  *  =  <  ≤  mod', use: 'Propiedades aritmeticas, divisibilidad' },
];

const SAT_FEATURES = [
  {
    title: 'CDCL con VSIDS',
    desc: 'Conflict-Driven Clause Learning con heuristica VSIDS (Variable State Independent Decaying Sum) para seleccion de variables. Reinicios tipo Luby para evitar estancamientos.',
  },
  {
    title: 'SAT incremental',
    desc: 'Reutiliza el estado del solver entre consultas dentro del mismo script. Cache de derivaciones con memoizacion y theorem-cache persistente por sesion.',
  },
  {
    title: 'MUS — Minimal Unsatisfiable Subsets',
    desc: 'Diagnostica inconsistencias identificando el subconjunto minimo de clausulas que causan el conflicto. Util para depurar teorias.',
  },
  {
    title: 'Curry-Howard (type theory)',
    desc: 'Pruebas como programas: System F con polimorfismo parametrico, MLTT (Martin-Löf Type Theory), tipos dependientes y NbE (Normalizacion por Evaluacion).',
  },
  {
    title: 'Logica lineal y π-calculo',
    desc: 'Sublogicas estructurales (no-contraction, no-weakening), proof nets canonicos y razonamiento sobre procesos concurrentes.',
  },
  {
    title: 'Z3 como co-motor opcional',
    desc: 'Para formulas fuera del alcance del CDCL nativo (QBF, aritmetica no lineal), ST carga z3-solver de forma perezosa via import() dinamico. El playground NO activa este camino.',
  },
];
