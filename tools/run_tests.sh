#!/usr/bin/env bash
# Golden test runner — iterates tests/case-*/input.json, runs validators.py full,
# compares exit code vs expected (case-01 → 0, case-02..05 → 1).
#
# Usage:
#   bash tools/run_tests.sh           # summary only
#   bash tools/run_tests.sh --verbose # full validator output per case
#
# Exit code: 0 = all expected outcomes matched, 1 = any regression

cd "$(dirname "$0")/.." || exit 2

VERBOSE=0
if [ "${1:-}" = "--verbose" ] || [ "${1:-}" = "-v" ]; then VERBOSE=1; fi

# Expected exit code per case. Case-01 PASS (exit 0). Others FAIL (exit 1).
expected_for() {
  case "$1" in
    case-01-meleva-night-time-pass) echo 0 ;;
    case-02-bad-cures-insomnia)     echo 1 ;;
    case-03-bad-title-over-200)     echo 1 ;;
    case-04-bad-backend-over-249)   echo 1 ;;
    case-05-bad-ashwagandha-claim)  echo 1 ;;
    *) echo "?" ;;
  esac
}

pass=0
fail=0
total=0
regressions=""

printf "\n%-45s %-12s %-12s %s\n" "Case" "Expected" "Got" "Result"
printf "%s\n" "-------------------------------------------------------------------------------------------"

for case_dir in tests/case-*/; do
  case_name=$(basename "$case_dir")
  input="${case_dir}input.json"
  [ -f "$input" ] || continue
  total=$((total+1))
  expected=$(expected_for "$case_name")

  if [ "$VERBOSE" = "1" ]; then
    echo ""
    echo "===== $case_name (expected exit $expected) ====="
    python3 validators.py full "$input"
    got=$?
    echo "----- exit $got -----"
  else
    python3 validators.py full "$input" >/dev/null 2>&1
    got=$?
  fi

  if [ "$got" = "$expected" ]; then
    pass=$((pass+1))
    result="PASS"
  else
    fail=$((fail+1))
    result="FAIL (regression)"
    regressions="$regressions\n  - $case_name: expected $expected, got $got"
  fi

  if [ "$expected" = "0" ]; then exp_label="SAFE (0)"; else exp_label="FIXES (1)"; fi
  if [ "$got" = "0" ]; then got_label="SAFE (0)"; else got_label="FIXES (1)"; fi
  printf "%-45s %-12s %-12s %s\n" "$case_name" "$exp_label" "$got_label" "$result"
done

printf "%s\n" "-------------------------------------------------------------------------------------------"
printf "Total: %d  ·  Pass: %d  ·  Fail: %d\n\n" "$total" "$pass" "$fail"

if [ "$fail" -gt 0 ]; then
  printf "REGRESSIONS:%b\n" "$regressions"
  exit 1
fi

echo "All cases match expected outcomes."
exit 0
