# Part 2

In Part 1 you built the employee list with the help of a scaffold. In Part 2 you turn the app into
several pages without one.

This time you only get requirements. There are no TODOs in the code, so you decide how to solve it.

---

## Where you start

If everything on Part 1's *Done when* list was true, you continue with your own code: the counter
and the filtered employee list on one page. Otherwise you start from `lab2/checkpoint`, which has
the same state.

`app.routes.ts` already exists, with an empty route list, and `app.config.ts` already passes it to
`provideRouter`. Nothing uses it yet.

---

## What it has to do

1. The app has two pages: the employee list at `/employees`, the counter at `/counter`. `/` goes
   to `/employees`.

2. A navigation bar under the title links to both pages. Switching pages does not reload the
   browser.

3. Every employee's name links to a detail page at `/employees/<id>`. It shows the photo, name,
   position and the description (if one exists), and a link back to the list.

4. The detail page gets the id as an `input()`. Hint: `withComponentInputBinding()` in
   `app.config.ts`.

5. An id that does not exist (`/employees/99`) shows a message on the detail page instead of a
   blank page.

6. Any other unknown address (`/nope`) shows a "page not found" page with a link back to the
   start.

---

## Hints

### New components

Generate them the same way as the list in Part 1:

```bash
ng generate component employee-detail
ng generate component page-not-found
```

### Loading the file twice

The detail page loads the whole JSON file again to find one employee. That is fine for this
exercise. In session 3 a real backend lets a page ask for just the record it needs.

### Imports

Part 2 needs a lot of them, and VS Code does not always offer to add them. When a name is red and
`Ctrl + .` offers nothing, add the import by hand. Running *TypeScript: Restart TS Server* from the
command palette (`Ctrl + Shift + P`) often brings the suggestions back.

| You use | Import from | Where it also has to go |
|---|---|---|
| `Routes` | `@angular/router` | |
| `withComponentInputBinding` | `@angular/router` | next to `provideRouter` in `app.config.ts` |
| `RouterOutlet` | `@angular/router` | `imports` of `App` |
| `RouterLink` | `@angular/router` | `imports` of every component whose template has a `routerLink` |
| `input`, `computed`, `signal`, `inject` | `@angular/core` | |
| `HttpClient` | `@angular/common/http` | |
| your components, in `app.routes.ts` | their own files, e.g. `./employee-detail/employee-detail` | |

**Without `RouterLink` in `imports`, `routerLink="/employees"` gives no error, and the link does
nothing.** It is a plain attribute. `[routerLink]="…"` with brackets fails with *"Can't bind to
'routerLink'"*, which is easier to notice.

### Route parameters are strings

The URL `/employees/1` gives you `'1'`, and the ids in the data are numbers. `Number('1')`
converts it. `Number('abc')` gives `NaN` ("not a number"), and `isNaN(value)` tells you whether
that happened. Decide what `/employees/abc` should show.

### A value that may be missing

The employee is `undefined` until the file has arrived, and for an id that does not exist. So
`{{ employee().name }}` fails with *"Object is possibly 'undefined'"*. Two ways around it:

- `@if (employee(); as found) { … {{ found.name }} … }` Inside the block, `found` is never
  `undefined`, so you write `found.name` without anything extra.
- `@let found = employee();` gives the value a shorter name, but it can still be `undefined`. You
  still need `found?.name` everywhere, or an `@if` around it.

Pick a name that differs from the property. `@let employee = employee();` fails with
*"Cannot read @let declaration 'employee' before it has been defined"*.

### Docs

- [Define routes](https://angular.dev/guide/routing/define-routes): paths, redirects, the wildcard
  route
- [Navigate to routes](https://angular.dev/guide/routing/navigate-to-routes): `routerLink`
- [Route parameters as inputs](https://angular.dev/guide/routing/common-router-tasks#add-withcomponentinputbinding):
  `withComponentInputBinding()`
- [`@if`](https://angular.dev/guide/templates/control-flow#conditionally-display-content-with-if-else-if-and-else) and
  [`@let`](https://angular.dev/guide/templates/variables)

---

## Done when

- `/` opens the list, and the address bar shows `/employees`
- the navigation switches between the list and the counter, and the Network tab shows no new page
  load when it does
- clicking Werner Fritz opens `/employees/1` with his photo, his two-line position and his
  description
- `/employees/99` shows a message on the detail page, not the "page not found" page
- `/nope` shows the "page not found" page, and its link leads back to the list
- the filter from Part 1 still works
- `ng build` exits without errors

---

## Stuck?

Ask me or the people around you. You have until the end of the session, and it is fine if Part 2
takes all of it.

`lab2/solution` shows one way of solving it. Look at it once yours works, or after the session. Do
not use it instead of writing your own.
