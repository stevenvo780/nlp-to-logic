import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Casos validados — Órganon · Mouseîon',
  description:
    '11 casos difíciles validados de NLP a lógica formal en Órganon: texto en español a ST ejecutable. Cubre proposicional, deóntica, aristotélica, epistémica, temporal y aritmética.',
  alternates: {
    canonical: 'https://organon.stevenvallejo.com/casos',
  },
  openGraph: {
    type: 'website',
    url: 'https://organon.stevenvallejo.com/casos',
    siteName: 'Mouseîon',
    title: 'Casos validados — Órganon · Mouseîon',
    description:
      '11 casos difíciles validados de NLP a lógica formal en Órganon: texto en español a ST ejecutable.',
    locale: 'es_ES',
    images: [{ url: 'https://organon.stevenvallejo.com/og-image.png', width: 1200, height: 630, alt: 'Órganon — NLP a lógica formal · Mouseîon' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Casos validados — Órganon · Mouseîon',
    description: '11 casos difíciles validados de NLP a lógica formal en Órganon.',
    images: ['https://organon.stevenvallejo.com/og-image.png'],
  },
};

export default function CasosPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-8 flex items-center gap-2 text-sm text-muted">
        <Link href="/" className="hover:text-foreground">
          Órganon
        </Link>
        <span>/</span>
        <span className="text-foreground">casos validados</span>
      </nav>

      <header className="mb-10">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-md bg-ok/10 px-2 py-1 font-mono text-xs text-ok">
            11 casos · validados manualmente
          </span>
          <span className="rounded-md bg-accent/10 px-2 py-1 font-mono text-xs text-accent">
            autologic · reglas, sin LLM
          </span>
        </div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Casos validados — NLP a lógica formal
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted">
          Estos son argumentos reales (jurídicos, filosóficos, matemáticos) formalizados
          automáticamente por <strong className="text-foreground">autologic</strong> y comparados
          con la respuesta manual esperada. Todos los casos están en la suite de tests de
          auto.logic (<code className="text-accent">docs/validated-hard-cases-comparison.md</code>
          ). Puedes cargar cualquiera en el playground y ejecutarlo en vivo.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-md bg-accent/10 px-4 py-2 text-sm text-accent transition hover:bg-accent/20"
          >
            Abrir playground →
          </Link>
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm text-muted transition hover:border-accent hover:text-foreground"
          >
            Documentación ST →
          </Link>
        </div>
      </header>

      <div className="space-y-8">
        {CASOS.map((c) => (
          <CasoCard key={c.id} caso={c} />
        ))}
      </div>

      <section className="mt-12 rounded-lg border border-border bg-panel p-6">
        <h2 className="mb-3 text-lg font-bold text-foreground">
          Cómo se generan estas formalizaciones
        </h2>
        <div className="grid grid-cols-1 gap-6 text-sm leading-relaxed text-muted md:grid-cols-3">
          <div>
            <h3 className="mb-1 font-semibold text-foreground">1. Segmentación</h3>
            <p>
              El texto se divide en oraciones y cláusulas usando stemmers Snowball y análisis de
              puntuación. Cada cláusula se clasifica según su función discursiva (premisa,
              conclusión, negación, condicional...).
            </p>
          </div>
          <div>
            <h3 className="mb-1 font-semibold text-foreground">2. Detección de patrones</h3>
            <p>
              ~200 marcadores discursivos en ES/EN (&quot;si... entonces&quot;, &quot;por lo tanto&quot;, &quot;todo&quot;,
              &quot;ningún&quot;, &quot;es obligatorio&quot;...) activan patrones de inferencia: modus_ponens,
              hypothetical_syllogism, universal_generalization, etc.
            </p>
          </div>
          <div>
            <h3 className="mb-1 font-semibold text-foreground">3. Emisión ST</h3>
            <p>
              Los átomos extraídos se nombran con keywords del texto. Las reglas de inferencia
              detectadas se traducen a axiomas, derives y checks del perfil lógico seleccionado.
              El resultado es código ST ejecutable que produce derivaciones verificables.
            </p>
          </div>
        </div>
      </section>

      <footer className="mt-12 border-t border-border pt-6 text-sm text-muted">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <Link href="/" className="hover:text-foreground">
            ← Playground
          </Link>
          <Link href="/docs" className="hover:text-foreground">
            Documentación →
          </Link>
          <a
            href="https://github.com/stevenvo780/auto.logic"
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground"
          >
            auto.logic ↗
          </a>
          <span className="ml-auto">Órganon · autologic v2.2 · ST v4.15 · por Steven Vallejo</span>
        </div>
      </footer>
    </main>
  );
}

