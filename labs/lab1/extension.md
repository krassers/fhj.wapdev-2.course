# Extension

Start this once Part 2 is done. If it is not done yet, stay on [Part 2](part-2.md). That is the
part that matters today.

The Extension is open-ended. You do not have to finish it. There is no solution branch for it,
because the interesting part is the decisions you make, and more than one answer is fine.

There are two options. Pick one.

---

## Option A: a relative date pipe

`2026-09-14` is correct, but it does not tell a reader much. News sites write *"3 days ago"*
instead. Build that.

```bash
ng generate pipe relative-date
```

A pipe is a class with one method, `transform`. It takes a value and returns what you want to
display. You already used one today. `date` is a pipe that comes with Angular. The relative-date pipe does not come out of the box. You have to write it yourself.

**It has to handle the following cases**:

- no date at all → something sensible, not `NaN`
- today → `today`
- yesterday → `yesterday`
- a few days ago → `3 days ago`

After that, decide for yourself where it stops. The oldest entry is from `2026-05-20`. Does it read
better as a number of days or as `4 months ago`? And what about a date in the future? The data in
the exercise has none, but a real news app can have an article that is scheduled for later.

**Use it** in `fh-news.html` instead of the `date` pipe. Look at what has to change in
`fh-news.ts` so that the template may use it. The pipe is *not* registered in a central place. The
component that uses it imports it, the same way as `AlertButton`.

**Is it working?** Add an entry with `date: new Date()` to the array and check that the card says
`today`.

---

## Option B: the components of your own project

No code for this one. Take a notebook or a whiteboard.

Sketch the screens of the project you build this semester. Draw a box around every part that should
be its own component. For each box, write down what goes *in*. Those are its inputs.

Two questions to think about:

- Where is the line between one component and two? The card you built today has four inputs.
  Would five be fine? Would twelve?
- Which boxes appear more than once on the same screen? Which appear on more than one screen?
  Those are the ones to get right first.
