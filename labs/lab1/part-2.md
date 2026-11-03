# Part 2

In Part 1 you built one news card with the help of a scaffold. In Part 2 you build a list of news
cards without one.

This time you only get requirements. There are no TODOs in the code, so you decide how to solve it.
You already used everything you need in Part 1.

---

## Where you start

If everything on Part 1's *Done when* list was true, you continue with your own code: one news
card, with its values written directly in `app.html`. Otherwise you start from `lab1/checkpoint`,
which has the same state.

A component that shows one hard-coded card is only used once. Inputs exist so that you can reuse
the same component with different data. That is what you do now.

---

## What it has to do

1. Define a type for a news entry. It has a title, a description, a date and an image. The image
   is optional: some entries have none, and the type should say so.

2. Hold several entries in `app.ts`. The data is below as a paste block.

3. Render all of them with `@for`, one `<app-fh-news>` per entry. Give `@for` a sensible `track`.

4. Format the date with Angular's `date` pipe, as in Part 1. Keep it when you rewrite the template.

5. An entry without an image shows the placeholder. If your card already falls back to
   `defaultImage`, this works without changes.

6. The cards are laid out in a row that wraps. Put that in `app.scss` as a class. Do not use a
   `style="…"` attribute in the template.

---

## The data

The data below uses a type called `NewsItem`. Declare it above the class in `app.ts` before you
paste the data.

*Paste this into the `App` class:*

```ts
  news: NewsItem[] = [
    {
      title: 'New Campus Opening',
      description: 'A new campus wing focused on sustainable technology has officially opened.',
      date: new Date('2026-09-14'),
      image: null,
    },
    {
      title: 'Research Grant Awarded',
      description: 'Faculty secured a major grant to advance AI ethics research across departments.',
      date: new Date('2026-09-05'),
      image: null,
    },
    {
      title: 'Student Hackathon',
      description: 'Over 300 students showcased innovative projects at the annual hackathon.',
      date: new Date('2026-07-20'),
      image: 'https://cdn3.fh-joanneum.at/media/2023/04/woechentlicher-boersenbrief-von-josef-obergantschnig-2-2048x1366.jpg',
    },
    {
      title: 'Alumni Meetup',
      description: 'An informal alumni meetup was held downtown; no image was provided for this event.',
      date: new Date('2026-05-20'),
      image: 'https://cdn3.fh-joanneum.at/media/2025/11/Header_30Jahre_Baustudiengaenge_ZukunftsplattformBauen_25.jpg',
    },
  ];
```

---

## Two details

`@for` has to know which DOM element belongs to which entry. When the array changes, Angular can
then move elements instead of rebuilding them. Track a value that identifies the entry.
`track $index` compiles and runs, but an index describes a position in the array and changes when
entries move.

Replace the single card in `app.html` with the list, and remove the `firstNewsDate` property it
used.

---

## Done when

- four cards render and wrap onto a second row when the window is narrow
- two of them show the FH placeholder image and two load a photo from the web
- each date reads like `2026-09-14`, not `Mon Sep 14 2026 00:00:00 GMT+0200`
- there is no `style=` attribute anywhere in `app.html`
- `ng build` exits without errors

---

## Stuck?

Ask me or the people around you. You have until the end of the session, and it is fine if Part 2
takes all of it.

`lab1/solution` shows one way of solving it. Look at it once yours works, or after the session. Do
not use it instead of writing your own.
