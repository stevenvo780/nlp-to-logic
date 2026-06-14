import { NextRequest, NextResponse } from 'next/server';
import { runPipeline } from '@/lib/pipeline';
import type { LogicProfile, Language } from '@stevenvo780/autologic';

/**
 * Runtime Node (no Edge): el interprete de ST y el formalizador de autologic
 * son codigo TS puro que corre en proceso. No usan DB, GPU ni binarios nativos
 * (el SAT solver CDCL es TS; Z3 se carga perezosamente solo si se necesita).
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const MAX_TEXT_LENGTH = 4000;

export async function POST(req: NextRequest) {
  let body: { text?: string; profile?: string; language?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Cuerpo JSON invalido.' }, { status: 400 });
  }

  const text = (body.text ?? '').toString();
  if (!text.trim()) {
    return NextResponse.json({ error: 'El texto esta vacio.' }, { status: 400 });
  }
  if (text.length > MAX_TEXT_LENGTH) {
    return NextResponse.json(
      { error: `El texto supera el limite de ${MAX_TEXT_LENGTH} caracteres.` },
      { status: 413 },
    );
  }

  const profile = (body.profile ?? 'classical.propositional') as LogicProfile;
  const language = (body.language === 'en' ? 'en' : 'es') as Language;

  try {
    const result = runPipeline(text, { profile, language });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      {
        error: 'Fallo el pipeline de formalizacion/ejecucion.',
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }
}
