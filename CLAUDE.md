# CLAUDE.md

Course repo for the Angular half of WAPDEV-2, FH JOANNEUM. Six labs, taught one per session.
This file is for maintaining the repo. Students do not need to read it; `README.md` is theirs.

Why the labs are shaped the way they are (tiers, anchors, what a checkpoint is for) is in the course
plan, `../WAPDEV-2_Plan_WS2026-27.md` §6. This file covers only how the repo carries it.

## Main and three chains

The repo holds four histories that share no commits.

`main` is the course text: the student README, the task pages under `labs/`, `scripts/`, and this
file. No code.

The code sits on **three chains, one per project**. Each chain is one line of history, and each
starts with a root commit.

```
main                  README.md, CLAUDE.md, labs/labN/*.md, scripts/

component-demo-app    lab1/start ─ lab1/checkpoint ─ lab1/solution
ima-employees         lab2/start ─ lab2/checkpoint ─ lab2/solution
yamod                 lab3/start ─ lab3/checkpoint ─ lab3/solution ─ lab4/start ─ … ─ lab6/solution
```

`lab1/start`, `lab2/start` and `lab3/start` are root commits, like `main`. Never merge, rebase or
force one history onto another:

```bash
git branch -f main lab1/start   # NEVER. This destroys the docs branch.
```

**Why main is separate.** A doc fix is one commit on `main`: no rebase, safe at any time, including
mid-session. When task text sat on every lab branch, fixing a typo meant rebasing everything, and
`main`, which a rebase cannot move, went stale and told students to create a branch named `core`.

**Why one chain per project.** A chain exists so that one rebase carries a change to every ref after
it. A change never crosses a project folder: each project has its own `package.json`, and a project
is finished after its last session. A chain spanning all three projects would only make every rebase
longer. Only yamod lives across several labs, so only the yamod chain is longer than one lab.

Every lab branch carries a short stub `README.md` pointing at `main`, and no other markdown.

## Creating a lab

The first lab of a project starts a new root commit, and its name goes into `CHAIN_ROOTS` at the
top of `scripts/check-chain.sh`. `git switch --orphan` starts from an empty tree (`git checkout
--orphan` does not, so do not use it here):

```bash
git switch --orphan lab2/start
git show lab1/start:README.md > README.md   # the stub, byte-identical everywhere
# add the project folder, then commit
```

Within yamod, a lab starts **on top of** the previous lab's solution:

```bash
git switch -c lab4/start lab3/solution
```

Never create a lab branch off `main`; `main` has no code.

Invariant to preserve: within a chain, each ref is a strict ancestor of the next. Do not check this
by hand; see *Tooling*.

## Changing anything shared

With the docs out of the chains, "shared" means a project's code and config: its `package.json`, the
Angular version, `angular.json`, `.gitignore`, and for yamod the Django backend. Edit it at one point
and replay the rest of that chain:

```bash
git commit -a --amend --no-edit
git rebase --update-refs --onto lab3/start <old-sha> lab6/solution
```

For Lab 1 or Lab 2 the chain ends at that lab's own solution: `… --onto lab2/start <old-sha> lab2/solution`.

Things that bite:

- `--update-refs` only moves refs **inside** the rebased range. The other chains and `main` are not
  touched, which is correct.
- `git rebase <branch>` leaves you checked out on that branch, not where you started.
- `rebase.updateRefs = true` is set in this repo, so the flag is redundant but harmless. Do not
  rely on it if you ever run the command elsewhere.
- `package-lock.json` conflicts cannot be resolved by hand. They occur when a bump at an early ref
  meets a later commit that changes dependencies, such as Lab 4 adding Material to yamod. Regenerate
  the lock file with `npm install` in the project folder and continue.

`rerere.enabled = true` is also set. A conflict you resolve while replaying a chain is recorded and
reapplied automatically the next time the same conflict comes back. That matters for yamod, where a
base-level fix has to travel through Labs 3 to 6 and several commits touch the same files.

Never propagate with cherry-pick. It produces divergent commits and breaks the ancestor invariant.

**Which branch to edit** depends on what kind of change it is:

| Change | Where | Rebase? |
|---|---|---|
| Anything in a README or a task page | `main` | no |
| Code or config, before teaching starts | earliest ref in that project's chain containing the file | yes |
| Code or config, after teaching starts | see *Freeze policy* | yes |

