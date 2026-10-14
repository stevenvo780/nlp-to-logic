#!/bin/bash
# Exercise the real wrapper with fake Next output; never run a Next build.
# Usage: bash scripts/test-build-exit-status.sh [path/to/build.sh]
set -euo pipefail

script_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
build_script=${1:-"$script_dir/../build.sh"}
build_script=$(cd -- "$(dirname -- "$build_script")" && pwd)/$(basename -- "$build_script")
real_tee=$(command -v tee)
real_grep=$(command -v grep)
bash_bin=$(command -v bash)
work=$(mktemp -d)
trap 'rm -rf -- "$work"' EXIT
mkdir -p "$work/bin" "$work/node_modules/.bin"
cp -- "$build_script" "$work/build.sh"

cat > "$work/node_modules/.bin/next" <<'NEXT'
#!/bin/bash
[[ "$#" == 1 && "$1" == build ]] || exit 99
printf '%s\n' "$NEXT_STDOUT"
printf '%s\n' "$NEXT_STDERR" >&2
exit "$NEXT_STATUS"
NEXT
cat > "$work/bin/tee" <<'TEE'
#!/bin/bash
# Redirect the existing fixed log path without modifying the tested source.
[[ "$#" == 1 && "$1" == /tmp/build_output.log ]] || exit 98
"$REAL_TEE" "$CASE_LOG"
exit "$TEE_STATUS"
TEE
cat > "$work/bin/grep" <<'GREP'
#!/bin/bash
[[ "$#" == 3 && "$1" == -q && "$3" == /tmp/build_output.log ]] || exit 97
exec "$REAL_GREP" "$1" "$2" "$CASE_LOG"
GREP
chmod +x "$work/node_modules/.bin/next" "$work/bin/tee" "$work/bin/grep"

passed=0
failed=0
run_case() {
  local name=$1 expected=$2 next_status=$3 stdout=$4 stderr=$5 tee_status=${6:-0}
  local status=0
  (
    cd -- "$work"
    # A clean environment prevents inherited shell options from hiding the bug.
    env -i PATH="$work/bin:/usr/bin:/bin" REAL_TEE="$real_tee" REAL_GREP="$real_grep" \
      CASE_LOG="$work/case.log" NEXT_STDOUT="$stdout" NEXT_STDERR="$stderr" \
      NEXT_STATUS="$next_status" TEE_STATUS="$tee_status" \
      "$bash_bin" --noprofile --norc build.sh
  ) > "$work/output" 2>&1 || status=$?
  if [[ "$status" == "$expected" ]] && \
      "$real_grep" -Fq -- "$stdout" "$work/case.log" && \
      "$real_grep" -Fq -- "$stderr" "$work/case.log" && \
      "$real_grep" -Fq -- "$stderr" "$work/output"; then
    printf 'PASS %s (exit %s)\n' "$name" "$status"
    passed=$((passed + 1))
  else
    printf 'FAIL %s (expected exit %s; got %s)\n' "$name" "$expected" "$status"
    failed=$((failed + 1))
  fi
}

run_case success 0 0 'Compiled successfully' 'build diagnostic'
run_case ordinary-failure 23 23 'Build failed' 'Type error: fixture'
run_case exit-127-propagation 127 127 'Build failed' 'fixture exit 127'
run_case known-error-only 17 17 '<Html> should not be imported' 'fixture diagnostic'
run_case missing-generation-marker 18 18 $'<Html> should not be imported\nCompiled successfully' 'fixture diagnostic'
run_case missing-compilation-marker 19 19 $'<Html> should not be imported\nGenerating static pages' 'fixture diagnostic'
run_case missing-error-marker 20 20 $'Compiled successfully\nGenerating static pages' 'unrelated failure'
run_case existing-known-error-exception 0 1 $'Compiled successfully\nGenerating static pages' '<Html> should not be imported'
run_case logger-failure 29 0 'Compiled successfully' 'fixture diagnostic' 29
printf '%s passed; %s failed\n' "$passed" "$failed"
[[ "$failed" == 0 ]]
