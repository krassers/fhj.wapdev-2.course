# Part 1

Goal: the app on Angular Material, and the genres in the movie form loaded from the backend.

Before you start, read `src/app/genre-form/genre-form.ts` and `genre-form.html`. They show how a
Material form is built:

- `mat-form-field` is the box around an input. `mat-label` is the text on it.
- `matInput` on the `<input>` makes the input part of the box.
- Every Material element has a module that goes into the component's `imports`: here
  `MatFormFieldModule`, `MatInputModule` and `MatButtonModule`.
- `matButton="filled"` makes a button a Material button.

The validation in `GenreForm` is for Part 2.

Docs: [Getting started](https://material.angular.dev/guide/getting-started),
[Form field](https://material.angular.dev/components/form-field/overview)

---

## Step 1: put the navigation into a toolbar

*Paste this into `app.html`, replacing what is there:*

```html
<mat-toolbar>
  <h1>{{ title() }}</h1>
  <button matButton [matMenuTriggerFor]="movieMenu">Movies</button>
  <mat-menu #movieMenu="matMenu">
    <a mat-menu-item routerLink="/movies">All movies</a>
    <a mat-menu-item routerLink="/movies/new">New movie</a>
  </mat-menu>
  <!-- TODO (Part 1): a Genres menu with "All genres" and "New genre" -->
</mat-toolbar>

<main>
  <router-outlet></router-outlet>
</main>
```

*And this into `app.scss`, replacing what is there:*

```scss
mat-toolbar {
  gap: 8px;
}

h1 {
  margin: 0 16px 0 0;
  font: var(--mat-sys-title-large);
}

main {
  padding: 16px;
}
```

`gap` puts space between the items in the toolbar. `font: var(--mat-sys-title-large)` takes the
title font of the Material theme instead of the browser's large `h1` font.

Docs: [`gap`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/gap),
[Theming your components](https://material.angular.dev/guide/theming-your-components)

`[matMenuTriggerFor]` connects the button to the menu with the name after `#`. The menu entries are
links because they lead to a page; the trigger is a button because it opens something.

Add `MatToolbarModule`, `MatMenuModule` and `MatButtonModule` to the `imports` of `App`. Every
Material element needs its module in the `imports` of the component that uses it. If one is
missing, the build says which element it does not know.

*Add these lines to the imports at the top of `app.ts`:*

```ts
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
```

VS Code suggests a Material import only once a file in the project imports from the same path, so
write the first import from each path yourself.

Docs: [Toolbar](https://material.angular.dev/components/toolbar/overview),
[Menu](https://material.angular.dev/components/menu/overview),
[Button](https://material.angular.dev/components/button/overview)

---

## Step 2: turn the movie list into a Material table

*In `movie-list.html`, replace the `<table>` element with this. The `@if` blocks around it stay:*

```html
<table mat-table [dataSource]="movies()">
  <ng-container matColumnDef="title">
    <th mat-header-cell *matHeaderCellDef>Title</th>
    <td mat-cell *matCellDef="let movie">{{ movie.title }}</td>
  </ng-container>

  <!-- TODO (Part 1): columns "genres", "released" and "run_time", like "title".
       The cell content is the same as in your old table. -->

  <ng-container matColumnDef="actions">
    <th mat-header-cell *matHeaderCellDef></th>
    <td mat-cell *matCellDef="let movie">
      <a matButton [routerLink]="['/movies', movie.id, 'edit']">Edit</a>
      <button matButton type="button" (click)="remove(movie)">Delete</button>
    </td>
  </ng-container>

  <tr mat-header-row *matHeaderRowDef="columns"></tr>
  <tr mat-row *matRowDef="let row; columns: columns"></tr>
  <tr class="mat-mdc-row" *matNoDataRow>
    <td class="mat-mdc-cell" [attr.colspan]="columns.length">There are no movies yet.</td>
  </tr>
</table>
```

*And this comment into the `MovieList` class:*

```ts
  // TODO (Part 1): columns, the list of column names in the order they are shown
```

A Material table is described per column, not per row. Each `matColumnDef` says what the header
and the cells of one column show, and `columns` says which columns appear in which order.
`*matCellDef` is a template the table repeats for every movie. The `*` is Angular's short form for
such a template; `@for` replaced it for lists, and the Material table still uses it.

Remove the `.movies` rule from `movie-list.scss`; Material styles the table. Add
`MatTableModule` and `MatButtonModule` to the `imports` of `MovieList`:

```ts
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
```

Docs: [Table](https://material.angular.dev/components/table/overview)

---

## Step 3: put the movie form on Material fields

*Paste this into `movie-form.html`, replacing the `<h2>`, the `<form>` line and the Title field. Then delete the old Released field:*

```html
<h2>{{ id() ? 'Edit movie' : 'New movie' }}</h2>

<form [formGroup]="form" (ngSubmit)="save()">
  <mat-form-field>
    <mat-label>Title</mat-label>
    <input matInput formControlName="title" />
  </mat-form-field>
  <mat-form-field>
    <mat-label>Released</mat-label>
    <input matInput [matDatepicker]="releasedPicker" formControlName="released" />
    <mat-datepicker-toggle matIconSuffix [for]="releasedPicker"></mat-datepicker-toggle>
    <mat-datepicker #releasedPicker></mat-datepicker>
  </mat-form-field>

  <!-- TODO (Part 1): rank, description, runtime and rating as mat-form-field,
       like the title. The three selects become mat-select with mat-option. -->
```

For the selects: `<mat-select>` replaces `<select>` and `<mat-option [value]="…">` replaces
`<option [ngValue]="…">`. `multiple` stays where it was. The description uses
`<textarea matInput>`. The Save button becomes `<button matButton="filled" type="submit">`.

In `movie-form.scss`, remove the `label` rule; `mat-form-field` places its label itself.

The date field needs two more lines in `movie-form.ts`. *Add this to the `@Component`, after
`imports`:*

```ts
  providers: [provideNativeDateAdapter()],
```

The date picker does not work with dates itself. It asks a *date adapter* to create, compare,
parse and format them, so it can be used with different date libraries. `provideNativeDateAdapter()`
supplies the adapter for JavaScript's built-in `Date`. In `providers` of the component, it applies
to this component and the components inside it. Without it, the build still passes, but the form
does not open and the console shows *No provider found for DateAdapter*.

The release date is no longer a string. The date picker puts a `Date` into the form. Sent as JSON,
a `Date` becomes a time in UTC, and for a date picked in Austria that is 22:00 or 23:00 on the day
before.
The backend expects `2014-05-01` and rejects anything else with 422.

*So in `movie-form.ts`, change the type of the `released` control:*

```ts
    released: new FormControl<Date | string | null>(null),
```

*and in `save()`, replace the line with `getRawValue()` with this:*

```ts
    const value = this.form.getRawValue();
    const movie: MovieInput = {
      ...value,
      released: value.released ? formatDate(value.released, 'yyyy-MM-dd', 'en-US') : '',
    };
```

`formatDate` turns the picked date into a string such as `2014-05-01`, using the local date, so the
backend gets the day that was picked.

The modules for `imports`: `MatFormFieldModule`, `MatInputModule`, `MatDatepickerModule`,
`MatSelectModule`, `MatButtonModule`. *Add these lines to the imports at the top of
`movie-form.ts`:*

```ts
import { formatDate } from '@angular/common';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
```

Docs: [Datepicker](https://material.angular.dev/components/datepicker/overview),
[Select](https://material.angular.dev/components/select/overview),
[`formatDate`](https://angular.dev/api/common/formatDate)

---

## Step 4: load the genres from the backend

The genre select still offers two fixed genres. `GenreService` can load all of them.

*Put this comment into the `MovieForm` class:*

```ts
  // TODO (Part 1): a genres signal, filled in the constructor from GenreService.
```

*And this into the genre `mat-select`, in place of the two options:*

```html
      <!-- TODO (Part 1): one mat-option per genre, the id as value -->
```

`GenreList` loads the genres the same way. Director and actors stay fixed until Part 2.

---

## Done when

- the toolbar shows *Movies* and *Genres*, and every menu entry opens its page
- the movie list is a Material table with title, genres, release date, runtime, Edit and Delete
- the movie form uses Material fields, and the genre list has all genres
- a new movie with a date from the date picker saves, and with a rank between 1 and 10 it appears
  in the list with that date
- `ng build` exits without errors
