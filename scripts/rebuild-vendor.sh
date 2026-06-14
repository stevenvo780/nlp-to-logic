#!/usr/bin/env bash
# Reconstruye vendor/ (las libs revividas, compiladas) desde _sources/.
# Uso: bash scripts/rebuild-vendor.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/_sources"
VENDOR="$ROOT/vendor"

if [ ! -d "$SRC/ST" ] || [ ! -d "$SRC/auto.logic" ]; then
  echo "Faltan fuentes. Clonalas primero:"
  echo "  mkdir -p $SRC && cd $SRC"
  echo "  gh repo clone stevenvo780/ST -- --depth 1"
  echo "  gh repo clone stevenvo780/auto.logic -- --depth 1"
  exit 1
fi

echo "==> Construyendo ST"
(cd "$SRC/ST" && npm install --no-audit --no-fund && npm run build)

echo "==> Construyendo autologic"
(cd "$SRC/auto.logic" && npm install --no-audit --no-fund && npm run build)

echo "==> Copiando dist a vendor/ (preservando los package.json saneados)"
rm -rf "$VENDOR/st-lang/dist" "$VENDOR/autologic/dist"
cp -r "$SRC/ST/dist" "$VENDOR/st-lang/"
cp -r "$SRC/auto.logic/dist" "$VENDOR/autologic/"

echo "==> Aligerando: quitar sourcemaps, .d.ts.map y la CLI de ST"
find "$VENDOR" -name '*.js.map' -delete
find "$VENDOR" -name '*.d.ts.map' -delete
rm -rf "$VENDOR/st-lang/dist/cli"

echo "==> Listo. Recuerda: 'npm install' en la raiz para re-enlazar workspaces."
