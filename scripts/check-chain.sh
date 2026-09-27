#!/usr/bin/env bash
#
# Verifies the invariants the lab chains depend on. Run before every push.
#
#   1. within each chain, every lab ref is a strict ancestor of the next one;
#      a chain starts with a root commit exactly at the labs in CHAIN_ROOTS
#   2. lab branches carry code only — the stub README and no other markdown
#   3. the stub README is byte-identical on every lab branch
#   4. main carries docs only — no code, apart from the CI workflow under .github/
#   5. every lab has at least a start and a solution
#   6. each chain carries exactly one project folder, and no other chain carries it
#   7. no stray lab branches — nothing under lab*/ but start, checkpoint, solution,
#      and nothing named like a student branch (lab1-part1)
#
# CHAIN_PUBLISHED=1 checks the refs as published on GitHub rather than a local clone:
# a lab's solution may be held back until after its session, so a missing solution
# is reported but does not fail invariant 5. CI sets it; the pre-push hook does not.
#
# Exit 0 = safe to push. Exit 1 = an invariant is broken. Exit 2 = cannot run.

set -uo pipefail
cd "$(git rev-parse --show-toplevel 2>/dev/null)" || { echo "not a git repo"; exit 2; }

# The first lab of each project. Its start is a root commit; every other lab's start
# sits on the previous lab's solution. A new project means a new entry here.
CHAIN_ROOTS="lab1 lab2 lab3"

TIERS="start checkpoint solution"

PUBLISHED=${CHAIN_PUBLISHED:-0}

fail=0
ok()  { printf '  \033[32m✓\033[0m  %s\n' "$*"; }
bad() { printf '  \033[31m✗\033[0m  %s\n' "$*"; fail=1; }
note() { printf '  \033[33m·\033[0m  %s\n' "$*"; }

have() { git rev-parse --verify --quiet "refs/heads/$1" >/dev/null; }
is_root_lab() { case " $CHAIN_ROOTS " in *" $1 "*) return 0 ;; *) return 1 ;; esac; }

# ---- discover labs and group them into chains ------------------------------
labs=$(git for-each-ref --format='%(refname:short)' 'refs/heads/lab*/start' \
       | sed 's|/start$||' | sort -V)
[ -n "$labs" ] || { echo "no lab*/start branches found"; exit 2; }

# chains[i] = space-separated refs of chain i, in teaching order
chains=(); current=""; all_refs=()
for lab in $labs; do
  if is_root_lab "$lab" && [ -n "$current" ]; then
    chains+=("$current"); current=""
  fi
  for tier in $TIERS; do
    if have "$lab/$tier"; then current="$current $lab/$tier"; all_refs+=("$lab/$tier"); fi
  done
done
[ -n "$current" ] && chains+=("$current")

echo "${#all_refs[@]} refs across $(echo "$labs" | wc -w | tr -d ' ') lab(s) in ${#chains[@]} chain(s)"

# ---- 1. ancestry and roots -------------------------------------------------
broken=0; pairs=0
for chain in "${chains[@]}"; do
  prev=""
  for ref in $chain; do
    if [ -n "$prev" ]; then
      pairs=$((pairs + 1))
      git merge-base --is-ancestor "$prev" "$ref" \
        || { bad "$prev is not an ancestor of $ref"; broken=1; }
    fi
    prev=$ref
  done
done
for lab in $labs; do
  parents=$(git rev-list --parents -n 1 "$lab/start" | wc -w | tr -d ' ')
  if is_root_lab "$lab"; then
    [ "$parents" = "1" ] || { bad "$lab/start should be a root commit (it starts a chain)"; broken=1; }
  else
    [ "$parents" = "1" ] && { bad "$lab/start is a root commit but $lab is not in CHAIN_ROOTS"; broken=1; }
  fi
done
[ $broken -eq 0 ] && ok "ancestry holds for all $pairs adjacent pairs; chains start where CHAIN_ROOTS says"

# ---- 2. lab branches carry no task docs ------------------------------------
broken=0
for ref in "${all_refs[@]}"; do
  md=$(git ls-tree -r --name-only "$ref" | grep -i '\.md$' | tr '\n' ' ' | sed 's/ *$//')
  if [ "$md" != "README.md" ]; then
    bad "$ref carries markdown beyond the stub: $md"; broken=1
  fi
done
[ $broken -eq 0 ] && ok "lab branches carry code only (stub README, no task docs)"

# ---- 3. the stub never drifts ----------------------------------------------
hashes=$(for ref in "${all_refs[@]}"; do git rev-parse "$ref:README.md" 2>/dev/null; done | sort -u)
if [ "$(echo "$hashes" | wc -l | tr -d ' ')" = "1" ]; then
  ok "stub README identical on every lab branch"
else
  bad "stub README differs between lab branches ($(echo "$hashes" | wc -l | tr -d ' ') versions)"
fi

# ---- 4. main carries docs only ---------------------------------------------
if have main; then
  stray=$(git ls-tree -r --name-only main | grep -vE '^(README\.md|CLAUDE\.md|labs/|scripts/|\.github/)' | tr '\n' ' ')
  if [ -n "$stray" ]; then bad "main carries non-doc files: $stray"
  else ok "main carries docs only"; fi
else
  bad "no main branch"
fi

# ---- 5. each lab is complete -----------------------------------------------
broken=0; held=""
for lab in $labs; do
  have "$lab/solution" && continue
  if [ "$PUBLISHED" = "1" ]; then held="$held $lab/solution"
  else bad "$lab/solution is missing"; broken=1; fi
done
if [ $broken -eq 0 ]; then
  if [ -n "$held" ]; then note "not published yet:$held"
  else ok "every lab has a start and a solution"; fi
fi

# ---- 6. one project folder per chain ---------------------------------------
broken=0; seen=""
for chain in "${chains[@]}"; do
  folder=""
  for ref in $chain; do
    dirs=$(git ls-tree -d --name-only "$ref" | tr '\n' ' ' | sed 's/ *$//')
    if [ -z "$dirs" ] || [ "$dirs" != "${dirs% *}" ]; then
      bad "$ref should carry exactly one project folder, has: ${dirs:-none}"; broken=1; continue
    fi
    [ -z "$folder" ] && folder=$dirs
    [ "$dirs" = "$folder" ] || { bad "$ref carries $dirs, the rest of its chain carries $folder"; broken=1; }
  done
  case " $seen " in *" $folder "*) bad "$folder appears on more than one chain"; broken=1 ;; esac
  seen="$seen $folder"
done
[ $broken -eq 0 ] && ok "each chain carries one project folder:$seen"

# ---- 7. no stray lab branches ----------------------------------------------
stray=$(git for-each-ref --format='%(refname:short)' refs/heads \
        | grep -E '^lab[0-9]+' \
        | grep -vE "^lab[0-9]+/($(echo $TIERS | tr ' ' '|'))$" | tr '\n' ' ')
if [ -n "$stray" ]; then bad "stray lab branches, delete or rename them: $stray"
else ok "no stray lab branches"; fi

echo
if [ $fail -eq 0 ]; then echo "safe to push"; else echo "DO NOT PUSH — fix the above first"; fi
exit $fail
