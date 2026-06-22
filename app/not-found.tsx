import Link from 'next/link';

// Next.js 15 con App Router puro intenta pre-renderizar /404 usando un shell
// legacy de Pages Router (chunks/611.js) que llama useHtmlContext() sin
// provider. Forzar render dinamico evita ese flujo y delega a runtime.
// El fallback visual es identico al de app/page.tsx.
export const dynamic = 'force-dynamic';
export const revalidate = false;

export default function NotFound() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12 text-center sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-foreground">404</h1>
      <p className="mt-2 text-lg text-muted">No encontrado</p>
      <p className="mt-4 text-sm text-muted">
        La página que buscas no existe en Órganon.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-md bg-accent/10 px-4 py-2 text-sm text-accent transition hover:bg-accent/20"
      >
        ← Volver al inicio
      </Link>
    </main>
  );
}
