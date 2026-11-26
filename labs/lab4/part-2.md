# Part 2

In Part 1 the app moved to Angular Material. In Part 2 the form gets the director and the actors
from the backend, and checks its input before it sends it.

This time you get requirements, and you decide how to solve them. Only the actors field is given
as code to paste.

---

## Where you start

If everything on Part 1's *Done when* list was true, you continue with your own code. Otherwise you
start from `lab4/checkpoint`, which has the same state.

---

## What it has to do

1. The director is searched by name. Typing at least two letters in the director field shows the
   matching persons from the backend; picking one sets the director. The field shows the name.

2. The actors are searched the same way and shown as chips. Picking an actor adds a chip, and each
   chip has a button that removes it. An actor cannot be added twice. The field is given in
   *The actors field* below; the search is yours.

3. The edit page shows the movie's director and all its actors.

4. The requests for persons are in a `PersonService`.

5. The form checks its input before it sends it:
   - title, rank, release date, runtime, rating, at least one genre, a director and at least one
     actor are required
   - rank and runtime start at 1, the runtime is at most 300 minutes, the rating is between 0 and
     10
   - a title of only spaces is not accepted. No built-in validator checks that, so write your own
   - a director that was typed but not picked from the list is not accepted

6. Every rule has its own message under its field. Saving with a broken rule sends nothing and
   shows all messages.

The backend has 2593 persons, too many for a select. That is why director and actors are searched.

Requirement 3 also fixes the problem from Lab 3: editing a movie no longer loses actors that were
not in the fixed list.

---

## The actors field

*Paste this into `movie-form.html`, replacing the Actors field:*

```html
<mat-form-field>
  <mat-label>Actors</mat-label>
  <mat-chip-grid #actorGrid formControlName="actors" aria-label="Actors">
    @for (actor of form.controls.actors.value; track actor.id) {
      <mat-chip-row [value]="actor" (removed)="removeActor(actor)">
        {{ actor.name }}
        <button matChipRemove [attr.aria-label]="'Remove ' + actor.name">
          <mat-icon>cancel</mat-icon>
        </button>
      </mat-chip-row>
    }
  </mat-chip-grid>
  <input
    #actorInput
    [formControl]="actorSearch"
    [matChipInputFor]="actorGrid"
    [matAutocomplete]="actorAuto"
    placeholder="Type at least two letters"
  />
  <mat-autocomplete
    #actorAuto="matAutocomplete"
    (optionSelected)="addActor($event.option.value); actorInput.value = ''"
  >
    @for (person of actorOptions(); track person.id) {
      <mat-option [value]="person">{{ person.name }}</mat-option>
    }
  </mat-autocomplete>
</mat-form-field>
```

*In `movie-form.ts`, replace the `actors` control with this:*

```ts
    actors: new FormControl<Person[]>([], { nonNullable: true }),
```

*and add this to the class, after the form:*

```ts
  actorSearch = new FormControl('', { nonNullable: true });
  actorOptions = signal<Person[]>([]);
  // TODO (Part 2): fill actorOptions from the backend while actorSearch changes

  addActor(actor: Person): void {
    const actors = this.form.controls.actors.value;
    if (!actors.some((a) => a.id === actor.id)) {
      this.form.controls.actors.setValue([...actors, actor]);
    }
  }

  removeActor(actor: Person): void {
    const actors = this.form.controls.actors.value;
    this.form.controls.actors.setValue(actors.filter((a) => a.id !== actor.id));
  }
```

`Person` comes from `../movie`. The field needs three Material modules in `imports`, with
`MatAutocompleteModule` before `MatChipsModule`:

```ts
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
```

The chips show the `actors` control: one `mat-chip-row` per person in it. The search runs in its
own control, `actorSearch`, and `[matChipInputFor]` places that input inside the chip field.
Picking an option calls `addActor`, which adds the person unless it is already there, and
`actorInput.value = ''` empties the input. `[value]="actor"` on each chip matters: without it, the
chip field writes the chip texts into `actors` when the input loses focus, and the actors turn into
strings.

---

## Hints

### New pieces

```bash
ng generate service person-service
```

The backend searches persons with `GET /api/persons/?search=ridley`. `HttpClient` adds the
parameter with a second argument: `{ params: { search: name } }`.

### The search

This is the search from session 3: the field's `valueChanges`, then `filter` so that only text of
at least two letters goes on, `debounceTime` so that not every key sends a request, and `switchMap`
to the call of `PersonService`. Put the result into a signal and render the options from it.

### What the director field holds

While you type, the director control holds the text. After you pick an option, it holds the
option's value. Make that value the whole person (`[value]="person"`), and let `[displayWith]` on
`mat-autocomplete` show the name. The control's type is then `Person | string | null`, and a
string means nothing was picked.

`mat-autocomplete` has an option `requireSelection`. Do not use it here: it keeps the typed text out
of the form control, so `valueChanges` never sees it and the search does not run.

### Filling the edit page

The director and actors controls now hold persons, so `patchValue` can take the movie's `director`
and `actors` as they come from the backend. Only the genres still need `map`.

### Saving

The backend expects ids. In `save()`, turn the director into its `id` and the actors into a list of
ids.

### Your own validator

A validator is a function that gets the control and returns `null` when the value is fine, or an
object that names the error, for example `{ blank: true }`. It goes into the control's validator
list next to the built-in ones, and `hasError('blank')` reads it in the template.

### When the messages show

`mat-error` shows once a field has been left, or the form has been submitted. `GenreForm.save()`
shows how to send nothing while the form is invalid. `Validators.required` also counts an empty
list as missing.

### Docs

- [Autocomplete](https://material.angular.dev/components/autocomplete/overview),
  [setting separate control and display values](https://material.angular.dev/components/autocomplete/overview#setting-separate-control-and-display-values)
- [Chips](https://material.angular.dev/components/chips/overview),
  [chips with autocomplete](https://material.angular.dev/components/chips/examples#chips-autocomplete)
- [Form field error messages](https://material.angular.dev/components/form-field/overview#error-messages)
- [Form validation](https://angular.dev/guide/forms/form-validation),
  [custom validators](https://angular.dev/guide/forms/form-validation#defining-custom-validators)
- [`filter`](https://rxjs.dev/api/operators/filter),
  [`debounceTime`](https://rxjs.dev/api/operators/debounceTime),
  [`switchMap`](https://rxjs.dev/api/operators/switchMap)
- [URL parameters](https://angular.dev/guide/http/making-requests#setting-url-parameters)
