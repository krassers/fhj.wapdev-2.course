# WAPDEV-2 — Angular labs

Course repo for the Angular half of WAPDEV-2, FH JOANNEUM, Business Informatics.

Everything you need for the labs is in here. Clone it once at the start of the semester and keep it
for all six sessions.

---

## 1. Getting started

```bash
git clone https://github.com/krassers/fhj.wapdev-2.course.git
cd fhj.wapdev-2.course
```

At the start of each lab I tell you which branch to start from. For session 1 that is:

```bash
git checkout -b lab1-part1 origin/lab1/start
cd component-demo-app
```

Then follow [`labs/lab1/README.md`](labs/lab1/README.md) here on `main`.

---

## 2. What is in here

This branch holds the task pages and nothing else. The code is on the lab branches. Once you
check one out, you have these folders:

| Folder | Used in | Project |
|---|---|---|
| `component-demo-app/` | session 1 | Your first components |
| `ima-employees/` | session 2 | Employee list, routing, signals |
| `yamod/` | sessions 3 to 6 | Movie database, Angular frontend and Django backend |

Each folder is a separate project with its own `package.json`. Run `npm ci` inside the folder you
are working in, not up here.

The folders for later sessions do not exist yet. `ima-employees/` arrives at `lab2/start` and
`yamod/` at `lab3/start`.

---

## 3. How the branches work

`main` is the branch you land on when you open the repo. It holds this README and the task
pages, and no code.

Each lab has three branches:

| Branch | What it is |
|---|---|
| `labN/start` | The state you begin the lab in |
| `labN/checkpoint` | After Part 1 |
| `labN/solution` | After Part 2 |

The Extension part has no branch. It is open-ended, so there is no single answer to put on one.

**Put the lab number in the name of every branch you create.** `lab1-part1`, `lab2-part1`, `lab3-part2` — not `part1`.

After Part 1 the whole room stops once. If your Part 1 is not done, you move to
`labN/checkpoint` and carry on with Part 2 from there. If it is done, you carry on with your own
code.

If you miss a session you can catch up. `labN/start` is simply the state the project is in after
the session before it, so checking out the next session's start branch puts you back with
everybody else.

Your own work is never overwritten. It stays on the branch you created.

Checking out a different branch changes the whole repo, not only the folder you are in. **Commit your work
before you switch.**

---

## 4. Where the tasks are

The tasks are not on the slides. They are on `main`, under `labs/`. For session 1:

- [`labs/lab1/README.md`](labs/lab1/README.md) — start here
- [`labs/lab1/part-1.md`](labs/lab1/part-1.md)
- [`labs/lab1/part-2.md`](labs/lab1/part-2.md)
- [`labs/lab1/extension.md`](labs/lab1/extension.md)

Read one at a time.

Keep them open in the browser while you work. When you check out a lab branch, your working folder
has the code for that lab in it, not the task description.

---

## 5. What you need installed

- Node 24 LTS
- Angular CLI 22, with `npm install -g @angular/cli`
- Git
- VS Code

Session 1 begins with a pre-flight check that tests all of this. The exact commands are in
[`labs/lab1/README.md`](labs/lab1/README.md).
