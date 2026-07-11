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
const VALID_PROFILES: LogicProfile[] = [
  'classical.propositional',
  'classical.first_order',
  'modal.k',
  'deontic.standard',
  'epistemic.s5',
  'intuitionistic.propositional',
  'temporal.ltl',
  'paraconsistent.belnap',
  'aristotelian.syllogistic',
  'probabilistic.basic',
  'arithmetic',
];

export async function POST(req: NextRequest) {
  let body: { text?: string; profile?: string; language?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Cuerpo JSON invalido.' }, { status: 400 });
  }

  // Validar type de text
  if (typeof body.text !== 'string') {
    return NextResponse.json({ error: 'El campo text debe ser string.' }, { status: 400 });
  }
  const text = body.text;
  if (!text.trim()) {
    return NextResponse.json({ error: 'El texto esta vacio.' }, { status: 400 });
  }
  if (text.length > MAX_TEXT_LENGTH) {
    return NextResponse.json(
      { error: `El texto supera el limite de ${MAX_TEXT_LENGTH} caracteres.` },
      { status: 413 },
    );
  }

  // Validar profile contra whitelist
  const DEFAULT_PROFILE = 'classical.propositional' as LogicProfile;
  const profileCandidate = body.profile ? String(body.profile) : DEFAULT_PROFILE;
  if (!VALID_PROFILES.includes(profileCandidate as LogicProfile)) {
    return NextResponse.json(
      { error: `Perfil inválido: ${profileCandidate}. Perfiles válidos: ${VALID_PROFILES.join(', ')}` },
      { status: 400 },
    );
  }
  const profile = profileCandidate as LogicProfile;

  // Validar language contra whitelist
  if (!['es', 'en'].includes(String(body.language ?? ''))) {
    return NextResponse.json(
      { error: 'El idioma debe ser "es" o "en".' },
      { status: 400 },
    );
  }
  const language = (body.language === 'en' ? 'en' : 'es') as Language;

  try {
    const result = runPipeline(text, { profile, language });
    return NextResponse.json(result);
  } catch (err) {
    // Sanitizar mensaje de error: nunca exponer detalles internos al cliente
    const errorMsg = err instanceof Error ? err.message : String(err);
    const sanitized = errorMsg.substring(0, 200); // Truncar para limitar información
    console.error('[formalize API]', sanitized); // Log en servidor para debugging
    return NextResponse.json(
      {
        error: 'Fallo el pipeline de formalizacion/ejecucion.',
        detail: 'Error interno. Revise los logs del servidor.',
      },
      { status: 500 },
    );
  }
}
