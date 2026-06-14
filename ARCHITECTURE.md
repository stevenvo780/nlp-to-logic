# nlp-to-logic — Arquitectura

> Playground web que une dos librerias del portafolio de Steven Vallejo:
> **ST** (lenguaje logico ejecutable con SAT solver CDCL propio, 6333 tests) y
> **autologic** (formalizador NLP -> logica formal, basado en reglas, sin IA).
> El usuario escribe un argumento en lenguaje natural y ve, en tres paneles, la
> formula logica generada y el resultado de ejecutarla.

---

## 1. Decision clave: el pipeline es 100% interactivo y en proceso

La pregunta de diseno era si compilar ST a WASM, exponer autologic como API
Python serverless, o entregar ejemplos pre-generados. **Ninguna fue necesaria.**

Tras inspeccionar las fuentes se confirmo que:

- **ST** es TypeScript puro. Su API programatica (`@stevenvo780/st-lang/api` →
  `evaluate(source)`) ejecuta codigo ST completamente en proceso. El SAT solver
  CDCL es TS nativo. La unica dependencia nativa (`z3-solver`, WASM) se carga de
  forma **perezosa** (`await import('z3-solver')`) solo si una formula la
  necesita; el nucleo no la requiere.
- **autologic** es TypeScript puro con NLP basado en reglas (stemmers Snowball,
  ~200 marcadores discursivos, deteccion de patrones). Su unica dependencia
  "pesada" (`@huggingface/transformers`) pertenece a un camino LLM opcional
  cargado dinamicamente (`Function('return import(...)')`) que **este playground
  no usa**.

Conclusion: ambas corren en una **funcion serverless de Vercel (runtime Node)**
sin DB, sin GPU y sin procesos hijos. **Todo lo que el usuario escribe se
formaliza y ejecuta en vivo.** No hay respuestas pre-grabadas. Los "ejemplos"
del UI son solo entradas de texto que rellenan el panel y disparan el mismo
pipeline real.

### Lo unico que NO es interactivo

Nada de la logica. Las unicas constantes estaticas son metadatos de UI (lista de
perfiles logicos, etiquetas de estado) en `lib/profiles.ts`.

---

## 2. Como entran las fuentes

```
_sources/            (gitignored, NO se despliega — 1.3 GB con node_modules)
  ST/                git clone de stevenvo780/ST        → npm i && npm run build
  auto.logic/        git clone de stevenvo780/auto.logic → npm i && npm run build

vendor/              (SI se versiona y despliega — artefacto compilado, ~8 MB)
  st-lang/           dist/ + package.json limpio (solo libreria, sin CLI)
  autologic/         dist/ + package.json limpio
```

El flujo de revival fue:

1. Clonar ambos repos en `_sources/`.
2. `npm install && npm run build` en cada uno (ST construye 834 archivos TS;
   autologic se construye contra st-lang 4.x de npm).
3. Copiar los `dist/` resultantes a `vendor/<lib>/`, junto a un `package.json`
   saneado:
   - Se elimino la CLI de ST (`dist/cli`) y sus deps de terminal
     (`chalk`, `commander`) — el playground solo usa la API de libreria.
   - Se quitaron sourcemaps y `.d.ts.map` para aligerar.
   - `z3-solver` y `@huggingface/transformers` quedaron como
     `optionalDependencies` (el codigo que las usa es lazy; si no estan,
     degrada con elegancia).
4. La app raiz declara `vendor/*` como **npm workspaces**, asi
   `@stevenvo780/st-lang` y `@stevenvo780/autologic` se resuelven por symlink
   desde la app y desde el navegador del data-room son los mismos binarios
   revividos.

> Reconstruir `vendor/` desde cero: ver `scripts/rebuild-vendor.sh`.

---

## 3. Flujo de una peticion

```
 Navegador (components/Playground.tsx, "use client")
   │  POST /api/formalize  { text, profile, language }
   ▼
 app/api/formalize/route.ts   (runtime = "nodejs")
   │  runPipeline(text, opts)            ── lib/pipeline.ts (import 'server-only')
   │    1) autologic.formalize(text, { validateOutput:false })   → codigo ST
   │    2) st-lang.evaluate(stCode)                               → resultados
   ▼
 JSON { stCode, execution{statuses,results,stdout}, detectedPatterns,
        atoms, diagnostics, durationMs }
   │
   ▼
 Tres paneles: 1·texto natural | 2·formula ST | 3·resultado de ejecucion
```