## Freeze policy

Applies to the chains only. `main` is never frozen; a doc fix is an ordinary commit there.

Rewriting history is the normal maintenance mechanism for a chain. The question is never "may I
rewrite?" but **where do I apply the change?**

The one hard rule: **never touch a lab's branches during the session it is being taught.** A student
who checks out `checkpoint` at minute 60 while it is being force-pushed gets a different commit than
the person next to them. Outside that window, the rules below apply.

Appending a commit does not avoid the problem. A new commit on top of `labN/start` leaves
`labN/checkpoint` parented to the old one, so the chain breaks and the refs after it have to be
replayed regardless. Shared code cannot be changed without moving the refs downstream in its chain.

### Normal case: the fix only has to be right going forward

Version bumps, scaffold corrections. Apply them at the **earliest ref still ahead of the teaching
front** — for yamod usually the next untaught lab's `start` — not at the first ref where the file
happens to exist.

```
lab3/start … lab4/solution │ lab5/start ─ lab5/checkpoint ─ … ─ lab6/solution
        already taught     │        free to rewrite
                           ↑ apply the fix here
```

```bash
git switch lab5/start
# edit
git commit -a --amend --no-edit
git rebase --update-refs --onto lab5/start <old-lab5-start-sha> lab6/solution
```

Taught labs keep the old code. That is correct: those refs are the record of what was taught.

Lab 1 and Lab 2 are single-lab chains, so once their session is over they are never touched again.

### Exception: the fix must reach a lab that has already been taught

A scaffold that does not compile, or a dependency that has to change in a lab students are still
working in. Append rather than amend, so the branch fast-forwards:

```bash
git switch lab4/start
# edit
git commit -am "fix: scaffold does not compile, missing import"
git rebase --update-refs --onto lab4/start <old-lab4-start-sha> lab6/solution
```

`lab4/start` fast-forwards, so no commit is orphaned and a student who fetches gets a clean update.
Everything after it in the chain is rewritten, which is acceptable: those refs are either ahead of
the front or belong to labs nobody is branching from any more.

Student work is never at risk in either case. They work on their own `lab{N}-{tier}` branches, and
the commits they built on stay in their local repos whatever happens to the published refs.

## Branch semantics

Three refs per lab.

| Branch | Meaning |
|---|---|
| `main` | Course text: student README, this file, `labs/labN/*.md`, `scripts/`. No code. |
| `labN/start` | The state students begin the lab in |
| `labN/checkpoint` | After Part 1. Anchor 1 points at it; checking it out is optional |
| `labN/solution` | After Part 2, the expected standard. In yamod, the next lab's `start` builds on it |

Each ref is a tier commit: `checkpoint` is the Part 1 commit, `solution` the Part 2 commit. The
checkpoint adds no commit of its own, so deleting the name leaves the chain untouched, and
`check-chain.sh` tolerates a missing `checkpoint`.

**Extension has no ref and no solution.** It is open-ended per the course plan, and a solution
branch would be a fourth artefact to maintain at every Angular major. Do not add one without asking.
A reference implementation, if one is worth having, goes in the lab's build spec.

**Lab 6** ends the yamod chain. Its seeded-defect state hangs off `lab5/solution`, so nothing
downstream inherits agent-built code and it can be rebuilt at any point in the semester.

Students create their own branches as `lab{N}-{tier}`: `lab{N}-part1` off `labN/start` at the start
of the lab, `lab{N}-part2` off `labN/checkpoint` only if they take the checkout at anchor 1. The
lab number is mandatory: a bare `part1` collides in session 2. Keep every README consistent with this.

Students only ever have read access. Nobody but the instructor pushes.

## Angular rules for generated code

Angular 22, Node 24 LTS, standalone, zoneless by default. The training-data defaults are wrong here
— check generated code against this list:

- `@if` / `@for` (with `track`) / `@switch`. Never `*ngIf` / `*ngFor`.
- Standalone components. No `NgModule`, no `app.module.ts`.
- No `provideHttpClient()` — `HttpClient` is in the root injector.
- No `provideZoneChangeDetection()` — not generated any more.
- No `.component` filename infix: `fh-news.ts`, not `fh-news.component.ts`.
- `signal` / `computed` for state; derived values are `computed()`, not recomputed in `ngOnInit`.
- Reactive forms, not signal forms — a deliberate teaching choice, not an oversight.
- RxJS is scoped to `map`, `filter`, `debounceTime`, `switchMap`. Nothing else appears in the course.

