import type { NextConfig } from 'next';
import path from 'node:path';

const nextConfig: NextConfig = {
  // Next.js 15 detecta /workspace/package-lock.json como workspace root y
  // confunde el rastreo de archivos; lo anclamos al proyecto.
  outputFileTracingRoot: path.join(__dirname),
  // El motor ST y autologic son CJS pre-compilados en vendor/*. Se ejecutan en
  // el runtime Node de las funciones serverless; los tratamos como paquetes
  // externos del servidor para que Node los resuelva por require en runtime en
  // vez de intentar empaquetarlos (y arrastrar sus imports a node:fs/worker).
  serverExternalPackages: [
    '@stevenvo780/st-lang',
    '@stevenvo780/autologic',
    'z3-solver',
  ],
  // Incluye los paquetes vendored (symlinks de workspace) en el rastreo de
  // archivos de la funcion serverless del endpoint.
  outputFileTracingIncludes: {
    '/api/formalize': ['./vendor/**/*'],
  },
};

export default nextConfig;
