'use client';

import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = false;

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <main className="mx-auto max-w-2xl px-4 py-12 text-center sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-foreground">Error</h1>
        <p className="mt-2 text-lg text-muted">Algo salió mal</p>
        <p className="mt-4 text-sm text-muted">
          {error?.message || 'Error desconocido en Órganon'}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => reset()}
            className="rounded-md bg-accent/10 px-4 py-2 text-sm text-accent transition hover:bg-accent/20"
          >
            Reintentar
          </button>
          <Link
            href="/"
            className="rounded-md border border-border px-4 py-2 text-sm text-muted transition hover:border-accent hover:text-foreground"
          >
            ← Volver al inicio
          </Link>
        </div>
      </main>
    </div>
  );
}