When in doubt, fetch current Angular docs rather than answering from memory.

## Repo layout

`main` carries no code. Each lab branch carries exactly one project folder, the one its chain
belongs to. Run `npm ci` inside the project folder, never at the root.

| Folder | Sessions | Chain |
|---|---|---|
| `component-demo-app/` | 1 | `lab1/*` |
| `ima-employees/` | 2 | `lab2/*` |
| `yamod/` | 3–6, Angular frontend plus provided Django backend | `lab3/*` to `lab6/*` |

There are no placeholder folders, and no project appears on another project's chain.

Task text lives on `main` in `labs/labN/{part-1,part-2,extension}.md`, not on the slides
and not in the chains.

Every TODO marker in a scaffold belongs to a numbered step on a task page, and every step leaves a
TODO behind. If one exists without the other, that is a bug. A checked-out lab branch contains **no**
TODO markers — they arrive when the student pastes the scaffold blocks from the task page. Grepping
a lab branch and finding none is expected.

## Tooling

`scripts/check-chain.sh` lives on `main` and verifies the invariants:

1. within each chain, each ref is a strict ancestor of the next, and a chain starts with a root
   commit exactly at the labs listed in `CHAIN_ROOTS`
2. lab branches carry code only: the stub README and no other markdown
3. the stub README is byte-identical on every lab branch
4. `main` carries docs only, apart from the CI workflow under `.github/`
5. every lab has a `start` and a `solution`. With `CHAIN_PUBLISHED=1` a missing `solution` is
   reported but does not fail, because a solution may be held back until after its session
6. each chain carries exactly one top-level folder, its project, and no other chain carries it
7. no stray lab branches: nothing under `lab*/` except `start`, `checkpoint`, `solution`, and nothing
   named like a student branch (`lab1-part1`) — those exist only in students' clones

It discovers labs from `lab*/start`, so new labs are picked up as they are created. Chains come from
`CHAIN_ROOTS`, which is written by hand on purpose: a lab accidentally committed as a root, or
accidentally stacked on another project, is caught rather than silently starting a new chain.

It runs as `.git/hooks/pre-push` and blocks a push that would break an invariant. The hook is
local and not versioned, so install it on every fresh clone. It is a one-line wrapper that runs the
script from local `main` rather than a copy of it: a copied script goes stale the moment
`check-chain.sh` changes, and then blocks the very push that carries the change.

```bash
printf '#!/usr/bin/env bash\ngit show main:scripts/check-chain.sh | bash\n' > .git/hooks/pre-push
chmod +x .git/hooks/pre-push
```

To run it by hand from any branch, including one where `scripts/` is not in the working tree:

```bash
git show main:scripts/check-chain.sh | bash
```

### CI

`.github/workflows/labs.yml`, on `main` only. It has two jobs:

- **chain invariants** — `check-chain.sh` with `CHAIN_PUBLISHED=1`, run against the branches as
  they are on GitHub.
- **one build per lab ref** — every `labN/*` branch, discovered at run time, so a new lab needs no
  change to the workflow. On each, for every folder with an `angular.json`: `npm ci`, `ng build`,
  `ng test --no-watch`. Node 24, the version students install.

It runs on a push to `main`, nightly, and on demand. **It does not run when a lab branch is
pushed.** A workflow triggered by `push` runs from the workflow file in the pushed commit, and lab
branches carry only their project folder (invariant 6). So after pushing lab refs, start it by hand:

```bash
gh workflow run labs.yml
```

Why `main` and not the chains: a copy on each chain's root would be a second top-level folder on
every lab branch, and adding it would rewrite `lab1/start` and `lab1/checkpoint`, which are already
published. One workflow on `main` also sees every ref at once, which the chain invariants need
anyway.

The nightly run is what catches breakage nobody pushed: a new Node 24 minor on the runner, or a
package pulled from the registry. GitHub disables scheduled workflows on a public repo after 60 days
without activity; re-enable it in the Actions tab if the repo sits idle between semesters.

The pre-push hook stays. It is the only thing that stops a bad push; CI only reports one.