// ── Subcomponentes ────────────────────────────────────────────────────────────

function CasoCard({ caso }: { caso: Caso }) {
  const profileColor =
    caso.profile.startsWith('classical') ? 'text-accent' :
    caso.profile.startsWith('deontic') ? 'text-warn' :
    caso.profile.startsWith('epistemic') ? 'text-ok' :
    caso.profile.startsWith('aristotelian') ? 'text-accent-2' :
    caso.profile.startsWith('modal') ? 'text-accent' :
    caso.profile.startsWith('temporal') ? 'text-ok' :
    caso.profile.startsWith('arithmetic') ? 'text-accent-2' :
    'text-muted';

  return (
    <article className="rounded-lg border border-border bg-panel">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border p-5">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`font-mono text-xs ${profileColor}`}>{caso.profile}</span>
            {caso.patterns.map((p) => (
              <span
                key={p}
                className="rounded bg-border/50 px-1.5 py-0.5 font-mono text-[10px] text-muted"
              >
                {p}
              </span>
            ))}
          </div>
          <h2 className="mt-1 text-lg font-bold text-foreground">{caso.title}</h2>
          <p className="mt-1 text-sm text-muted">{caso.description}</p>
        </div>
        <Link
          href={`/?ejemplo=${caso.playgroundId}`}
          className="shrink-0 rounded-md bg-accent/10 px-3 py-1.5 text-xs text-accent transition hover:bg-accent/20"
        >
          Abrir en playground →
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-0 md:grid-cols-2">
        <div className="border-b border-border p-5 md:border-b-0 md:border-r">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
            Texto natural (entrada)
          </h3>
          <blockquote className="border-l-2 border-accent/40 pl-4 text-sm leading-relaxed text-foreground">
            {caso.texto}
          </blockquote>
        </div>

        <div className="p-5">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
            Codigo ST generado (extracto)
          </h3>
          <pre className="thin-scroll overflow-x-auto rounded-md border border-border bg-panel-2 p-3 font-mono text-[11px] leading-relaxed text-foreground">
            {caso.stExtracto}
          </pre>
        </div>
      </div>

      {caso.nota && (
        <div className="border-t border-border px-5 py-3">
          <p className="text-xs leading-relaxed text-muted">
            <span className="font-semibold text-foreground">Nota tecnica: </span>
            {caso.nota}
          </p>
        </div>
      )}
    </article>
  );
}

// ── Datos ─────────────────────────────────────────────────────────────────────

interface Caso {
  id: string;
  playgroundId: string;
  title: string;
  description: string;
  profile: string;
  patterns: string[];
  texto: string;
  stExtracto: string;
  nota?: string;
}

