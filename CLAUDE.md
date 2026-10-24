# CLAUDE.md — BLOOM Mahjong

Instructions for Claude Code and other coding agents working in this repository.

## What this project is

BLOOM is a standalone, mobile-friendly Mahjong Solitaire browser game. Players remove pairs of identical **free** tiles from layered boards while listening to optional, gentle Japanese-inspired synthesized ambient music. The visual language is calm, botanical, and Japanese-inspired.

## Tech stack and files

- `index.html` — HTML shell, links `style.css` and loads `script.js`.
- `style.css` — responsive layout, tiles, buttons, modals, visual styling.
- `script.js` — tile types and SVG faces, levels, board generation, rules, UI rendering, input handling, audio, and saved progress.
- `README.md` — user-facing overview and instructions.
- `CLAUDE.md` — this contributor/agent guide.

Vanilla HTML, CSS, and JavaScript. No build step, package manager, backend, runtime dependencies, or remote music/assets. Keep it that way unless specifically requested.

## How to run

Open `index.html` in a current browser. For local development you may also serve the directory with `python3 -m http.server 8000` and open `http://localhost:8000`.

Quick syntax check: `node --check script.js`.

## Gameplay contract — preserve when modifying

- Levels are defined in the `levels` array: **Lotus Path (72 tiles), Jade Terrace (96), Grand Garden (144)**.
- Match **two identical tile types** only when both tiles are free.
- A tile is free if it is not removed, **no higher-layer tile covers its position**, and **at least one horizontal side is open**. The matching logic is in `free()`; available matches are from `freePairs()`.
- `positions()` creates board positions; `buildBoard()` places pairs along a removal sequence. A board can still become stuck if players take a different sequence; Hint, Undo and Restart help recover.
- `pickTile()` handles selection, matching, scoring/progress, winning, and no-available-pairs states.
- `localStorage` remembers unlocked levels (`bloom-classic-unlocked`) and the music preference (`bloom-music`).
- The music is **original synthesized audio**, not a licensed recording. It uses the Web Audio API; browsers need a user gesture to start audio. Retain the on/off toggle and do not introduce autoplay without interaction.

## Design and artwork requirements

- Preserve the **large, layered Mahjong Solitaire boards**, including the full 144-tile level, and mobile horizontal scrolling.
- **No letters, Chinese characters, or directional arrows on tile faces.** The user specifically requested visual-only tiles.
- Do **not** reintroduce birds, koi fish, or leaves as tile illustrations. Use the existing dots, bamboo, petal motifs, cherry blossoms, Mount Fuji, torii gate, pagoda, lantern, chrysanthemum, folding fan and other floral/ornamental motifs.
- Tile faces are generated as inline SVG strings in `svgFace()`. Keep different tile types easily distinguishable at phone scale.
- Keep music soft, minimal, and calming; avoid busy or loud melodies. Preserve the mute toggle.
- Maintain sufficient contrast and accessible button labels, and do not make tiles smaller solely to fit the complete board on screen.

## Code conventions

- This is a compact prototype: make focused, readable changes, and avoid introducing frameworks without a concrete need.
- Prefer existing functions and state patterns over adding a second renderer or extra global state.
- Avoid DOM injection with unescaped user-supplied text; use the existing `esc()` helper for any dynamic text that can come from external input.
- Keep `index.html`, `style.css`, and `script.js` as separate files, linked by relative paths, so the project works offline and on GitHub Pages.
- Update `README.md` and this file if the gameplay rules, assets, structure, or controls change.

## Testing checklist

1. Run `node --check script.js`.
2. Open `index.html` and navigate Home → Levels → Game.
3. Verify levels contain 72, 96, and 144 tiles respectively and show a large, layered layout.
4. Verify blocked tiles cannot be selected; only matching free pairs disappear.
5. Test Hint, Undo, Restart, progression, and the stuck-board dialog.
6. Verify the board scrolls horizontally on a narrow mobile viewport.
7. Test music on/off after a user gesture; check that the preference persists after reload.
8. Verify tile faces contain no letters, arrows, birds, fish, or leaves.

The app exposes `window.__BLOOM_TEST__` with `{ levels, positions, buildBoard, free, freePairs, types }` for lightweight browser-console tests.