Detalle importante: `formalize()` se llama con `validateOutput:false`
**a proposito**. Con `true`, autologic valida lanzando un **proceso hijo de
Node** (`spawnSync(process.execPath, ['-e', runner])`), fragil en serverless. En
su lugar ejecutamos ST nosotros mismos con su API en el mismo proceso: mas
limpio, mas rapido (~10 ms end-to-end) y serverless-safe.

---

## 4. Separacion cliente / servidor (critico)

El motor es codigo Node-only (usa `node:fs`, `worker_threads` en caminos
opcionales). Si entrara al bundle del navegador, el build rompe. Por eso:

- `lib/pipeline.ts` → `import 'server-only'` + imports del motor. Solo servidor.
- `lib/profiles.ts` → constantes/tipos puros, sin imports del motor. Es lo unico
  que toca el componente de cliente.
- `next.config.ts` → `serverExternalPackages: ['@stevenvo780/st-lang',
  '@stevenvo780/autologic', 'z3-solver']` para que Node los resuelva por
  `require` en runtime y no se empaqueten (evita arrastrar `node:fs`/worker al
  bundle). `outputFileTracingIncludes` mete `vendor/**` en la funcion.

Verificacion: el First Load JS de `/` es ~106 kB — el motor NO esta en el
cliente.

---

## 5. Stack y versiones (y una nota honesta)

- **Next.js 15.5.19** (App Router) + **React 19.0.0**, versiones fijas (sin `^`).
- Tailwind CSS 4, TypeScript 5.

> Nota honesta: el objetivo pedia "Next.js 15". `create-next-app@latest` instala
> hoy Next **16.2.9**, pero esa version tiene una regresion de prerender
> (`TypeError: Cannot read properties of null (reading 'useContext')` al exportar
> `/_not-found` y `/_global-error`) que **se reproduce en un scaffold pristino,
> sin tocar nada**. Por eso se fijo Next 15.5.19 + React 19.0.0, combo estable
> que ademas cumple el objetivo. Las versiones quedan pineadas para no derivar
> de nuevo a 16.x.

### Caveat de build local en este entorno

Este sandbox exporta `NODE_ENV=development` en el perfil de shell, lo que rompe
el export estatico de las paginas de error de Next durante `next build`. Por eso
los builds locales se corren con `NODE_ENV=production npm run build`. **En Vercel
no aplica**: Vercel fija `NODE_ENV=production` automaticamente.

---

## 6. Estructura del proyecto

```
nlp-to-logic/
├── app/
│   ├── api/formalize/route.ts   # endpoint serverless (Node) del pipeline
│   ├── layout.tsx               # metadata, fuentes
│   ├── page.tsx                 # landing + <Playground/> + secciones honestas
│   └── globals.css              # tema oscuro tecnico (Tailwind 4)
├── components/
│   └── Playground.tsx           # UI de 3 paneles ("use client")
├── lib/
│   ├── pipeline.ts              # runPipeline() — SOLO servidor
│   ├── profiles.ts              # constantes/tipos — cliente y servidor
│   └── examples.ts              # ejemplos curados (entradas reales)
├── scripts/
│   ├── smoke.mjs                # prueba el pipeline sin Next (npm run smoke)
│   └── rebuild-vendor.sh        # reconstruye vendor/ desde _sources/
├── vendor/                      # libs revividas, compiladas (se despliega)
│   ├── st-lang/  (dist + package.json)
│   └── autologic/(dist + package.json)
├── _sources/                    # clones de origen (gitignored, no deploy)
├── next.config.ts
└── package.json                 # workspaces: ["vendor/*"]
```

---

## 7. Limites honestos del formalizador

autologic es **basado en reglas, no un LLM**. Eso es una virtud (cero
alucinacion, cada formula trazable al texto fuente) y un limite:

- Brilla con argumentos bien estructurados: condicionales, modus
  ponens/tollens, silogismos, operadores modales/deonticos/epistemicos.
- Con prosa muy libre o **correferencias ambiguas** puede generar atomos que no
  casan exactamente (ej.: "la calle se moja" vs "la calle esta mojada" generan
  atomos distintos), produciendo un resultado `indeterminado` / `refutable`.

El UI es explicito sobre esto en la seccion "Limites honestos". Los ejemplos
curados (`lib/examples.ts`) se eligieron entre los que el formalizador resuelve
de forma robusta (status `provable`).
