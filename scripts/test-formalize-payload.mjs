import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';

// Use the installed compiler; never install or fetch test dependencies.
const ts = createRequire(import.meta.url)('typescript');
assert.equal(ts.version, '5.9.3', 'This harness requires TypeScript 5.9.3.');
const routeUrl = new URL('../app/api/formalize/route.ts', import.meta.url);
const routeSource = readFileSync(routeUrl, 'utf8');
const compiled = ts.transpileModule(routeSource, {
  fileName: fileURLToPath(routeUrl),
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
    strict: true,
  },
  reportDiagnostics: true,
});
assert.deepEqual(
  (compiled.diagnostics ?? []).filter((entry) => entry.category === ts.DiagnosticCategory.Error),
  [],
  'The real handler must transpile without errors.',
);

const pipelineResult = {
  ok: true,
  stCode: 'synthetic result',
  execution: { ok: true, exitCode: 0, stdout: '', stderr: '', statuses: [], results: [] },
  detectedPatterns: [],
  atoms: [],
  diagnostics: [],
  durationMs: 0,
};

function loadHandler({ failure } = {}) {
  const calls = [];
  const logs = [];
  const module = { exports: {} };
  const dependencies = new Map([
    ['next/server', {
      NextResponse: {
        json(value, init) {
          return new Response(JSON.stringify(value), {
            ...init,
            headers: { 'Content-Type': 'application/json' },
          });
        },
      },
    }],
    ['@/lib/pipeline', {
      runPipeline(text, options) {
        calls.push({ text, options: { ...options } });
        if (failure !== undefined) throw failure;
        return pipelineResult;
      },
    }],
  ]);
  runInNewContext(compiled.outputText, {
    module,
    exports: module.exports,
    require(name) {
      if (!dependencies.has(name)) throw new Error('Unexpected handler import: ' + name);
      return dependencies.get(name);
    },
    // Match Error identity across the VM and its dependency double.
    Error,
    console: { error: (...args) => logs.push(args) },
  }, {
    filename: fileURLToPath(routeUrl),
    timeout: 1000,
    contextCodeGeneration: { strings: false, wasm: false },
  });
  assert.equal(typeof module.exports.POST, 'function');
  return { POST: module.exports.POST, calls, logs };
}

function request(payload) {
  const serialized = JSON.stringify(payload);
  return { json: async () => JSON.parse(serialized) };
}

async function rejected(payload, status, error) {
  const handler = loadHandler();
  const response = await handler.POST(request(payload));
  assert.equal(response.status, status);
  assert.deepEqual(await response.json(), { error });
  assert.deepEqual(handler.calls, []);
  assert.deepEqual(handler.logs, []);
}

async function accepted(payload, profile, language) {
  const handler = loadHandler();
  const response = await handler.POST(request(payload));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), pipelineResult);
  assert.deepEqual(handler.calls, [{ text: payload.text, options: { profile, language } }]);
  assert.deepEqual(handler.logs, []);
}

test('null payload returns 400', async () => {
  await rejected(null, 400, 'Cuerpo JSON invalido.');
});

for (const [name, payload] of [
  ['empty array', []],
  ['array containing valid fields', [{ text: 'Synthetic statement.', language: 'en' }]],
  ['string', 'Synthetic statement.'],
  ['empty string', ''],
  ['number', 7],
  ['zero', 0],
  ['true', true],
  ['false', false],
]) {
  test(name + ' payload returns 400', async () => {
    await rejected(payload, 400, 'Cuerpo JSON invalido.');
  });
}

test('invalid JSON returns 400 without calling the pipeline', async () => {
  const handler = loadHandler();
  const response = await handler.POST({ json: async () => JSON.parse('{') });
  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { error: 'Cuerpo JSON invalido.' });
  assert.deepEqual(handler.calls, []);
  assert.deepEqual(handler.logs, []);
});

for (const [name, payload] of [
  ['missing', { language: 'en' }],
  ['null', { text: null, language: 'en' }],
  ['number', { text: 123, language: 'en' }],
  ['boolean', { text: true, language: 'en' }],
  ['array', { text: ['Synthetic statement.'], language: 'en' }],
  ['object', { text: {}, language: 'en' }],
]) {
  test(name + ' text returns 400', async () => {
    await rejected(payload, 400, 'El campo text debe ser string.');
  });
}

