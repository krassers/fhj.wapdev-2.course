# Part 1

Goal: all 37 employees on screen, and a text box that filters them by name as you type.

You have about 30 minutes.

Before you start, read `src/app/counter/counter.ts` and `counter.html`. They contain every signal
mechanism you need here:

- `count` is a `signal`. `set` replaces its value, `update` changes it based on the old one.
- `label` and `reached` are `computed()`. They are never assigned. Angular re-runs them whenever a
  signal they read changes.
- `reached` is a filtered array, and `@for` renders it. `@empty` covers the case where it is
  empty.

The filter you have to write works like `reached`.

Docs: [Signals](https://angular.dev/guide/signals)

---

## Step 1: generate the component

```bash
ng generate component employee-list
```

Add `EmployeeList` to the `imports` array in `app.ts`, next to `Counter`. Then put
`<app-employee-list></app-employee-list>` into `app.html`, under the counter.

---

## Step 2: write the type

Open `public/imaEmployees.json` and look at a few entries. Then create `src/app/employee.ts` with
this content and complete it:

```ts
export interface Employee {
  id: number;
  name: string;
  // TODO (Part 1): add image, position and description.
  // Look at public/imaEmployees.json: one of them is missing on almost every entry.
}
```

A field that is missing on some entries has to say so in the type, or the type claims something
the data does not hold.

---

## Step 3: load the data

*Paste this into the `EmployeeList` class in `employee-list.ts`:*

```ts
  private readonly http = inject(HttpClient);

  employees = signal<Employee[]>([]);

  constructor() {
    this.http
      .get<Employee[]>('/imaEmployees.json')
      .subscribe((employees) => this.employees.set(employees));
  }
```

*And these imports at the top of the file, replacing the generated `@angular/core` line:*

```ts
import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { Employee } from '../employee';
```

What it does: `get` asks the server for the file, and `subscribe` means *"when the file arrives,
run this function with its content"*. The function puts the list into the `employees` signal.
Session 3 explains `inject` and `subscribe`. Today you only need to know that `employees()` holds
the list once it has arrived.

Nothing new shows on screen yet. Open the Network tab and reload. `imaEmployees.json` should be
there with status 200.

Docs: [Making requests](https://angular.dev/guide/http/making-requests#fetching-json-data)

---

## Step 4: render the cards

*Paste this into `employee-list.scss`:*

```scss
.employee-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 16px;
}

.employee-card {
  width: 200px;
  border: 1px solid #ddd;
  padding: 12px;

  img {
    width: 100%;
  }
}
```

`display: flex` puts the cards next to each other instead of one below the other. `flex-wrap: wrap`
starts a new row when a row is full, and `gap` sets the space between the cards. The `img` rule is
nested inside `.employee-card`, an SCSS feature: it applies only to images in a card, and makes
them as wide as the card.

Docs: [Flexbox](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Flexbox),
[`display`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/display), [`flex-wrap`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/flex-wrap), [`gap`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/gap)

*And this into `employee-list.html`, replacing what is there:*

```html
<div class="employee-list">
  <!-- TODO (Part 1): repeat the card for every employee with @for, tracked by id -->
  <div class="employee-card">
    <img src="" alt="" />
    <h2></h2>
    <div class="position"></div>
    <!-- TODO (Part 1): only render the description when the employee has one -->
    <p class="description"></p>
  </div>
</div>
```

Now fill it in:

1. Loop over `employees()` with `@for`, as `counter.html` loops over `reached()`. Track by
   `employee.id`: it identifies the person, whatever position they have in the list.
2. Bind the photo with `[src]` and the name with `[alt]`, and put the name into the `h2` with
   `{{ }}`.
3. Put the position into its `div` with `{{ employee.position }}` for now. Find Werner Fritz. What
   do you see?
4. Only show the description when there is one. That is `@if`.

Werner Fritz's position is two lines, and the line break in the data is the HTML tag `<br>`.
`{{ }}` always prints text, so you see the tag itself. To have it rendered as HTML, bind the
element's `innerHTML` property instead:

```html
<div class="position" [innerHTML]="employee.position"></div>
```

Angular *sanitises* what goes into `[innerHTML]`. It keeps harmless tags like `<br>`, removes
`<script>` and anything else that could run code, and warns in the console when it removes
something. That makes it safe for data you control, like this file. Text a user typed still needs
care. Session 5 comes back to it.

Docs: [`@for`](https://angular.dev/guide/templates/control-flow#repeat-content-with-the-for-block),
[`@if`](https://angular.dev/guide/templates/control-flow#conditionally-display-content-with-if-else-if-and-else),
[Binding properties](https://angular.dev/guide/templates/binding),
[Sanitization](https://angular.dev/best-practices/security#sanitization-and-security-contexts)

---

## Step 5: add the filter

*Paste this into the `EmployeeList` class, under `employees`. Replace nothing.*

```ts
  filter = new FormControl('', { nonNullable: true });
  query = signal('');

  // TODO (Part 1): filtered, a computed() that returns the employees
  // whose name contains query(), ignoring upper and lower case.
```

*Paste this into the constructor, under the `http` call:*

```ts
    // TODO (Part 1): subscribe to this.filter.valueChanges and set query to each new value.
    // It has the same shape as the call above.
```

*And this at the very top of `employee-list.html`, above the list:*

```html
<input type="search" [formControl]="filter" placeholder="Filter by name" />
<!-- TODO (Part 1): loop over filtered() instead of employees(), and add an @empty block -->
```

About the paste:

- `FormControl` and `ReactiveFormsModule` come from `@angular/forms`. `ReactiveFormsModule` goes
  into the `imports` array of the `@Component` decorator, like `EmployeeList` in `app.ts`.
  Without it, `[formControl]` is an unknown property.
- `nonNullable: true` means that resetting the box gives `''` instead of `null`, so the value is
  always a `string`.

Now the three TODOs:

1. The subscription: `valueChanges` sends a new value every time the text in the box changes.
   Subscribe to it the same way as to the `http` call, and put each value into `query` with `set`.
2. `filtered`: a `computed()` that reads `employees()` and `query()` and returns the matching
   employees. `reached` in the counter is the same idea. `toLowerCase()` on both sides takes care of
   upper and lower case.
3. The template: loop over `filtered()` and add `@empty` with the text
   `No employee matches "…".`, showing the current query where the dots are.

Docs: [Reactive forms](https://angular.dev/guide/forms/reactive-forms#adding-a-basic-form-control),
[`computed`](https://angular.dev/guide/signals#computed-signals),
[`@empty`](https://angular.dev/guide/templates/control-flow#providing-a-fallback-for-for-blocks-with-the-empty-block)

**Do not assign the filtered list anywhere.** No method that writes a filtered array into a
property, no `ngOnInit`. `filtered` stays correct by itself, because Angular re-runs it whenever
`employees` or `query` change. That is what `computed()` is for.

---

## Done when

- 37 cards render. Six of them show a broken image: those photos are missing on the server, not
  in your code. Werner Fritz's position shows on two lines with no visible `<br>`,
  and his card is the only one with a description
- typing `fritz` shows two cards, Werner Fritz and Gernot Fritz. `FRITZ` shows the same two
- typing `xyz` shows `No employee matches "xyz".`, and clearing the box shows all 37 again
- `ng build` exits without errors
