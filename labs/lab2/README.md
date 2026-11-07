# ima-employees — WAPDEV-2, Lab 2

This is your working repo for Lab 2. By the end of the session the app lists every employee of the
institute, filters the list as you type, and has a detail page for each person.

Topic of the day: routing and signals. Part 1 is about signals: a list that filters itself.
Part 2 is about routing: pages, addresses and a detail page.

---

## 1. Getting started

Commit your Lab 1 work first. Checking out a new branch changes the whole repo.

### Step 1: fetch the repository and check out `lab2/start`

```bash
git fetch
git checkout -b lab2-part1 origin/lab2/start
cd ima-employees
npm ci
```

`git fetch` is needed because the Lab 2 branches did not exist yet when you cloned the repo in
session 1. Without it, git does not know `origin/lab2/start`.

### Step 2: download the employee data from Teams

The file is `imaEmployees.json`. Save it under this path, keeping the name:

```
ima-employees/public/imaEmployees.json
```

### Step 3: start the dev server

Leave it running for the rest of the session:

```bash
ng serve
```

Open <http://localhost:4200>. You see the project title and a small counter with a *Click* and a
*Reset* button.

---

## 2. Part 1, Part 2, Extension

Everybody starts at Part 1.

| | Page | What it is |
|---|---|---|
| Part 1 | [`part-1.md`](part-1.md) | All employees on screen, with a filter. Step-by-step instructions. |
| Part 2 | [`part-2.md`](part-2.md) | Pages, navigation and a detail page. Requirements only. |
| Extension | [`extension.md`](extension.md) | Two options to pick from. |

---

## 3. The checkpoint

After about 30 minutes we go through Part 1 together. Before you continue with Part 2, commit your
changes:

```bash
git add -A && git commit -m "my part 1 attempt"
```

Then check the *Done when* list at the end of the [Part 1 page](part-1.md).

- If everything on it is true, continue with Part 2 on your own code.
- If something on it is not true, or you are not sure, start Part 2 from the checkpoint. Your own
  work stays on your branch.

  ```bash
  git checkout -b lab2-part2 origin/lab2/checkpoint
  ```

The employee data survives the switch. Git ignores `public/imaEmployees.json`, so it is never
committed and no checkout removes it.

---

## 4. Submitting

At the end of the lab, commit your work and pack it into a ZIP file. Use your last name instead of
`mustermann`:

```bash
git add -A
git commit -m "lab 2"
git archive --format=zip -o lab2-mustermann.zip HEAD
```

`git archive` packs what is committed on your branch, and only the files git tracks. `node_modules`
and everything in `.gitignore` stay out. Upload the ZIP to Moodle by the end of the lab day.

---

## 5. Reading the scaffold

The task pages contain paste blocks, each introduced by a line in italics (*Paste this into …*).
They hold code you do not write yourself: styling, and code that a later session explains. Paste
them as they are; you do not have to read every line.

Some paste blocks contain TODO comments:

```ts
  // TODO (Part 1): filtered, a computed() that returns the employees
  // whose name contains query(), ignoring upper and lower case.
```

The TODOs are the actual work. They appear when you paste the blocks, so the repo has none before
you start.

---

## 6. What is already in the repo

| Path | What it is |
|---|---|
| `src/app/app.ts`, `app.html` | The root component. You extend it in Part 1 and again in Part 2. |
| `src/app/counter/` | Finished example. Read it before you write anything. |
| `src/app/app.routes.ts` | The route list. Empty for now. Part 2 fills it. |
| `public/imaStudents.json` | Three made-up students. Only Extension option B uses them. |
| `public/imaEmployees.json` | The file is not in the repo. You have to download it from Teams (section 1). |

`counter` contains a signal, two values computed from it, a `@for` over a computed list and an
`@empty` block. Part 1 uses all of them.

---

## 7. If something does not work

1. **An empty list, or `No employee matches ""`, means the employee file is missing.** Open the
   Network tab (F12, then *Network*) and reload. Is `imaEmployees.json` there with 200, or 404? A
   404 means wrong folder or wrong name. It has to be `ima-employees/public/imaEmployees.json`.
2. Open the browser console with F12.
3. Look at the terminal where `ng serve` runs. Template and build errors show up there first, and
   with more detail than in the browser.
4. In the IDE, press `Ctrl + .` on a red squiggle. It offers the fix, including missing imports.
