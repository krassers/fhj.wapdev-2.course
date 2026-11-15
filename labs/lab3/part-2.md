# Part 2

In Part 1 you read movies from the backend with the help of a scaffold. In Part 2 you write them:
create, edit and delete. Apart from the form, there is no scaffold.

This time you only get requirements. There are no TODOs in the code, so you decide how to solve it.

---

## Where you start

If everything on Part 1's *Done when* list was true, you continue with your own code: the genre
list and the movie table on one page. Otherwise you start from `lab3/checkpoint`, which has the
same state.

`app.routes.ts` already exists, with an empty route list, and `app.config.ts` already passes it to
`provideRouter`. Nothing uses it yet.

---

## What it has to do

1. The app has pages: the movie list at `/movies`, the genres at `/genres`, and a navigation bar
   under the title. `/` goes to `/movies`.

2. A new movie can be created at `/movies/new`, linked from the navigation. The form is given
   (see *The form* below). Saving sends the movie to the backend and goes back to the list.

3. Every movie in the list has an *Edit* link to `/movies/<id>/edit`. That page shows the same
   form, filled with that movie, loaded from the backend by its id. Saving updates it.

4. Every movie in the list has a *Delete* button. It asks for confirmation first. After the
   backend has deleted the movie, it disappears from the list without a reload.

5. All requests for movies live in one `MovieService`. By now two components build movie URLs;
   move every movie request into the service. The components call the service and subscribe to
   what it returns.

6. The list and the form show what is going on, like `GenreList` does: a loading message while
   the list loads, an error message when a request fails, a message when there are no movies. When
   saving fails, the form stays filled and says that saving failed.

Two things that are not bugs:

- The list shows the first ten movies by rank. Give a new movie a rank between 1 and 10 to see it
  there.
- The form only offers two genres, two directors and two actors. Session 4 replaces these lists.
  If you change a selection on an existing movie, it keeps only what you selected.

---

## The form

`MovieForm` is one component for both pages, `/movies/new` and `/movies/<id>/edit`. Its template
uses `id()` and `error()`, so declare these two first:

```ts
  id = input<string>();

  error = signal('');
```

*Then paste this into the `MovieForm` class, under them:*

```ts
  form = new FormGroup({
    rank: new FormControl<number | null>(null),
    title: new FormControl('', { nonNullable: true }),
    description: new FormControl('', { nonNullable: true }),
    released: new FormControl('', { nonNullable: true }),
    run_time: new FormControl<number | null>(null),
    rating: new FormControl<number | null>(null),
    genres: new FormControl<number[]>([], { nonNullable: true }),
    director: new FormControl<number | null>(null),
    actors: new FormControl<number[]>([], { nonNullable: true }),
  });
```

*And this into `movie-form.html`, replacing what is there:*

```html
<h2>{{ id() ? 'Edit movie' : 'New movie' }}</h2>

<form [formGroup]="form" (ngSubmit)="save()">
  <label>Title <input type="text" formControlName="title" /></label>
  <label>Rank <input type="number" formControlName="rank" /></label>
  <label>Description <textarea formControlName="description"></textarea></label>
  <label>Released <input type="date" formControlName="released" /></label>
  <label>Runtime (minutes) <input type="number" formControlName="run_time" /></label>
  <label>Rating <input type="number" step="0.1" formControlName="rating" /></label>

  <!-- Fixed choices for now. Session 4 loads them from the backend. -->
  <label>
    Genres
    <select multiple formControlName="genres">
      <option [ngValue]="1">Action</option>
      <option [ngValue]="2">Adventure</option>
    </select>
  </label>
  <label>
    Director
    <select formControlName="director">
      <option [ngValue]="5">James Gunn</option>
      <option [ngValue]="10">Ridley Scott</option>
    </select>
  </label>
  <label>
    Actors
    <select multiple formControlName="actors">
      <option [ngValue]="1">Chris Pratt</option>
      <option [ngValue]="2">Vin Diesel</option>
    </select>
  </label>

  @if (error()) {
    <p class="error">{{ error() }}</p>
  }

  <button type="submit">Save</button>
</form>
```

*And this into `movie-form.scss`:*

```scss
form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 400px;
}

label {
  display: flex;
  flex-direction: column;
}

.error {
  color: #b00020;
}
```

`display: flex` with `flex-direction: column` puts the fields one below the other, and `gap` sets
the space between them. On `label` it puts the text above its input.

