import type { LogicProfileId } from './profiles';

export interface Example {
  id: string;
  title: string;
  text: string;
  profile: LogicProfileId;
  /** Que se demuestra con este caso. */
  note: string;
}

/**
 * Ejemplos curados. Todos son entrada REAL del playground: se escriben en el
 * panel de texto, se formalizan con autologic y se ejecutan con st-lang en vivo.
 * Se eligieron por ilustrar distintos perfiles logicos y patrones de inferencia
 * que el formalizador basado en reglas resuelve de forma robusta.
 *
 * Los casos marcados con [hard] son casos validados de la suite de tests de
 * auto.logic (docs/validated-hard-cases-comparison.md).
 */
export const EXAMPLES: Example[] = [
  // ── Basicos ────────────────────────────────────────────────────────────────
  {
    id: 'modus-ponens',
    title: 'Modus ponens',
    text: 'Si llueve, entonces la calle se moja. Está lloviendo. Por lo tanto, la calle se moja.',
    profile: 'classical.propositional',
    note: 'El patron clasico: de "A → B" y "A" se deriva "B". El formalizador detecta el patron modus_ponens y emite derive + check valid.',
  },
  {
    id: 'modus-tollens',
    title: 'Modus tollens',
    text: 'Si llueve, entonces la calle se moja. La calle no se moja. Por lo tanto, no llueve.',
    profile: 'classical.propositional',
    note: 'Negar el consecuente para negar el antecedente: ¬B, A→B ⊢ ¬A.',
  },
  {
    id: 'contraposicion',
    title: 'Contrapositiva (tautologia)',
    text: 'Si un numero es par, entonces es divisible entre dos.',
    profile: 'classical.propositional',
    note: 'ST verifica que (P→Q)→(¬Q→¬P) es valida (tautologia) en proposicional clasica.',
  },
  {
    id: 'silogismo-hipotetico',
    title: 'Silogismo hipotetico',
    text: 'Si estudio, entonces aprendo. Si aprendo, entonces apruebo el examen. Por lo tanto, si estudio, apruebo el examen.',
    profile: 'classical.propositional',
    note: 'Cadena condicional: A→B, B→C ⊢ A→C. El formalizador detecta el patron hypothetical_syllogism.',
  },
  // ── Logicas no clasicas ────────────────────────────────────────────────────
  {
    id: 'deontico',
    title: 'Obligacion deontica',
    text: 'Es obligatorio pagar impuestos. Si es obligatorio pagar impuestos, entonces está prohibido evadirlos.',
    profile: 'deontic.standard',
    note: 'Logica deontica: operador O() de obligacion. autologic detecta "es obligatorio" y genera O(P).',
  },
  {
    id: 'deontico-plagio',
    title: 'Plagio academico [hard]',
    text: 'Todo revisor académico que detecte plagio grave está obligado a suspender la evaluación y a reportar el caso al comité de ética. Ningún coordinador editorial puede autorizar la publicación de un manuscrito suspendido. En este caso, el revisor detectó plagio grave. Por lo tanto, es obligatorio suspender la evaluación y está prohibido autorizar la publicación del manuscrito.',
    profile: 'deontic.standard',
    note: 'Caso validado de la suite hard de auto.logic. Combina obligacion deontica, negacion y cuantificacion universal.',
  },
  {
    id: 'modal',
    title: 'Necesidad modal',
    text: 'Es necesario que las leyes se cumplan. Si es necesario que las leyes se cumplan, entonces es posible sancionar.',
    profile: 'modal.k',
    note: 'Logica modal K: □P (necesario P) y ◇Q (posible Q). El formalizador detecta "es necesario" → □.',
  },
  {
    id: 'epistemico',
    title: 'Conocimiento epistemico',
    text: 'Juan sabe que el banco está cerrado. Si Juan sabe que el banco está cerrado, entonces no irá al banco.',
    profile: 'epistemic.s5',
    note: 'Logica epistemica S5: operador K de conocimiento. "sabe que" → K_agente(P).',
  },
  {
    id: 'epistemico-llave',
    title: 'Llave maestra [hard]',
    text: 'El administrador sabe que la llave maestra abre todas las puertas del edificio. Si el administrador sabe que la llave maestra abre todas las puertas, entonces el administrador sabe que puede acceder a cualquier sala. Por lo tanto, el administrador puede acceder a cualquier sala.',
    profile: 'epistemic.s5',
    note: 'Caso validado de conocimiento anidado (epistemic S5). Demuestra introspección positiva: K(P) → K(K(P)).',
  },
  // ── Aristotelica ──────────────────────────────────────────────────────────
  {
    id: 'silogismo-aristotelico',
    title: 'Silogismo aristotelico',
    text: 'Todo ser humano es mortal. Sócrates es un ser humano. Por lo tanto, Sócrates es mortal.',
    profile: 'aristotelian.syllogistic',
    note: 'El silogismo Barbara clasico: ∀x(H(x)→M(x)), H(s) ⊢ M(s). Perfil aristotelian.syllogistic.',
  },
  {
    id: 'aristotelico-peritos',
    title: 'Peritos y dictamenes [hard]',
    text: 'Todo perito acreditado que actúa en causas penales es auxiliar de la justicia. Ningún auxiliar de la justicia con suspensión vigente puede emitir dictamen vinculante. Todo dictamen vinculante integra el expediente principal. Por lo tanto, ningún perito acreditado con suspensión vigente puede emitir dictamen vinculante.',
    profile: 'aristotelian.syllogistic',
    note: 'Caso validado de razonamiento juridico aristotelico. Universal + negacion + instanciacion multiple.',
  },
  // ── Clasica compleja ───────────────────────────────────────────────────────
  {
    id: 'despacho-empresa',
    title: 'Obligacion contractual [hard]',
    text: 'Si el contrato fue firmado por el apoderado con poder vigente, entonces el acuerdo es formalmente válido. Si el acuerdo es formalmente válido y el pago inicial fue consignado, entonces se activa la obligación de entrega. Si se activa la obligación de entrega, entonces la empresa debe despachar el equipo. El apoderado tenía poder vigente y firmó el contrato. El pago inicial fue consignado. Por lo tanto, la empresa debe despachar el equipo.',
    profile: 'classical.propositional',
    note: 'Caso validado: cadena condicional larga (3 eslabones) + conjuncion. Demuestra el patron conditional_chain + modus_ponens encadenado.',
  },
  // ── Temporal ──────────────────────────────────────────────────────────────
  {
    id: 'temporal',
    title: 'Propiedad temporal (LTL)',
    text: 'Siempre que se detecte una falla, eventualmente se debe emitir una alerta. Se detectó una falla. Por lo tanto, eventualmente se emitirá una alerta.',
    profile: 'temporal.ltl',
    note: 'Logica temporal lineal LTL: G (siempre) y F (eventualmente). El formalizador detecta "siempre que" → G(·→·) y "eventualmente" → F(·).',
  },
  // ── Filosofia ─────────────────────────────────────────────────────────────
  {
    id: 'kant',
    title: 'Argumento kantiano',
    text: 'Si hay intuición pura, entonces es posible el juicio sintético a priori. Si es posible el juicio sintético a priori, entonces la geometría euclidiana es posible. Hay intuición pura del espacio y del tiempo. Por lo tanto, la geometría euclidiana es posible.',
    profile: 'classical.propositional',
    note: 'Argumento central de la Critica de la Razon Pura de Kant formalizado: cadena hipotetica + modus ponens sobre intuicion pura.',
  },
  // ── Perfiles faltantes ────────────────────────────────────────────────────
  {
    id: 'first-order-silogismo',
    title: 'Lógica de primer orden — universales',
    text: 'Todo número par es divisible entre dos. Ocho es par. Por lo tanto, ocho es divisible entre dos.',
    profile: 'classical.first_order',
    note: 'Primer orden clásico: cuantificación universal y predicados. ∀x(par(x) → divisible(x,2)), par(8) ⊢ divisible(8,2).',
  },
  {
    id: 'intuicionista-prueba',
    title: 'Lógica intuicionista — construcción de pruebas',
    text: 'Para cada proposición, o bien se puede construir una prueba, o bien no. Si construyo una prueba de P, entonces P es verdadera. Construí una prueba de P. Por lo tanto, P es verdadera.',
    profile: 'intuitionistic.propositional',
    note: 'Intuicionismo: no vale el tercero excluido (P | ¬P no es válido). Se enfatiza la construcción de pruebas sobre falsedad clásica.',
  },
  {
    id: 'paraconsistente-contradiccion',
    title: 'Lógica paraconsistente Belnap — tolerancia de contradicciones',
    text: 'El sistema afirma que es obligatorio verificar la información. El sistema también afirma que no es obligatorio verificar. Ni la lógica clásica ni el paraconsistente permiten que ambas sean verdaderas, pero Belnap permite ambas con 4 valores de verdad.',
    profile: 'paraconsistent.belnap',
    note: 'Belnap: 4 valores (true, false, both, neither). Permite contradicciones sin explosión lógica (A & ¬A ⊬ B).',
  },
  {
    id: 'probabilistica-bayes',
    title: 'Lógica probabilística — inferencia bayesiana',
    text: 'La probabilidad de lluvia es 0.3. Si llueve, la probabilidad de que la calle esté mojada es 0.9. La probabilidad inicial de que la calle esté mojada es 0.2. Observamos que la calle está mojada. ¿Cuál es la probabilidad actualizada de lluvia?',
    profile: 'probabilistic.basic',
    note: 'Probabilística: P(X) ∈ [0,1]. Demuestra inferencia bayesiana con actualización de creencias mediante observaciones.',
  },
  {
    id: 'aritmetica-divisibilidad',
    title: 'Aritmética — propiedades de divisibilidad',
    text: 'Si un número es divisible entre 6, entonces es divisible entre 2 y entre 3. Doce es divisible entre 6. Por lo tanto, doce es divisible entre 2.',
    profile: 'arithmetic',
    note: 'Aritmética: operadores +, *, =, <, mod. Verifica propiedades numéricas como divisibilidad y relaciones de orden.',
  },
];

/** Subset mas corto para el panel de botones de ejemplos en el Playground. */
export const FEATURED_EXAMPLES = EXAMPLES.filter((e) =>
  [
    'modus-ponens',
    'modus-tollens',
    'silogismo-hipotetico',
    'deontico',
    'modal',
    'epistemico',
    'silogismo-aristotelico',
    'kant',
  ].includes(e.id),
);