const CASOS: Caso[] = [
  {
    id: 'modus-ponens',
    playgroundId: 'modus-ponens',
    title: 'Modus ponens clásico',
    description: 'El patrón de inferencia más básico: de A→B y A se deriva B. Verificación de tautología incluida.',
    profile: 'classical.propositional',
    patterns: ['modus_ponens'],
    texto:
      'Si llueve, entonces la calle se moja. Está lloviendo. Por lo tanto, la calle se moja.',
    stExtracto: `logic classical.propositional

axiom regla_1 : LLUEVE -> CALLE_MOJA
axiom hecho_2 : LLOVIENDO

derive CALLE_MOJA from {regla_1, hecho_2}
check valid (LLUEVE -> CALLE_MOJA)`,
    nota: 'El formalizador detecta "si... entonces" como condicional, "está lloviendo" como hecho y "por lo tanto" como marcador de conclusión. Emite derive + check valid.',
  },
  {
    id: 'modus-tollens',
    playgroundId: 'modus-tollens',
    title: 'Modus tollens',
    description: 'Negación del consecuente implica negación del antecedente: ¬B, A→B ⊢ ¬A.',
    profile: 'classical.propositional',
    patterns: ['modus_tollens'],
    texto:
      'Si llueve, entonces la calle se moja. La calle no se moja. Por lo tanto, no llueve.',
    stExtracto: `logic classical.propositional

axiom regla_1 : LLUEVE -> CALLE_MOJA
axiom neg_2   : !(CALLE_MOJA)

derive !(LLUEVE) from {regla_1, neg_2}
check valid ((LLUEVE -> CALLE_MOJA) & !(CALLE_MOJA) -> !(LLUEVE))`,
    nota: '"no se moja" activa el extractor de negación. El formalizador emite axiom neg_N con negación explícita.',
  },
  {
    id: 'silogismo-hipotetico',
    playgroundId: 'silogismo-hipotetico',
    title: 'Silogismo hipotético',
    description: 'Cadena condicional: A→B, B→C ⊢ A→C. El formalizador detecta el patrón hypothetical_syllogism.',
    profile: 'classical.propositional',
    patterns: ['hypothetical_syllogism', 'conditional_chain'],
    texto:
      'Si estudio, entonces aprendo. Si aprendo, entonces apruebo el examen. Por lo tanto, si estudio, apruebo el examen.',
    stExtracto: `logic classical.propositional

axiom regla_1 : ESTUDIO -> APRENDO
axiom regla_2 : APRENDO -> APRUEBO_EXAMEN

derive ESTUDIO -> APRUEBO_EXAMEN from {regla_1, regla_2}
check valid ((ESTUDIO -> APRENDO) & (APRENDO -> APRUEBO_EXAMEN) -> (ESTUDIO -> APRUEBO_EXAMEN))`,
    nota: 'El patrón hypothetical_syllogism encadena dos condicionales. El check valid confirma que la transitividad es una tautología proposicional.',
  },
  {
    id: 'despacho-empresa',
    playgroundId: 'despacho-empresa',
    title: 'Obligacion contractual — despachar equipo',
    description: 'Cadena condicional de 3 eslabones con conjunción. Caso jurídico real de derecho contractual.',
    profile: 'classical.propositional',
    patterns: ['modus_ponens', 'hypothetical_syllogism', 'conditional_chain', 'conjunction_introduction'],
    texto:
      'Si el contrato fue firmado por el apoderado con poder vigente, entonces el acuerdo es formalmente válido. Si el acuerdo es formalmente válido y el pago inicial fue consignado, entonces se activa la obligación de entrega. Si se activa la obligación de entrega, entonces la empresa debe despachar el equipo. El apoderado tenía poder vigente y firmó el contrato. El pago inicial fue consignado. Por lo tanto, la empresa debe despachar el equipo.',
    stExtracto: `logic classical.propositional

axiom regla_1 : APODERADO_VIGENTE -> ACUERDO_VALIDO
axiom regla_3 : ACUERDO_VALIDO -> OBLIGACION_ENTREGA
axiom regla_5 : OBLIGACION_ENTREGA -> DESPACHAR_EQUIPO
axiom hecho_9 : APODERADO_VIGENTE
axiom hecho_10 : PAGO_CONSIGNADO

derive DESPACHAR_EQUIPO from {regla_1, regla_3, regla_5, hecho_9, hecho_10}`,
    nota: 'Uno de los 11 casos hard validados de auto.logic. El formalizador encadena 3 condicionales con modus ponens repetido y detecta la conjunción de hechos.',
  },
  {
    id: 'deontico-plagio',
    playgroundId: 'deontico-plagio',
    title: 'Plagio academico — obligacion y prohibicion',
    description: 'Caso de lógica deóntica: detección de plagio activa obligación de suspensión y prohibición de publicación.',
    profile: 'deontic.standard',
    patterns: ['modus_ponens', 'universal_generalization', 'universal_instantiation'],
    texto:
      'Todo revisor académico que detecte plagio grave está obligado a suspender la evaluación y a reportar el caso al comité de ética. Ningún coordinador editorial puede autorizar la publicación de un manuscrito suspendido. En este caso, el revisor detectó plagio grave. Por lo tanto, es obligatorio suspender la evaluación y está prohibido autorizar la publicación del manuscrito.',
    stExtracto: `logic deontic.standard

axiom a1 = EVALUACION_ACADEMICO_SUSPENDER_OBLIGADO
axiom a2 = REPORTAR_COMITE_ETICA_CASO
axiom a3 = !(COORDINADOR_PUBLICACION_MANUSCRITO_SUSPENDIDO)
axiom a8 = O(OBLIGATORIO_EVALUACION_SUSPENDER)
axiom a10 = PUBLICACION_MANUSCRITO_PROHIBIDO_AUTORIZAR

check valid (AUTORIZACION_EXCEPCIONAL -> P(PERMITIDO_REANUDAR_REVISION))`,
    nota: 'Caso hard validado. El perfil deontic.standard genera operadores O() (obligación) y P() (permisión). "ningún" activa negación sobre el cuantificador universal.',
  },
  {
    id: 'aristotelico-peritos',
    playgroundId: 'aristotelico-peritos',
    title: 'Peritos acreditados y dictámenes — silogística',
    description: 'Razonamiento jurídico aristotélico: universal + negación + instanciación múltiple sobre suspensión de peritos.',
    profile: 'aristotelian.syllogistic',
    patterns: ['universal_generalization', 'universal_instantiation', 'conjunction_introduction'],
    texto:
      'Todo perito acreditado que actúa en causas penales es auxiliar de la justicia. Ningún auxiliar de la justicia con suspensión vigente puede emitir dictamen vinculante. Todo dictamen vinculante integra el expediente principal. Por lo tanto, ningún perito acreditado con suspensión vigente puede emitir dictamen vinculante.',
    stExtracto: `logic aristotelian.syllogistic

axiom a1 = forall x auxili(x)
axiom a2 = SUSPENSION_VINCULANTE_AUXILIAR_JUSTICIA
axiom a3 = forall x dictam(x)

derive ACREDITADO_PENALES_NINGUN_PERITO from {a1, a2, a3, ...}
check valid ((...) -> ACREDITADO_PENALES_NINGUN_PERITO)`,
    nota: 'Caso hard validado. El formalizador identifica "todo" → forall, "ningún" → negación universal, y construye la regla de instanciación universal sobre los átomos extraídos.',
  },
  {
    id: 'epistemico-llave',
    playgroundId: 'epistemico-llave',
    title: 'Llave maestra — conocimiento anidado',
    description: 'Epistémica S5: conocimiento del administrador sobre acceso, con introspección positiva K(P)→K(K(P)).',
    profile: 'epistemic.s5',
    patterns: ['modus_ponens', 'hypothetical_syllogism'],
    texto:
      'El administrador sabe que la llave maestra abre todas las puertas del edificio. Si el administrador sabe que la llave maestra abre todas las puertas, entonces el administrador sabe que puede acceder a cualquier sala. Por lo tanto, el administrador puede acceder a cualquier sala.',
    stExtracto: `logic epistemic.s5

axiom a1 = K_admin(LLAVE_ABRE_PUERTAS)
axiom a2 = K_admin(LLAVE_ABRE_PUERTAS) -> K_admin(PUEDE_ACCEDER_SALA)

derive K_admin(PUEDE_ACCEDER_SALA) from {a1, a2}`,
    nota: 'Caso hard validado. El operador K_agente() se genera cuando el formalizador detecta "sabe que" seguido de un nombre de agente en el contexto epistémico S5.',
  },
  {
    id: 'kant',
    playgroundId: 'kant',
    title: 'Argumento kantiano — intuición pura y geometría',
    description: 'Formalización de la Crítica de la Razón Pura: cadena hipotética sobre intuición pura → geometría euclidiana posible.',
    profile: 'classical.propositional',
    patterns: ['hypothetical_syllogism', 'modus_ponens'],
    texto:
      'Si hay intuición pura, entonces es posible el juicio sintético a priori. Si es posible el juicio sintético a priori, entonces la geometría euclidiana es posible. Hay intuición pura del espacio y del tiempo. Por lo tanto, la geometría euclidiana es posible.',
    stExtracto: `logic classical.propositional

axiom kant1 : INTUICION_PURA -> JUICIO_SINTETICO
axiom kant2 : JUICIO_SINTETICO -> GEOMETRIA_POSIBLE
axiom kant3 : INTUICION_PURA

derive GEOMETRIA_POSIBLE from {kant1, kant2, kant3}
check valid (((INTUICION_PURA -> JUICIO_SINTETICO) & (JUICIO_SINTETICO -> GEOMETRIA_POSIBLE) & INTUICION_PURA) -> GEOMETRIA_POSIBLE)`,
    nota: 'Ejemplo filosófico de la Text Layer de ST. La cadena hipotética es una tautología proposicional: ((A→B)&(B→C)&A)→C. El check valid lo confirma.',
  },
  {
    id: 'temporal-falla',
    playgroundId: 'temporal',
    title: 'Falla y alerta — LTL',
    description: 'Lógica temporal lineal: propiedad de safety/liveness sobre sistemas de monitoreo de fallas.',
    profile: 'temporal.ltl',
    patterns: ['modus_ponens'],
    texto:
      'Siempre que se detecte una falla, eventualmente se debe emitir una alerta. Se detectó una falla. Por lo tanto, eventualmente se emitirá una alerta.',
    stExtracto: `logic temporal.ltl

axiom regla : G(FALLA_DETECTADA -> F(ALERTA_EMITIDA))
axiom hecho : FALLA_DETECTADA

prove F(ALERTA_EMITIDA)`,
    nota: 'Operadores LTL: G (globally / siempre), F (finally / eventualmente). El formalizador detecta "siempre que" → G(…→…) y "eventualmente" → F(…).',
  },
  {
    id: 'modal-leyes',
    playgroundId: 'modal',
    title: 'Necesidad de las leyes — Modal K',
    description: 'Lógica modal básica (sistema K): necesidad de las leyes implica posibilidad de sanción.',
    profile: 'modal.k',
    patterns: ['modus_ponens'],
    texto:
      'Es necesario que las leyes se cumplan. Si es necesario que las leyes se cumplan, entonces es posible sancionar.',
    stExtracto: `logic modal.k

axiom a1 : □(LEYES_CUMPLAN)
axiom a2 : □(LEYES_CUMPLAN) -> ◇(SANCIONAR)

prove ◇(SANCIONAR)`,
    nota: '"Es necesario que" → □(P) (operador de necesidad). "es posible" → ◇(P) (operador de posibilidad). Sistema K: sin axiomas adicionales de accesibilidad.',
  },
  {
    id: 'silogismo-barbara',
    playgroundId: 'silogismo-aristotelico',
    title: 'Silogismo Barbara — todo humano es mortal',
    description: 'El silogismo clásico más conocido: ∀x(H(x)→M(x)), H(s) ⊢ M(s). Aristotelian.syllogistic.',
    profile: 'aristotelian.syllogistic',
    patterns: ['universal_instantiation'],
    texto:
      'Todo ser humano es mortal. Sócrates es un ser humano. Por lo tanto, Sócrates es mortal.',
    stExtracto: `logic aristotelian.syllogistic

axiom mayor : forall x (humano(x) -> mortal(x))
axiom menor : humano(socrates)

derive mortal(socrates) from {mayor, menor}`,
    nota: 'Forma Barbara (AAA-1). "Todo" → forall, "es" (cópula) → predicado. El perfil aristotelian.syllogistic reconoce las cuatro formas categóricas: A (todo), E (ningún), I (algún), O (algún... no).',
  },
];
