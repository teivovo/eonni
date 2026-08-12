# eonni

Small, swipeable revision decks for first year applied science maths.

Built for a phone. One idea per screen, swipe sideways through the steps of a
question and up to move on. Nothing is scored, nothing is timed, and nothing is
ever marked wrong.

## What is here

- `index.html` -- The Backwards Trick. How to answer multiple choice maths
  questions by testing the options instead of solving anything.

Each deck is a single self contained HTML file. No build step, no dependencies,
no network calls. Open it and it works, including offline.

## Design notes

Three constraints shaped all of it.

1. **A picture wherever a picture explains it better.** A turning point is the
   flat bit at the bottom of a curve. That is a drawing, not a paragraph, so the
   deck draws it and puts a tangent on it.
2. **Nothing advances on its own.** Sliding the screen out from under a reader
   is worse than any passivity it buys.
3. **No scores.** No marks, no streaks, no percentage, no red. A wrong answer
   gets an explanation of what happened, in the same quiet grey as everything
   else.

Colour carries meaning and never changes: the unknown is always apricot, plain
numbers are butter, powers are mint.

## Licence

The decks are original work. The maths is standard first year syllabus content.
No course material from any institution is reproduced here.
