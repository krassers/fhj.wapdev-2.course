# component-demo-app — WAPDEV-2, Lab 1

This is your working repo for Lab 1. At the end of the session the app shows a list of news cards.
You write the component that renders a card.

Topic of the day: a component is a reusable unit with inputs.

---

## 1. Before anything else: pre-flight check

Work through this section in order. Every check has to pass. If one of them
fails, ask me or the people around you for help.

```bash
node --version
```
Has to print v22.22.3 or higher. If it does not, install Node 24 LTS.

Then install the Angular CLI. You need it on your PATH to run `ng new`:

```bash
npm install -g @angular/cli
```

```bash
ng version
```
Has to print Angular CLI 22.x. If it prints an older major version you can run`npm install -g @angular/cli@latest` to update it.

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

**Everybody starts at Part 1, don't pick a level**

| | Page | What it is |
|---|---|---|
| Part 1 | [`part-1.md`](part-1.md) | One news card on screen. The hard part is given. |
| Part 2 | [`part-2.md`](part-2.md) | Several cards from a typed array. Requirements only, no scaffold. |
| Extension | [`extension.md`](extension.md) | Open-ended. |

Read one page at a time. Each page assumes the one before it is done.

---

## 3. The checkpoint

After about 30 minutes we will go through Part 1 together and then continue with Part 2. Before continuing with Part 2, commit your changes with the command below.

```bash
git add -A && git commit -m "my part 1 attempt"
```

Now look at the *Done when* list at the end of the [Part 1 page](part-1.md).

- **Everything on it is true:** carry on with Part 2 on your own code. You do not need the next
  command.
- **Anything is not true, or you are not sure:** move to the checkpoint and start Part 2 from
  there. Your own work is not lost. It stays on your branch.

```bash
git checkout -b lab1-part2 origin/lab1/checkpoint
```

Part 1 & 2 contain the content that matter the most for today. Only start Extension once Part 2 is done.

---

## 4. Reading the scaffold

Part 1 gives you code in two forms.

Paste blocks are marked as such. That is styling and test data. Paste it and move on, you do not
have to read every line.

Inside those blocks there are TODO comments:

```ts
  title = input<string>('');
  // TODO (Part 1): add description, date and image.
  // image may be absent, so what should its type be?
```

Those are the actual work. Do not search the repo for TODOs before you start. There are none. They come in when you paste the
blocks.

---

## 5. What is already in the repo

| Path | What it is |
|---|---|
| `src/app/app.ts`, `app.html` | The root component. You extend it in Part 1 and again in Part 2. |
| `src/app/alert-button/` | Finished example. Read it before you write anything. |
| `public/image.png` | Placeholder image for news entries that have no image. |

`alert-button` is not a task. It contains the decorator, the selector, two inputs, a click handler
and component styles. You use all of those today, so read it first.

---

## 6. If something does not work

1. Open the browser console with F12.
2. Look at the terminal where `ng serve` runs. Template and build errors show up there first, and
   with more detail than in the browser.
3. In the IDE, press `Ctrl + .` on a red squiggle. It offers the fix, including missing imports.
