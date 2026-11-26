# yamod — WAPDEV-2, Lab 4

Lab 4 continues the YAMOD frontend from Lab 3. The app gets Angular Material as its component
library, the genres, directors and actors in the movie form come from the backend, and the form
checks its input before it sends it.

Topic of the day: component libraries, relationships and validation. Part 1 moves the app to
Material. Part 2 adds the search for director and actors, and the validation.

---

## 1. Getting started

Commit your Lab 3 work first. Checking out a new branch changes the whole repo.

### Step 1: fetch the repository and check out `lab4/start`

```bash
git fetch
git checkout -b lab4-part1 origin/lab4/start
```

### Step 2: start the backend

The backend is the same as in Lab 3. Its `.venv` folder is still there, so you only start it:

```bash
cd yamod/backend
source .venv/bin/activate
fastapi dev
```

On Windows, the second line is `.venv\Scripts\activate`.

### Step 3: start the frontend

In a second terminal:

```bash
cd yamod/frontend
npm ci
ng serve
```

`npm ci` is needed this time: `lab4/start` adds Angular Material to `package.json`, and the build
fails without it.

Open <http://localhost:4200>. The app looks like it did at the end of Lab 3, with one more link,
*New genre*.

---

## 2. Part 1, Part 2, Extension

Everybody starts at Part 1.

| | Page | What it is |
|---|---|---|
| Part 1 | [`part-1.md`](part-1.md) | The app on Angular Material, the genres in the form from the backend. Step-by-step instructions. |
| Part 2 | [`part-2.md`](part-2.md) | Director and actors searched in the backend, validation with error messages. Requirements, and the actors field to paste. |
| Extension | [`extension.md`](extension.md) | Three options to pick from. |

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
  git checkout -b lab4-part2 origin/lab4/checkpoint
  ```

Leave the backend and `ng serve` running while you switch.

---

## 4. Submitting

At the end of the lab, commit your work and pack it into a ZIP file. Use your last name instead of
`mustermann`:

```bash
git add -A
git commit -m "lab 4"
git archive --format=zip -o lab4-mustermann.zip HEAD
```

`git archive` packs what is committed on your branch, and only the files git tracks. `node_modules`
and everything in `.gitignore` stay out. Upload the ZIP to Moodle by the end of the lab day.

---

## 5. What is new in the repo

| Path | What it is |
|---|---|
| `yamod/frontend/package.json` | Angular Material is installed. `ng add @angular/material` did that. |
| `yamod/frontend/src/styles.scss` | The Material theme: colours, font, spacing. |
| `yamod/frontend/src/app/genre-service.ts` | Loads and creates genres. `GenreList` uses it now. |
| `yamod/frontend/src/app/genre-form/` | Finished example: a Material form with validation. Read it before you write anything. |

`GenreForm` at `/genres/new` creates a genre. It shows one field with a label, two rules, a message
for each rule, and a Save button that sends nothing while a rule is broken. The movie form gets the
same in Part 1 and Part 2.

---

## 6. If something does not work

1. The build says it cannot resolve `@angular/material`: run `npm ci` in `yamod/frontend`.
2. A Material element shows as plain text, or the build says it is not a known element: add its
   module to the `imports` of the component that uses it. The error message names the element.
3. Every request fails: check that the backend terminal is still running. If not, start it again
   with `cd yamod/backend`, the `activate` line and `fastapi dev`.
4. The data is in a mess: stop the backend with `Ctrl + C`, run `python seed.py`, start it again
   with `fastapi dev`.
5. Open the browser console with F12, and the Network tab next to it. A failed request shows up
   there in red, with its status code.
6. In the IDE, press `Ctrl + .` on a red squiggle. It offers the fix, including missing imports.
