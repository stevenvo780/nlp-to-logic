/**
 * smoke.mjs — Verifica el pipeline en proceso sin levantar Next.
 * Corre: texto natural -> autologic.formalize -> st-lang.evaluate.
 *
 *   npm run smoke
 */
import { formalize } from '@stevenvo780/autologic';
import { evaluate } from '@stevenvo780/st-lang/api';

const CASES = [
  {
    text: 'Si llueve, entonces la calle se moja. Está lloviendo. Por lo tanto, la calle se moja.',
    profile: 'classical.propositional',
  },
  {
    text: 'Es obligatorio pagar impuestos. Si es obligatorio pagar impuestos, entonces está prohibido evadirlos.',
    profile: 'deontic.standard',
  },
  {
    text: 'Es necesario que las leyes se cumplan. Si es necesario que las leyes se cumplan, entonces es posible sancionar.',
    profile: 'modal.k',
  },
];

let failures = 0;

for (const { text, profile } of CASES) {
  const f = formalize(text, { profile, language: 'es', validateOutput: false });
  const e = evaluate(f.stCode);
  const statuses = (e.results ?? []).map((r) => r.status).join(', ') || '(sin comandos)';
  const pass = f.ok && e.exitCode === 0;
  if (!pass) failures += 1;
  console.log(`${pass ? 'OK ' : 'FAIL'} [${profile}] formalize.ok=${f.ok} exec.exit=${e.exitCode} statuses=[${statuses}]`);
}

if (failures > 0) {
  console.error(`\n${failures} caso(s) fallaron.`);
  process.exit(1);
}
console.log('\nPipeline OK: texto natural -> ST -> ejecucion, en proceso.');