for (const [name, text] of [['empty', ''], ['whitespace', ' \t\r\n ']]) {
  test(name + ' text returns 400', async () => {
    await rejected({ text, language: 'en' }, 400, 'El texto esta vacio.');
  });
}

test('4000 characters are accepted with one pipeline call', async () => {
  await accepted({ text: 'a'.repeat(4000), language: 'en' }, 'classical.propositional', 'en');
});

test('4001 characters return 413 without calling the pipeline', async () => {
  await rejected({ text: 'a'.repeat(4001), language: 'en' }, 413,
    'El texto supera el limite de 4000 caracteres.');
});

test('text is forwarded without trimming', async () => {
  await accepted({ text: '  Synthetic statement. \n', language: 'es' }, 'classical.propositional', 'es');
});

for (const profile of [
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
]) {
  for (const language of ['es', 'en']) {
    test(profile + ' with ' + language + ' reaches the pipeline once', async () => {
      await accepted({ text: 'Synthetic statement.', profile, language }, profile, language);
    });
  }
}

for (const [name, profile] of [
  ['omitted', undefined], ['null', null], ['empty', ''], ['false', false], ['zero', 0],
]) {
  test(name + ' profile preserves the default', async () => {
    await accepted({ text: 'Synthetic statement.', profile, language: 'es' },
      'classical.propositional', 'es');
  });
}

const validProfileList = 'classical.propositional, classical.first_order, modal.k, deontic.standard, epistemic.s5, intuitionistic.propositional, temporal.ltl, paraconsistent.belnap, aristotelian.syllogistic, probabilistic.basic, arithmetic';
for (const [name, profile, candidate] of [
  ['unknown', 'unknown', 'unknown'],
  ['case mismatch', 'MODAL.K', 'MODAL.K'],
  ['number', 12, '12'],
  ['true', true, 'true'],
  ['object', {}, '[object Object]'],
  ['empty array', [], ''],
]) {
  test(name + ' profile returns 400', async () => {
    await rejected({ text: 'Synthetic statement.', profile, language: 'en' }, 400,
      'Perfil inválido: ' + candidate + '. Perfiles válidos: ' + validProfileList);
  });
}

test('profile string coercion is preserved', async () => {
  await accepted({ text: 'Synthetic statement.', profile: ['modal.k'], language: 'es' }, 'modal.k', 'es');
});

for (const [name, language] of [
  ['omitted', undefined], ['null', null], ['empty', ''], ['unsupported', 'fr'],
  ['uppercase', 'EN'], ['number', 1], ['zero', 0], ['true', true], ['false', false],
  ['object', {}], ['empty array', []],
]) {
  test(name + ' language returns 400', async () => {
    await rejected({ text: 'Synthetic statement.', language }, 400, 'El idioma debe ser "es" o "en".');
  });
}

for (const language of [['es'], ['en']]) {
  test('language array ' + language[0] + ' preserves existing coercion to es', async () => {
    await accepted({ text: 'Synthetic statement.', language }, 'classical.propositional', 'es');
  });
}

for (const [name, failure, expectedLog] of [
  ['Error', new Error('synthetic-private-detail: ' + 'x'.repeat(300)),
    ('synthetic-private-detail: ' + 'x'.repeat(300)).slice(0, 200)],
  ['string', 'synthetic-private-detail: ' + 'y'.repeat(300),
    ('synthetic-private-detail: ' + 'y'.repeat(300)).slice(0, 200)],
  ['null', null, 'null'],
]) {
  test(name + ' pipeline failure preserves sanitized 500', async () => {
    const handler = loadHandler({ failure });
    const response = await handler.POST(request({ text: 'Synthetic statement.', language: 'en' }));
    assert.equal(response.status, 500);
    assert.deepEqual(await response.json(), {
      error: 'Fallo el pipeline de formalizacion/ejecucion.',
      detail: 'Error interno. Revise los logs del servidor.',
    });
    assert.deepEqual(handler.calls, [{
      text: 'Synthetic statement.', options: { profile: 'classical.propositional', language: 'en' },
    }]);
    assert.deepEqual(handler.logs, [['[formalize API]', expectedLog]]);
  });
}
