# BLOOM — Japanese-Inspired Mahjong Solitaire

**Match. Relax. Bloom.**

BLOOM is a calming, mobile-friendly Mahjong Solitaire game. Match pairs of identical free tiles to clear increasingly challenging layered boards while enjoying Japanese-inspired illustrations and gentle, original ambient music.

## Play locally

1. Download this project or clone the repository.
2. Open `index.html` in a modern browser (Chrome, Safari, Firefox, or Edge).
3. Choose a board and start matching. No installation, account, backend, or internet connection is required.

> Audio starts only after you interact with the page, following browser autoplay restrictions. Use the in-game music toggle to mute or unmute it.

## Gameplay

- Select two **identical free tiles** to remove them.
- A tile is free when no tile covers it and **at least one horizontal side** is open.
- Clear all tiles to finish a board and unlock the next level.
- Use **Hint** to highlight a match, **Undo** to reverse a move, and **Restart** to try again.
- On a narrow screen, swipe horizontally to explore the full board.

## Levels

| Level | Board | Tiles | Pairs |
| --- | --- | ---: | ---: |
| 1 | Lotus Path | 72 | 36 |
| 2 | Jade Terrace | 96 | 48 |
| 3 | Grand Garden | 144 | 72 |

## Features

- Classic layered Mahjong Solitaire matching rules
- Custom symbol-only tile faces inspired by Japanese motifs, including cherry blossoms, Mount Fuji, pagodas, and fans
- Responsive browser interface and large horizontal-scrolling boards
- Original calm instrumental audio synthesized with the Web Audio API; no external audio files required
- Optional music toggle, Hint, Undo, and Restart
- Local browser progress saving for unlocked levels

## Project structure

```text
.
├── index.html   # Complete self-contained HTML, CSS, JavaScript, tile art, and audio
└── README.md    # This guide
```

## Publish with GitHub Pages

1. Upload `index.html` and `README.md` to the default branch of your GitHub repository.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**, then choose `main` and `/ (root)`.
4. Save and use the URL shown by GitHub Pages when deployment finishes.

## About

BLOOM is an independent, Japanese-inspired Mahjong Solitaire prototype created as a mobile UX/UI and casual-game design portfolio project. It is not an official Mahjong game or affiliated with any existing commercial product.
