# The Lighthouse Keeper's Desk — Spot the Difference

[![make.fun](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/c/best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Andysyahputra/best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/c/best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Andysyahputra/best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/c/best-spot-the-difference-game-20261121-0451)

An original spot-the-difference game, made for the [make.fun](https://make.fun) bounty
"Make the best spot the difference game". Two near-identical pictures of a lighthouse
keeper's desk at dusk sit side by side — a round window with the moon and the sea, a brass
lamp, a stack of books, a teacup, a wall clock, a sleeping cat on a rug, a framed picture
of a ship, a candle. Both pictures are drawn entirely in code on canvas; there are no
image files, no sounds files, no fonts and no network requests.

## How to play

Find all 7 differences between the left and right pictures:

1. **The sleeping cat** — present on the left, missing on the right.
2. **The wall clock** — 9:00 on the left, 6:30 on the right.
3. **The candle** — lit on the left, unlit on the right.
4. **The top book** — red on the left, green on the right.
5. **The moon** — full on the left, crescent on the right.
6. **The teacup** — a handle on the left, none on the right.
7. **The framed ship picture** — straight on the left, tilted on the right.

Click a real difference on either picture and it is circled in gold on both pictures,
a small chime plays, and the counter moves up ("Found X / 7"). Clicking somewhere that
is not a difference only shakes that picture gently and shows a "Not a difference" hint —
no harsh penalty. A timer counts up from the start, and a progress bar fills as you find
more. A line under the pictures names every difference you have found so far. When all 7
are found, a win panel appears with your time, a star rating based on
time and wrong clicks, and a Play Again button that resets the board.

## Controls

- **Mouse:** click directly on either picture.
- **Keyboard:** Tab or the arrow keys move a visible focus ring between the 7 difference
  regions, Enter or Space selects the focused region, Esc clears the focus ring.
- **Sound:** the mute toggle silences the beep (the chime is synthesized with WebAudio;
  there are no audio files).

## Run it locally

```sh
node serve.ts
```

Then open http://localhost:8080 in a desktop browser. No build step, no dependencies,
no network: the game is static files under `game/`.

## Layout

- `game/index.html` — the page: title, how-to line, HUD, two canvases, win panel.
- `game/style.css` — the page styling.
- `game/differences.js` — the 7 differences: hotspots and what each picture shows.
- `game/scene.js` — draws the whole desk scene on canvas, left and right variants.
- `game/audio.js` — synthesized WebAudio chimes (found / miss / win) and the mute state.
- `game/game.js` — game state, mouse and keyboard input, timer, win panel.
- `main.ts` — the entrypoint: copies `game/` and `screenshots/` to the output
  directory and writes `dossier.json` with the kit's library.
- `serve.ts` — the local static server.
- `screenshots/` — 3 screenshots of the game itself (start, mid-game, win panel).
- `shots.json` — the screenshot list with captions.
- `vendor/makefun-game.ts` — the kit's dossier library, unchanged.

## Screenshots

- `01-start.png` — start state, counter at 0 / 7.
- `02-mid.png` — mid-game, 3 differences found and circled, counter at 3 / 7.
- `03-win.png` — the win panel after all 7 are found.
