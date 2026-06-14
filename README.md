# nlp-to-logic

**De texto natural a logica formal ejecutable.** Playground web que une dos
librerias del portafolio de [Steven Vallejo](https://github.com/stevenvo780):

- **[ST](https://github.com/stevenvo780/ST)** — lenguaje logico ejecutable con
  SAT solver CDCL propio, 11 perfiles logicos y 6333 tests.
- **[autologic](https://github.com/stevenvo780/auto.logic)** — formalizador de
  lenguaje natural a logica formal, **basado en reglas, sin IA**.

Escribes un argumento en espanol; autologic lo formaliza a codigo ST y ST lo
ejecuta. Tres paneles: texto natural | formula logica | resultado de ejecucion.
**Todo el pipeline corre en vivo, en proceso, sin base de datos ni GPU.**

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:3000
```

## Build

```bash
# Vercel fija NODE_ENV=production automaticamente. En local, en este entorno:
NODE_ENV=production npm run build
npm start
```

## Verificar el pipeline (sin Next)

```bash
npm run smoke
```

## Como funciona

Ver [`ARCHITECTURE.md`](./ARCHITECTURE.md) para el detalle completo: separacion
cliente/servidor, vendoring de las librerias, decisiones de version y limites
honestos del formalizador.

```
texto natural ──> autologic.formalize() ──> codigo ST ──> st-lang.evaluate() ──> resultado
   (cliente)         (serverless Node, /api/formalize, en proceso)              (3 paneles)
```

## Despliegue

Listo para Vercel (framework Next.js autodetectado). `_sources/` esta excluido
del deploy via `.vercelignore`; el artefacto desplegable son las libs compiladas
en `vendor/`.
