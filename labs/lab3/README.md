# yamod — WAPDEV-2, Lab 3

This is your working repo for Lab 3 and for the rest of the semester. YAMOD is a movie database:
a backend that serves movies, genres and people, and an Angular frontend that you build on top of
it. By the end of the session the frontend lists the movies, creates, edits and deletes them, and
shows something sensible when a request fails.

Topic of the day: HTTP and services. Part 1 reads data from the backend. Part 2 writes it.

---

## 1. Getting started

Commit your Lab 2 work first. Checking out a new branch changes the whole repo.

### Step 1: fetch the repository and check out `lab3/start`

```bash
git fetch
git checkout -b lab3-part1 origin/lab3/start
```

### Step 2: start the backend

Open a terminal in the repo and run these commands one after the other:

```bash
cd yamod/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python seed.py
fastapi dev
```

On Windows, two of the lines are different:

| Line | Windows |
|---|---|
| `python3 -m venv .venv` | `py -m venv .venv` |
| `source .venv/bin/activate` | `.venv\Scripts\activate` |

You need Python 3.11 or newer. `python3 --version` (Windows: `py --version`) tells you which one
you have.

`python seed.py` fills the database with 1000 movies. `fastapi dev` starts the backend and keeps
running. Open <http://127.0.0.1:8000/docs>: the page lists every endpoint of the API.

### Step 3: start the frontend

In a second terminal:

```bash
cd yamod/frontend
npm ci
ng serve
```

Open <http://localhost:4200>. You see the title, *Genres*, and an error message under it. The error
is expected; Part 1, step 1 fixes it.

**Both terminals stay open for the whole session.** If the backend terminal is closed, every
request fails. When you come back to the backend later, you only need `cd yamod/backend`, the
`activate` line and `fastapi dev`.

---

## 2. Part 1, Part 2, Extension

Everybody starts at Part 1.

| | Page | What it is |
|---|---|---|
| Part 1 | [`part-1.md`](part-1.md) | The movies from the backend in a table. Step-by-step instructions. |
| Part 2 | [`part-2.md`](part-2.md) | Create, edit and delete movies, a service, loading and error messages. Requirements only. |
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
  git checkout -b lab3-part2 origin/lab3/checkpoint
  ```

Leave the backend running while you switch. Restart `ng serve` after the switch (`Ctrl + C`, then
`ng serve`): the proxy from Part 1 only takes effect when `ng serve` starts.

---

## 4. Submitting

At the end of the lab, commit your work and pack it into a ZIP file. Use your last name instead of
`mustermann`:

```bash
git add -A
git commit -m "lab 3"
git archive --format=zip -o lab3-mustermann.zip HEAD
```

`git archive` packs what is committed on your branch, and only the files git tracks. `node_modules`
and everything in `.gitignore` stay out. Upload the ZIP to Moodle by the end of the lab day.

---

## 5. Reading the scaffold

The task pages contain paste blocks, each introduced by a line in italics (*Paste this into …*).
They hold configuration and styling. Paste them as they are; you do not have to read every line.

Some blocks contain TODO comments:

```ts
  // TODO (Part 1): a movies signal, and in the constructor a GET of /api/movies/
  // that puts the movies into it. GenreList does the same for genres.
```

The TODOs are the actual work. They appear when you paste the blocks, so the repo has none before
you start.

---

## 6. What is already in the repo

| Path | What it is |
|---|---|
| `yamod/backend/` | The movie database's API. You start it, you do not change it. |
| `yamod/frontend/` | The Angular app. All of today's work happens here. |
| `yamod/frontend/src/app/genre-list/` | Finished example. Read it before you write anything. |
| `yamod/frontend/src/app/app.routes.ts` | The route list. Empty for now. Part 2 fills it. |

`GenreList` loads the genres from the backend, and shows a message while they load, when loading
fails, and when there are none. Part 1 does the same for movies and Part 2 uses the messages.

---

## 7. If something does not work

1. Every request fails: check that the backend terminal is still running. If not, start it again
   with `cd yamod/backend`, the `activate` line and `fastapi dev`.
2. The genres show an error before you have done anything: that is expected until Part 1, step 1.
3. The data is in a mess: stop the backend with `Ctrl + C`, run `python seed.py`, start it again
   with `fastapi dev`. All 1000 movies are back as they were.
4. Open the browser console with F12, and the Network tab next to it. A failed request shows up
   there in red, with its status code.
5. Look at the terminal where `ng serve` runs, especially when the page is blank and the console
   shows no error. Template and build errors show up there.
6. In the IDE, press `Ctrl + .` on a red squiggle. It offers the fix, including missing imports.
