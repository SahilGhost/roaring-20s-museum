# Roaring 20s Museum

An interactive 3D history museum for Team B's Roaring Normalcy focus. Built as a static browser game with bundled Three.js.

## Play

Open the [hosted museum](https://normalcy-museum-sahil.savoryperch5.chatgpt.site/). The hosted Site currently requires its owner's access.

To run locally, clone this repository and run:

    python3 -m http.server 4173 --directory dist --bind 127.0.0.1

Then open http://127.0.0.1:4173/.

Use WASD to walk, Shift to move faster, drag to look, and click or press E to interact.

## Modes

- **Free Exploration:** Every gallery and the floor plan are available. Artifact panels include curator prompts.
- **Escape Room:** Solve five galleries in sequence. The clock continues through reading and menus. Gallery 5 unlocks the Reference Room; opening that room's door stops the timer and displays congratulations, incorrect MCQ answers, and hints revealed. The hall uses darker lighting, with reduced-motion controls disabling flicker.

The five galleries cover German reparations and U.S. finance; government relations with business and labor; Harding and Coolidge economic policy; Harding-era corruption and Teapot Dome; and Coolidge's public style and communication.

The Reference Room contains the bibliography and separate A1 and D1 essential-question libraries. Twenty-two artifacts include historical background, significance, source metadata, and read-aloud. Original Harding and Coolidge audiovisual sources are linked separately from browser speech synthesis.

## Source layout

- dist/museum.js: architecture, navigation, doors, lighting and controls
- dist/session.js: progression, room access and stopwatch
- dist/collection.js: procedural artifact models and placement
- dist/exhibit-content.js: artifact labels, source bibliography and puzzles
- dist/exhibit-history.js: expanded historical background and significance
- dist/exhibit-ui.js: artifact panels, challenges, hint tracking and results
- dist/eq-answers.js: student-authored A1 and D1 interpretations
- tests/: navigation, progression, geometry, scoring and result checks
- design/: classroom production guide

## Check

    node tests/navigation.mjs
    node tests/session.mjs
    node tests/collection.mjs
    node tests/results.mjs

The project has no npm installation or build step. Three.js is bundled under its MIT license; the license notice is in dist/vendor/LICENSE-three.txt. Historical source material remains attributed in the in-game bibliography.