Docs: [Flexbox](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Flexbox), [`flex-direction`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/flex-direction)

`FormGroup`, `FormControl` and `ReactiveFormsModule` come from `@angular/forms`.
`ReactiveFormsModule` goes into the `imports` of `MovieForm`. Session 4 explains forms. Today the
form is given, and you write `save()`.

In `save()`, `this.form.getRawValue()` returns what the user entered as one object with a property
per field, for example `{ rank: 1, title: 'My movie', …, genres: [1], director: 5, actors: [1] }`.
The field names are the ones the backend expects, so this object is the body of the POST or PUT
request. The API docs show the same fields under `POST /api/movies/`.

Write a type for this object in `movie.ts`, next to `Movie`, and use it for the parameter of the
service methods that create and update a movie. It is not the same as `Movie`: it has no `id`, and
the backend wants ids for genres, director and actors instead of objects.

---

## Hints

### New files

```bash
ng generate component movie-form
ng generate service movie-service
```

### HTTP methods

GET to read, POST to create, PUT to update, DELETE to delete. Every URL ends in `/`:
`/api/movies/7/`.

### The API

<http://127.0.0.1:8000/docs> lists every endpoint with what it expects and returns. *Try it out*
sends a test request.

### The id on the edit page

An `input()` again, as in Lab 2, with `withComponentInputBinding()` in `app.config.ts`. On
`/movies/new` it is `undefined`, which is how the form knows whether it creates or updates.

### Loading the movie on the edit page

Until now you loaded data in the constructor. That does not work here: the router sets `id` after
the constructor has run, so `this.id()` is still `undefined` there. Angular calls `ngOnInit()` once
the inputs are set:

```ts
export class MovieForm implements OnInit {
  ngOnInit(): void {
    // this.id() has its value here
  }
}
```

`OnInit` comes from `@angular/core`. The id does not change while this page is open, so reading it
once is enough.

### Filling the form

`this.form.patchValue(movie)` writes the loaded movie into the form. The selects (dropdowns) need ids, not
objects: `movie.genres.map((genre) => genre.id)`.

### Going back after saving

`inject(Router)`, then `this.router.navigate(['/movies'])` inside `next`. After the `subscribe`
call it would run before the backend has answered.

### Confirmation

[`confirm('Delete …?')`](https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm) shows a
dialog and returns `true` or `false`.

### The service

Keep the decorator the CLI generates. The service returns the Observable from `http.get` and the
others, and does not subscribe itself.

### Docs

- [HTTP methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods)
- [Sending data to the server](https://angular.dev/guide/http/making-requests#mutating-server-state):
  `post`, `put`, `delete`
- [Services](https://angular.dev/guide/di/creating-and-using-services)
- [Reactive forms](https://angular.dev/guide/forms/reactive-forms): `FormGroup`, `patchValue`
- [`ngOnInit`](https://angular.dev/guide/components/lifecycle#ngoninit)
- [Navigating in code](https://angular.dev/guide/routing/navigate-to-routes#programmatic-navigation-to-routes):
  `router.navigate`
- [Route parameters as inputs](https://angular.dev/guide/routing/common-router-tasks#add-withcomponentinputbinding)

### Imports

As in Lab 2: `RouterLink` goes into the `imports` of every component whose template has a
`routerLink`. Without it, `routerLink="/movies"` is a plain attribute and the link does nothing.

---

## Done when

- `/` opens the list, and the address bar shows `/movies`
- the navigation reaches the list, *New movie* and the genres, and the Network tab shows no new page
  load when it does
- a new movie with rank `1`, Action, James Gunn and Chris Pratt is saved, and the list shows it
- *Edit* on Guardians of the Galaxy shows the form filled with it. Changing the title and saving
  shows the new title in the list
- saving with an empty title shows that saving failed, and the form keeps what you typed
- *Delete* asks first. Cancelling changes nothing. Confirming removes the row, and it is still gone
  after a reload
- with the backend stopped, `/movies` shows an error message instead of *Loading*
- no component except `GenreList` uses `HttpClient` directly
- `ng build` exits without errors

---

## Stuck?

Ask me or the people around you. You have until the end of the session, and it is fine if Part 2
takes all of it.

`lab3/solution` shows one way of solving it. Look at it once yours works, or after the session. Do
not use it instead of writing your own.
