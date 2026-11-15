# Part 1

Goal: the movies from the backend in a table, with the type of the response written by hand.

You have about 30 minutes.

Before you start, read `src/app/genre-list/genre-list.ts` and `genre-list.html`. They contain
everything you need here:

- `inject(HttpClient)` gives the component the object that sends requests.
- `get<Genre[]>('/api/genres/')` asks the backend for the genres. `<Genre[]>` tells TypeScript
  what the answer looks like.
- `subscribe({ next, error })` says what happens when the answer arrives: `next` gets the data,
  `error` runs instead when the request fails.
- The genres end up in a signal, and the template loops over it with `@for`.

You write the same thing for movies, without the error handling. That comes in Part 2.

Docs: [Making requests](https://angular.dev/guide/http/making-requests#fetching-json-data)

---

## Step 1: connect the frontend to the backend

Right now the genres show an error. The frontend asks `localhost:4200` for `/api/genres/`, and
that is the dev server, not the backend.

First try putting the backend's address in front of the URL, in `genre-list.ts`:

```ts
this.http.get<Genre[]>('http://127.0.0.1:8000/api/genres/')
```

Reload and open the console (F12). You see a CORS error. In the Network tab the request is there,
and the backend answered it.

The browser blocks a page from reading a response from another address unless that address allows
it. `127.0.0.1:8000` is a different address from `localhost:4200`, and the backend does not allow
it.

Undo the change, so the URL is `/api/genres/` again.

The fix is a proxy: the dev server forwards every `/api` request to the backend, so for the browser
everything comes from port 4200.

*Create `src/proxy.conf.json` with this content:*

```json
{
  "/api/**": {
    "target": "http://127.0.0.1:8000",
    "secure": false
  }
}
```

*In `angular.json`, find `"serve"` and add the `"options"` block under `"builder"`:*

```json
        "serve": {
          "builder": "@angular/build:dev-server",
          "options": {
            "proxyConfig": "src/proxy.conf.json"
          },
```

Stop `ng serve` with `Ctrl + C` and start it again; it reads the proxy configuration only when it
starts. The genres appear.

The proxy only exists in `ng serve`. A deployed app needs another solution.

Docs: [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS),
[Proxying to a backend server](https://angular.dev/tools/cli/serve#proxying-to-a-backend-server)

---

## Step 2: generate the component

```bash
ng generate component movie-list
```

Add `MovieList` to the `imports` array in `app.ts`, next to `GenreList`. Then put
`<app-movie-list></app-movie-list>` into `app.html`, under the genre list.

---

## Step 3: write the type

Open <http://localhost:4200/api/movies/> in the browser. That is the response your component will
get from the backend. Look at one movie in it (use the Dev-Tools Network tab for better visibility). Then create `src/app/movie.ts` with this content and complete it:

```ts
import { Genre } from './genre';

export interface Movie {
  id: number;
  title: string;
  // TODO (Part 1): add the other fields you see in the response.
  // genres is a list of objects you already have a type for.
}

// TODO (Part 1): the list response wraps the movies. Write a type for the wrapper
// that works for any kind of item, not only movies: Page<T>.
```

Things to watch out for:

- `director` and `actors` are objects with an `id` and a `name`. They need a type of their own.
- `revenue` is missing for some movies. Find out what the backend sends instead, and say so in the
  type.
- `released` looks like a date, but JSON has no dates. It arrives as a string.
- The movies are not the whole answer. They sit in `items`, next to `total`. `Page<T>` is a
  generic type: `T` is a placeholder for the type of the items, so `Page<Movie>` is a page of
  movies. You only need the fields the frontend reads.

Docs: [Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)

With the type, a typo like `movie.titel` is a compile error instead of an empty table cell.

---

## Step 4: load the movies

No paste block this time. *Put this comment into the `MovieList` class in `movie-list.ts`:*

```ts
  // TODO (Part 1): a movies signal, and in the constructor a GET of /api/movies/
  // that puts the movies into it. GenreList does the same for genres.
```

The differences from `GenreList`:

- the answer is a `Page<Movie>`, not a list. The movies are in its `items`.
- leave out `loading`, `error` and the `error` callback. Part 2 adds them.

Nothing new shows on screen yet. Open the Network tab and reload. `movies/` should be there with
status 200.

---

## Step 5: render the table

*Paste this into `movie-list.scss`:*

```scss
.movies {
  border-collapse: collapse;

  th,
  td {
    padding: 4px 12px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }
}

.genre + .genre::before {
  content: ', ';
}
```

`border-collapse: collapse` draws one line between two cells instead of one border per cell.
`.genre + .genre` selects every genre that follows another genre, and `::before` with `content`
puts a comma in front of it. The first genre gets none.

Docs: [`border-collapse`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/border-collapse),
[Next-sibling combinator](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/Next-sibling_combinator),
[`::before`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::before)

*And this into `movie-list.html`, replacing what is there:*

```html
<h2>Movies</h2>

<table class="movies">
  <thead>
    <tr>
      <th>Title</th>
      <th>Genres</th>
      <th>Released</th>
      <th>Runtime</th>
    </tr>
  </thead>
  <tbody>
    <!-- TODO (Part 1): one row per movie, tracked by id -->
    <tr>
      <td></td>
      <!-- TODO (Part 1): every genre name in a <span class="genre"> -->
      <td></td>
      <!-- TODO (Part 1): the release date as dd.MM.yyyy -->
      <td></td>
      <td></td>
    </tr>
  </tbody>
</table>
```

Now fill it in:

1. Loop over `movies()` with `@for`, tracked by `movie.id`. Title and runtime (`run_time`, in
   minutes) go into their cells with `{{ }}`.
2. A movie has several genres, so the genre cell needs a second `@for` inside the first one, over
   `movie.genres`, tracked by `genre.id`. The stylesheet puts the commas between the names.
3. The release date goes through the `date` pipe: `{{ movie.released | date: 'dd.MM.yyyy' }}`.
   `DatePipe` comes from `@angular/common` and goes into the `imports` of `MovieList`.

Docs: [`@for`](https://angular.dev/guide/templates/control-flow#repeat-content-with-the-for-block),
[Pipes](https://angular.dev/guide/templates/pipes), [`DatePipe`](https://angular.dev/api/common/DatePipe)

Every release date is the 1st of January. The data only has the year, so that is not a bug in
your date pipe.

---

## Done when

- the 20 genres show
- the movie table shows ten movies, Guardians of the Galaxy first, with *Action, Adventure,
  Sci-Fi*, `01.01.2014` and `121 min`
- `ng build` exits without errors
