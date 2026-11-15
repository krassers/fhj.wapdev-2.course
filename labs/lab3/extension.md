# Extension

Start this once Part 2 is done. Until then, stay on [Part 2](part-2.md); it covers what matters
most today.

The Extension is open-ended, and you do not have to finish it. There is no solution branch for it,
because it is about the decisions you make, and more than one answer is fine.

There are two options. Pick one.

---

## Option A: search as you type

A text box above the movie list searches by title while you type. It does not send a request for
every key, and an older answer never overwrites a newer one.

The backend filters by title: `/api/movies/?title=star` returns the movies with *star* anywhere in
the title, in upper or lower case.

This is the search from the lecture: `valueChanges`, `debounceTime` and `switchMap`. `HttpClient`
adds query parameters with a second argument: `{ params: { title } }`.

Docs: [`debounceTime`](https://rxjs.dev/api/operators/debounceTime),
[`switchMap`](https://rxjs.dev/api/operators/switchMap),
[URL parameters](https://angular.dev/guide/http/making-requests#setting-url-parameters)

To test it: typing `star` shows 7 movies. The Network tab shows one request when you stop typing,
not one per key. Clearing the box shows the first ten again. Then stop the backend, search once,
start the backend again and search again. What happens, and why?

---

## Option B: the list with `httpResource`

Rewrite how `MovieList` loads the movies with `httpResource`, the API from the lecture. Loading,
error and the movies come from one object. Delete still works.

`httpResource` comes from `@angular/common/http`. Reading its `value()` while the request has
failed throws an error, so check `hasValue()` first.

Docs: [`httpResource`](https://angular.dev/guide/http/http-resource)

To test it: the list shows the loading message, the error message with the backend stopped, and
the movies. After a delete, the list has ten rows again. Then compare with Part 2: the list no
longer uses `MovieService` for reading, but the delete still does. Is that a good split?
