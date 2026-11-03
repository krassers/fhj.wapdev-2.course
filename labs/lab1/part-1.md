# Part 1

Goal: one news card on screen.

A card shows an image, a title, a date and a description. The values come from outside the
component. That is what makes it reusable.

You have about 30 minutes.

Before you start, read `src/app/alert-button/alert-button.ts`. It already contains every mechanism
you need here: `input()` for values coming in, `{{ }}` to print one, and a component-scoped `.scss`.

---

## Step 1: generate the component

```bash
ng generate component fh-news
```

Look at the four files it created in `src/app/fh-news/`:

| File | What it is |
|---|---|
| `fh-news.ts` | The class, with the logic and the inputs |
| `fh-news.html` | The template, what gets rendered |
| `fh-news.scss` | Styles that apply only to this component |
| `fh-news.spec.ts` | Tests, not used today |

---

## Step 2: paste the styling

*Paste this into `src/app/fh-news/fh-news.scss`, replacing what is there.*

```scss
:host {
  display: flex;
  flex-wrap: wrap;
  padding: 20px;
  gap: 20px;
}

.news-card {
  display: flex;
  flex-direction: column;
  /* four cards per row: a quarter of the width minus a share of the gap */
  flex: 0 0 calc(25% - 15px);
  min-width: 250px;

  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 15px;
  background-color: #fff;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }

  img {
    width: 100%;
    height: 150px;
    object-fit: cover;
    border-radius: 6px;
    margin-bottom: 10px;
  }

  h1 {
    font-size: 1.2em;
    margin-top: 0;
    margin-bottom: 8px;
    color: #333;
    line-height: 1.4;
  }

  .date {
    font-size: 0.9em;
    color: #777;
    margin-bottom: 10px;
  }

  .description {
    font-size: 1em;
    color: #555;
    flex-grow: 1;
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

## Step 3: declare the inputs

*Paste this into `src/app/fh-news/fh-news.ts`, replacing the body of the class:*

```ts
  readonly defaultImage = '/image.png';

  title = input<string>('');
  // TODO (Part 1): add description, date and image.
  // image may be absent, so what should its type be?
```

`title` is given as the example. Add the other three the same way.

- `description` is a `string`
- `date` is a `Date`
- `image` may be missing, because some news entries have none. A type that only allows `string`
  cannot express that.

The generated file imports only `Component`. Add `input` to the same import from `@angular/core`,
or press `Ctrl + .` on the red squiggle.

An input is read like a function: `title()`. **Without the brackets you get an error that does
not mention them.** It is a common mistake.

---

## Step 4: paste the markup skeleton, then bind it

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

Then bind each element to its input:

1. Text inside an element uses interpolation: `<div>{{ someInput() }}</div>`.
2. An attribute that takes a value from the class uses square brackets: `[src]="…"`. Writing
   `src="image()"` sets the literal string `image()` as the URL. Try it once to see the result.
3. The image may be missing. Fall back to `defaultImage` when it is, with JavaScript's `||`
   (logical OR).
4. The date needs a pipe, described below.

A pipe is a function you use in the template. It takes a value and returns it formatted for
display, written as `value | pipeName`. The value in the class stays unchanged.

Use Angular's built-in `date` pipe, so that the date does not render as
`Mon Sep 14 2026 00:00:00 GMT+0200`:

```html
{{ date() | date : 'yyyy-MM-dd' }}
```

A pipe has to be imported by the component that uses it. `DatePipe` comes from `@angular/common`
and goes in the `imports` array of the `@Component` decorator, where `AlertButton` sits in
`app.ts`. `Ctrl + .` on the red squiggle offers to add it.

---

## Step 5: use your component

First add `FhNews` to the `imports` array in `app.ts`, next to `AlertButton`, so that `App` knows
your component exists.

Without the import the build fails with `NG8001: 'app-fh-news' is not a known element`. The error
message suggests adding `CUSTOM_ELEMENTS_SCHEMA`. Do not follow that suggestion: it turns off
Angular's checks for your template and leaves the missing import in place.

Then, in `src/app/app.html`, below the alert button, add one `<app-fh-news>` and pass it values.

Values can be set in two ways:

```html
<app-fh-news
  title="New Campus Opening"
  [date]="firstNewsDate"
></app-fh-news>
```

`title=` without brackets passes a literal string. `[date]=` with brackets evaluates
`firstNewsDate` as an expression in the component class, so `App` needs a property with that name.

Use these four values:

- title: `New Campus Opening`
- description: `A new campus wing focused on sustainable technology has officially opened.`
- date: a `Date` for `2026-09-14`, held as a property on `App`
- image: `null`, so you can see the fallback working

---

## Done when

- one card renders, with the placeholder image, the title, the date and the description
- `ng build` exits without errors
- changing the `title=` value in `app.html` changes what the card shows
