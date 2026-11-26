# Extension

Start this once Part 2 is done. Until then, stay on [Part 2](part-2.md); it covers what matters
most today.

The Extension is open-ended, and you do not have to finish it. There is no solution branch for it,
because it is about the decisions you make, and more than one answer is fine.

There are three options. Pick one.

---

## Option A: the rating as a slider

Set the rating with a Material slider from 0 to 10 in steps of 0.1, showing the value while you
drag.

`formControlName` goes on the `<input matSliderThumb>` inside `mat-slider`, not on `mat-slider`
itself. The slider is not inside a `mat-form-field`, so it needs a label of its own.

Docs: [Slider](https://material.angular.dev/components/slider/overview)

To test it: Guardians of the Galaxy shows 8.1, the arrow keys move the slider by 0.1, and saving
sends the number.

---

## Option B: a new field, from the backend to the list

Movies get a field *black and white*: a checkbox in the form, and a column in the list with an icon,
✓ or ✗.

This is the one place where you change the backend. The field has to exist there first:

- `yamod/backend/models.py`: add the field to `MovieBase`, as a `bool` with the default `False`.
  `MovieBase` is the part that reading and writing a movie share.
- The database table already exists and does not get new columns by itself. Stop the backend, run
  `python seed.py`, start it again.

Then the frontend: the types in `movie.ts`, the form control and a `mat-checkbox`, the column and a
`mat-icon` with `check` or `close`.

Docs: [Checkbox](https://material.angular.dev/components/checkbox/overview),
[Icon](https://material.angular.dev/components/icon/overview)

To test it: <http://127.0.0.1:8000/api/movies/1/> shows `"black_and_white": false`. Tick the box,
save, and it says `true`. Then think about this: what happens if you add the checkbox but skip the
backend step?

---

## Option C: accessibility of your own forms

Take a form from your semester project. Go through it with the keyboard only, then with the
*Accessibility* pane of the Chrome DevTools open. Check it against the list from the lecture:

- every field has a label, and the label is not only a placeholder
- errors are shown as text next to the field, not only as a colour
- Tab goes through the fields in a sensible order, and you can see where the focus is
- text and background have enough contrast

Write down what you found and fix what you can.

Docs: [Chrome DevTools accessibility reference](https://developer.chrome.com/docs/devtools/accessibility/reference),
[WCAG 2.2 quick reference](https://www.w3.org/WAI/WCAG22/quickref/)
