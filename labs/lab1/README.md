# component-demo-app — WAPDEV-2, Lab 1

This is your working repo for Lab 1. At the end of the session the app shows a list of news cards.
You write the component that renders a card.

Topic of the day: a component is a reusable unit with inputs.

---

## 1. Before anything else: pre-flight check

Work through this section in order. Every check has to pass. If one fails, ask me or the people
around you for help.

```bash
node --version
```
Has to print v22.22.3 or higher. If the version is older, install Node 24 LTS.

Then install the Angular CLI. You need it on your PATH to run `ng new`:

```bash
npm install -g @angular/cli
```

```bash
ng version
```
Has to print Angular CLI 22.x. If it prints an older major version, update it with
`npm install -g @angular/cli@latest`.

```bash
npm ci
ng build
```
Both have to finish without errors.

Now start the dev server and leave it running for the rest of the session:

```bash
ng serve
```

Open <http://localhost:4200>. You see the project title and a red "Click me" button. Click it and
you get an alert with the text `Custom message`.

---

## 2. Part 1, Part 2, Extension

Everybody starts at Part 1.

| | Page | What it is |
|---|---|---|
| Part 1 | [`part-1.md`](part-1.md) | One news card on screen. Step-by-step instructions. |
| Part 2 | [`part-2.md`](part-2.md) | Several cards from a typed array. Requirements only. |
| Extension | [`extension.md`](extension.md) | Open-ended. |

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
  git checkout -b lab1-part2 origin/lab1/checkpoint
  ```

---

## 4. Reading the scaffold

The task pages contain paste blocks, each introduced by a line in italics (*Paste this into …*).
They hold code you do not write yourself: styling, starter code and test data. Paste them as they
are; you do not have to read every line.

Some paste blocks contain TODO comments:

```ts
  title = input<string>('');
  // TODO (Part 1): add description, date and image.
  // image may be absent, so what should its type be?
```

The TODOs are the actual work. They appear when you paste the blocks, so the repo has none before
you start.

---

## 5. What is already in the repo

| Path | What it is |
|---|---|
| `src/app/app.ts`, `app.html` | The root component. You extend it in Part 1 and again in Part 2. |
| `src/app/alert-button/` | Finished example. Read it before you write anything. |
| `public/image.png` | Placeholder image for news entries that have no image. |

`alert-button` contains the decorator, the selector, two inputs, a click handler and component
styles. You use all of them today.

---

## 6. If something does not work

1. Open the browser console with F12.
2. Look at the terminal where `ng serve` runs. Template and build errors show up there first, and
   with more detail than in the browser.
3. In the IDE, press `Ctrl + .` on a red squiggle. It offers the fix, including missing imports.
