# Extension

Start this once Part 2 is done. Until then, stay on [Part 2](part-2.md); it covers what matters
most today.

The Extension is open-ended, and you do not have to finish it. There is no solution branch for it,
because it is about the decisions you make, and more than one answer is fine.

There are two options. Pick one.

---

## Option A: filter by position, with a clear button

Next to the text box, add a dropdown that lists every position that occurs in the data. Picking one
narrows the list, and it works together with the name filter. A button clears both filters.

Derive the list of positions from the data instead of typing it by hand, so the dropdown follows
when the data changes. You already know the tool for a value derived from other values.

Two things in the data need a decision:

- Werner Fritz holds two positions in one string, separated by `<br>`. Should he appear under
  both?
- `HochschullektorIn (FH)`, `Hochschullektorin (FH)` and `Hochschullektor (FH)` are the same
  position, spelled three ways. They come out as three entries. Do you clean the data, or
  normalise it in code? And whose decision is that?

To test it: with *Nebenberuflich LehrendeR* selected, typing `stefan` shows two cards. *Clear*
brings back all 37.

---

## Option B: a students page with a query parameter

Add a third page, `/students`, that lists `public/imaStudents.json`. It has its own filter that
matches the name or the cohort.

Add two links to the navigation:

- *Students* opens `/students` with an empty filter
- *IMA22* opens `/students?cohort=IMA22`, with `IMA22` already in the filter box

The part after `?` is a *query parameter*. `routerLink` takes it with `[queryParams]`.

Docs: [Query parameters](https://angular.dev/guide/routing/read-route-state#query-parameters)

To test it: *IMA22* shows two students and `IMA22` in the search box. Click *Students* right after
it: the box is empty again and all three are back. This click is the one to test, because the page
does not reload in between. Angular reuses the component that is already on screen.
