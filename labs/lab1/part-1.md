# Part 1

**Goal: one news card on screen.**

A card shows an image, a title, a date and a description. The values come from *outside* the
component — that is what makes it reusable.

You have ~30 minutes.

Before you start, read `src/app/alert-button/alert-button.ts`. It already contains every mechanism
you need here: `input()` for values coming in, `{{ }}` to print one, and a component-scoped `.scss`.

---

## Step 1 — generate the component

```bash
ng generate component fh-news
```

Look at the four files it created in `src/app/fh-news/`:

| File | What it is |
|---|---|
| `fh-news.ts` | the class — the logic and the inputs |
| `fh-news.html` | the template — what gets rendered |
| `fh-news.scss` | styles that apply **only** to this component |
| `fh-news.spec.ts` | the test file. Ignore it today. |

This is the default structure of an Angular component.

---

## Step 2 — paste the styling

*Paste this into `src/app/fh-news/fh-news.scss`, replacing what is there.*

```scss
:host {
  /* Use flexbox on the host component to contain the news items */
  display: flex;
  /* Allow items to wrap if the container is too small, though for 4 in a row, it's better if they don't wrap initially */
  flex-wrap: wrap;
  /* Add some overall padding/margin */
  padding: 20px;
  /* Optional: Add a small gap between the news cards */
  gap: 20px;
}

.news-card {
  /* Make each card a flexible item */
  display: flex;
  flex-direction: column;
  /* Set a fixed width to ensure four fit in a row */
  /* Calculate the width: (100% - 3 * gap) / 4 */
  /* If the parent has a fixed width, 25% would be easier, but using calc for responsiveness is better */
  flex: 0 0 calc(25% - 15px); /* 25% of the container width minus a fraction of the gap */
  min-width: 250px; /* Prevent cards from getting too small */
  
  /* Card Aesthetics */
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 15px;
  background-color: #fff;
  transition: transform 0.2s;
  
  /* Hover effect for interactivity */
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }

  /* Image styling */
  img {
    width: 100%;
    height: 150px; /* Fixed height for uniformity */
    object-fit: cover; /* Ensures image covers the space without distortion */
    border-radius: 6px;
    margin-bottom: 10px;
  }

  /* Title styling */
  h1 {
    font-size: 1.2em;
    margin-top: 0;
    margin-bottom: 8px;
    color: #333;
    line-height: 1.4;
  }

  /* Date styling */
  .date {
    font-size: 0.9em;
    color: #777;
    margin-bottom: 10px;
  }

  /* Description styling */
  .description {
    font-size: 1em;
    color: #555;
    flex-grow: 1; /* Allows description to take up remaining space if heights vary */
  }
}
```

*And paste this into `src/app/app.scss`:*

```scss
app-fh-news {
  flex: 1;
}
```

---

## Step 3 — declare the inputs

Open `src/app/fh-news/fh-news.ts`. Replace the body of the class with this:

```ts
  readonly defaultImage = '/image.png';

  title = input<string>('');
  // TODO (Part 1): add description, date and image.
  // image may be absent, so what should its type be?
```

`title` is given as the example. Add the other three the same way.

- `description` is a `string`
- `date` is a `Date`
- `image` is the interesting one. Some news entries have no image at all. A type that only allows
  `string` cannot express that.

**`input` has to be imported.** The generated file imports only `Component`. Add `input` to that
same line from `@angular/core`, or `Ctrl + .` on the red squiggle will do it for you.

**An `input()` is a function.** You read it with `title()`, not `title`. Forgetting the brackets is
the single most common error today, and the error message will not say "you forgot the brackets".

---

## Step 4 — paste the markup skeleton, then bind it

*Paste this into `src/app/fh-news/fh-news.html`, replacing what is there:*

```html
<div class="news-card">
  <img src="" alt="News Image" />
  <h1></h1>
  <p class="date"></p>
  <p class="description"></p>
</div>
<!-- TODO (Part 1): bind each of these to the matching input -->
```

Now fill it in. Three things to work out:

1. **Text inside an HTML element** uses interpolation: `<div>{{ someInput() }}</div>`.
2. **An attribute** that takes a value from the class uses square brackets: `[src]="…"`. Writing
   `src="image()"` sets the literal string `image()` as the URL — try it once so you have seen it.
3. **The image may be missing.** Fall back to `defaultImage` when it is. JavaScript's `||` (logical OR) does the job.

**A pipe** is a function you use in the template. It takes a value and returns it transformed for
display, written as `value | pipeName`. The value in the class does not change, only what is shown.
The advantage: the code is written once and reused in every template that needs it, instead
of being repeated in each component's class.

For the date, use Angular's built-in `date` pipe so it does not render as
`Mon Sep 14 2026 00:00:00 GMT+0200`:

```html
{{ date() | date : 'yyyy-MM-dd' }}
```

A pipe has to be imported by the component that uses it. `DatePipe` comes from `@angular/common`,
and it goes in the `imports` array of the `@Component` decorator — exactly where `AlertButton` sits
in `app.ts`. `Ctrl + .` on the red squiggle will offer to add it.

---

## Step 5 — use your component

**First, `App` has to know your component exists.** Add `FhNews` to the `imports` array in
`app.ts`, next to `AlertButton`.

Skip this and the build fails with `NG8001: 'app-fh-news' is not a known element`. Read that error
when it happens — it suggests adding `CUSTOM_ELEMENTS_SCHEMA`, which tells Angular to stop checking
your template rather than fixing anything. Do not take that advice. Add the import.

Then, in `src/app/app.html`, below the alert button, add one `<app-fh-news>` and pass it values.

Values can be set in two ways:

```html
<app-fh-news
  title="New Campus Opening"
  [date]="firstNewsDate"
></app-fh-news>
```

`title=` without brackets passes the **literal string**. `[date]=` with brackets evaluates
`firstNewsDate` as an **expression in the component class** — so that property has to exist on `App`.

Use these four values:

- title — `New Campus Opening`
- description — `A new campus wing focused on sustainable technology has officially opened.`
- date — a `Date` for `2026-09-14`, held as a property on `App`
- image — `null`, so you can see the fallback working

---

## Done when

- one card renders, with the placeholder image, the title, date and the description
- `ng build` exits without errors
- changing the `title=` value in `app.html` changes what the card shows

