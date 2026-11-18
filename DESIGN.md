---
name: Mohamad Noor-Chowdhury Showcase Hub
description: A portfolio of self-contained pieces, each in its own visual world; this file records the Game-Day Program world of From the Colosseum to the Cloud.
colors:
  navy: "oklch(0.357 0.054 263)"
  sage: "oklch(0.692 0.063 124)"
  mustard: "oklch(0.806 0.142 89)"
  terracotta: "oklch(0.687 0.109 49)"
  terracotta-ink: "oklch(0.52 0.12 45)"
  sage-ink: "oklch(0.47 0.07 126)"
  deep-navy-ink: "oklch(0.255 0.045 263)"
  navy-ink-soft: "oklch(0.42 0.045 263)"
  newsprint: "oklch(0.955 0.014 120)"
  newsprint-second-sheet: "oklch(0.92 0.022 120)"
  navy-hairline: "oklch(0.357 0.054 263 / 0.18)"
  navy-rule-strong: "oklch(0.357 0.054 263 / 0.45)"
  pale-on-navy: "oklch(0.88 0.02 110)"
typography:
  display:
    fontFamily: "Alfa Slab One, Rockwell, Georgia, serif"
    fontSize: "clamp(3rem, 7.4vw, 6rem)"
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: "0em"
  headline:
    fontFamily: "Alfa Slab One, Rockwell, Georgia, serif"
    fontSize: "clamp(2.1rem, 6vw, 5.25rem)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0em"
  figure:
    fontFamily: "Alfa Slab One, Rockwell, Georgia, serif"
    fontSize: "clamp(4rem, 9vw, 6rem)"
    fontWeight: 400
    lineHeight: 0.9
    fontFeature: "tnum"
  title:
    fontFamily: "Alfa Slab One, Rockwell, Georgia, serif"
    fontSize: "28px"
    fontWeight: 400
    lineHeight: 1.1
  lead:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "clamp(21px, 1.8vw, 24px)"
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "19px"
    fontWeight: 400
    lineHeight: 1.65
  label-heading:
    fontFamily: "Libre Franklin, Franklin Gothic Medium, Arial, sans-serif"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: 1.3
  label:
    fontFamily: "Libre Franklin, Franklin Gothic Medium, Arial, sans-serif"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: 1.35
  table:
    fontFamily: "Libre Franklin, Franklin Gothic Medium, Arial, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  none: "0px"
  track: "2px"
  nav: "4px"
  roundel: "50%"
spacing:
  gutter: "clamp(20px, 5vw, 72px)"
  block: "clamp(40px, 5vw, 64px)"
  page-top: "clamp(48px, 7vw, 96px)"
  page-bottom: "clamp(72px, 10vw, 128px)"
  box: "24px"
  cell: "12px 16px"
  head-height: "56px"
  measure: "68ch"
  frame: "1440px"
components:
  running-head:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.newsprint}"
    typography: "{typography.label}"
    height: "{spacing.head-height}"
  chapter-link:
    textColor: "{colors.pale-on-navy}"
    rounded: "{rounded.nav}"
    padding: "8px 12px"
  chapter-link-active:
    textColor: "{colors.mustard}"
  cover:
    backgroundColor: "{colors.mustard}"
    textColor: "{colors.deep-navy-ink}"
    typography: "{typography.display}"
  title-mark:
    backgroundColor: "{colors.terracotta}"
    textColor: "{colors.deep-navy-ink}"
    padding: "0 0.14em 0.04em"
  price-roundel:
    backgroundColor: "{colors.terracotta}"
    textColor: "{colors.deep-navy-ink}"
    rounded: "{rounded.roundel}"
    width: "clamp(112px, 12vw, 152px)"
  box-score:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.mustard}"
    padding: "24px 20px 26px 0"
  opener-terracotta:
    backgroundColor: "{colors.terracotta}"
    textColor: "{colors.deep-navy-ink}"
    typography: "{typography.headline}"
  opener-sage:
    backgroundColor: "{colors.sage}"
    textColor: "{colors.deep-navy-ink}"
    typography: "{typography.headline}"
  opener-mustard:
    backgroundColor: "{colors.mustard}"
    textColor: "{colors.deep-navy-ink}"
    typography: "{typography.headline}"
  opener-navy:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.newsprint}"
    typography: "{typography.headline}"
  lineup-table-head:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.newsprint}"
    padding: "{spacing.cell}"
  lineup-table-figure:
    textColor: "{colors.terracotta-ink}"
  team-head-home:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.newsprint}"
    padding: "{spacing.cell}"
  team-head-away:
    backgroundColor: "{colors.terracotta}"
    textColor: "{colors.deep-navy-ink}"
    padding: "{spacing.cell}"
  program-box:
    textColor: "{colors.deep-navy-ink}"
    rounded: "{rounded.none}"
    padding: "{spacing.box}"
  figure-strip:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.newsprint}"
    padding: "clamp(28px, 4vw, 48px)"
  price-board:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.newsprint}"
    padding: "clamp(24px, 4vw, 48px)"
    width: "820px"
  price-board-total:
    backgroundColor: "{colors.terracotta}"
    textColor: "{colors.deep-navy-ink}"
    padding: "18px 24px"
---

# Design System: Mohamad Noor-Chowdhury Showcase Hub

## Overview

**Creative North Star: "The Game-Day Program"**

This hub has no single house style. PRODUCT.md commits each article to a design that serves its subject, so every surface below owns its world and its stylesheet. A new surface does not inherit another surface's tokens; it either extends the world it belongs to or earns its own.

**Surfaces and their evidence:**

- **Hub pages** (home, portfolio, about, contact): the toffee, oat and strawberry "sheet" world in `src/styles.css`.
- **The Future of FinTech** (`/project/fintech`): the original cool blueprint sheet variant, kept in `src/styles.css`.
- **Tokenization** (`/tokenization`): `src/views/tokenization.css`.
- **The Few Seconds That Move Your Money** (`/few-seconds`): `src/views/few-seconds.css`.
- **The Slow Death of Affordable Gaming** (`/affordable-gaming`): `src/views/affordable-gaming.css`.
- **Cognitive QA demo** (`/cognitive-qa/*`): `src/views/cognitive-qa-amber.css` and `src/views/cognitive-qa-hud.css`.
- **From the Colosseum to the Cloud** (`/colosseum`): `src/views/colosseum.css`, scoped under the article root. This is the world recorded in full below; every token in the frontmatter belongs to it and to no other surface.

The Colosseum article is a 1970s stadium game-day program. Four flat inks chosen by the author (navy #2D3C59, sage #94A378, mustard #E5BA41, terracotta #D1855C) print onto sage-washed newsprint. A mustard cover carries a slab-serif title and a flat four-ink emblem of the arena with a cloud above it; a navy box-score line lists four headline numbers; each chapter opens on a full-width page printed in one ink, and reading settles back onto newsprint with lineup tables, square ink-ruled boxes and a concession price board. It is dense, warm and printed, the opposite of a dark streaming-tech long read with glow and glass.

**Key Characteristics:**
- Four author-pinned inks, printed flat; every other color is derived from them.
- Sage-washed newsprint ground, with a second sheet one step down for alternating bands.
- Alfa Slab One for display and every big number, Libre Franklin for heads, labels and tables, Source Serif 4 for reading.
- Square corners and solid ink rules; no shadows, no blurs, no blended gradients.
- Motion reads as printing: plates snap into register, ink pages roll on, figures tally up.

## Colors

Four flat inks on newsprint, with a deep navy ink for type and two darkened inks that let terracotta and sage carry text on paper.

### Primary
- **Program Navy** (author pin #2D3C59): the structural ink. Running head, box score, figure strips, lineup table heads, the home team's head, price board ground, footer, every 2px box frame and 6px top rule.

### Secondary
- **Terracotta** (author pin #D1855C): the hot ink. The title mark band behind "Colosseum", the price roundel, the away team's head, the board's grand-total bar, focus outlines, link underlines and the second rule on paired items. On newsprint, text and figures use **Terracotta Ink** (a darkened terracotta) instead, so they stay legible.

### Tertiary
- **Mustard** (author pin #E5BA41): the cover field, the reading-progress rule, big figures on navy, the active chapter link, text selection, the price board's top band, and one opener ink.
- **Sage** (author pin #94A378): one opener ink, the stroke of the broadcast arcs and drawings, the hatched "unknown" revenue bar. On newsprint, sage-colored text uses **Sage Ink**.

### Neutral
- **Sage-Washed Newsprint**: the page ground, also set on the document root and scrollbar track.
- **Second Sheet**: alternating page bands, one step darker than newsprint.
- **Deep Navy Ink**: all primary text, and text on mustard, sage and terracotta fields.
- **Soft Navy Ink**: running prose and secondary text on newsprint.
- **Navy Hairline** and **Strong Navy Rule**: table and list dividers, and the divider above each pain point.
- **Pale on Navy**: labels and captions on navy fields (box-score labels, board subhead, total captions).

### Named Rules
**The Four Inks Rule.** Every field, rule and emblem fill is one of the four inks, newsprint, or a ramp step derived from them. No other hue enters the page.

**The Readable Ink Rule.** Terracotta and sage print as fields; when they carry text or figures on newsprint they switch to Terracotta Ink and Sage Ink. Never set a bare terracotta or sage number on paper.

**The Flat Print Rule.** Inks are printed flat. The only patterned fill is the diagonal hatch on the "unknown" bar, a print screen in sage at full and half strength; it is a hatch, not a blend.

## Typography

**Display Font:** Alfa Slab One (with Rockwell, Georgia)
**Body Font:** Source Serif 4 (with Georgia), optical sizing on
**Label Font:** Libre Franklin (with Franklin Gothic Medium, Arial)

**Character:** A heavy slab shouts the title, chapter names and every number like a scoreboard; a plain Franklin gothic does the program's bookkeeping; a calm serif carries the argument.

### Hierarchy
- **Display** (400, clamp(3rem, 7.4vw, 6rem), 0.98): the cover title only, set in three lines with the middle word on a terracotta band.
- **Headline** (400, clamp(2.1rem, 6vw, 5.25rem), 1): chapter opener titles, two lines, the second line in the opener's accent treatment.
- **Figure** (400, clamp(4rem, 9vw, 6rem), 0.9, tabular): the big number on figure strips and the grand total. Smaller slab figures (36 to 56px box score and fact numbers, 20px table figures, up to 72px board total) use the same face and tabular numerals.
- **Title** (400, 26 to 30px, 1.1): era names, pain points, path names and the board head, all in the slab.
- **Lead** (400, clamp(21px, 1.8vw, 24px), 1.5): the opening paragraph of each chapter page.
- **Body** (400, 19px, 1.65): reading prose at a 68ch measure, in Soft Navy Ink with bold runs in Deep Navy Ink. The closing essay steps up to 20px at 1.7.
- **Label heading** (700, 20px, 1.3): in-chapter subheads in Libre Franklin. Box and fact heads use 17px at 700.
- **Label** (500 to 700, 15px): running head links, bylines, notes, legends, box-score labels, table heads. Sentence case, no tracking.

### Named Rules
**The Slab Numbers Rule.** Every figure the reader is meant to remember is set in Alfa Slab One with tabular numerals. Body copy never carries a headline number in the serif.

**The Three Voices Rule.** Slab for names and numbers, Franklin for structure, serif for argument. A heading is never set in the reading serif, and prose is never set in Franklin.

## Layout

A full-bleed program: colored fields run edge to edge while content sits in a 1440px frame with a fluid gutter (clamp(20px, 5vw, 72px)). Reading text holds a 68ch measure inside that frame; tables, lineups, eras and boxes may use the full frame width. Chapter pages pad clamp(48px, 7vw, 96px) top and clamp(72px, 10vw, 128px) bottom, and components inside them are separated by clamp(40px, 5vw, 64px).

The running head is sticky at 56px with a 4px progress rule beneath; anchors scroll with that height plus 24px of clearance. The cover fills the first viewport (up to 900px tall) in a 7:5 two-column grid from 1000px; below that the emblem leads at a smaller size so the title still lands in the first screen. Openers are a two-column grid (title, emblem) from 900px; below it the emblem moves above the title at 112px.

Multi-column groups collapse in steps: box score 2 then 4 columns (900px), eras 1, 2, then 5 (700px, 1100px), facts 1 then 3 (800px), lineups and paths 1 then 2 (900px), the three-step flow 1 then 5 tracks with arrows (1000px). Chapter links show from 900px; below it the running head shows the current chapter name instead. Wide tables scroll horizontally under 800px with a fade on the right edge.

## Elevation & Depth

Flat. There are no drop shadows, glows, blurs or glass anywhere in the world. Depth comes from printing order: a colored field sits on newsprint, a band of a second ink sits on that field, and rules of navy separate content. The one box-shadow in the stylesheet is an inset 1px hairline used as a column divider in the box score, a rule rather than a lift.

### Named Rules
**The Printed Not Lifted Rule.** Separate things with a field of ink, a solid rule or the second sheet, never with a shadow.

## Shapes

Square. Fields, boxes, tables, strips and bands all have 0 radius. Frames are 2px solid navy; section openers for lists and facts are a 6px navy top rule; table bodies close on a 3px navy rule; the price board opens on a 10px mustard band. Rounding appears only where the shape means something: the 50% price roundel stamped at -8deg, the 2px ends of bar tracks and legend swatches, and a 4px hover field on chapter links. Emblems are flat filled SVG shapes in the inks, drawn on three ink slots per opener so each chapter recolors the same drawing.

## Components

### Running Head
Navy band, sticky. Author name at left in mustard Libre Franklin 700 at 16px, chapter links at right (15px, 500, pale on navy, 8px 12px). Hover lays a faint light field under the link; the current chapter turns mustard with a 2px mustard underline at 6px offset. A 4px mustard rule under the band scales from 0 to the reading position.

### Cover
Mustard field. Three-line slab title in Deep Navy Ink with "Colosseum" knocked onto a terracotta band. Serif deck at up to 23px, 34ch, then a Franklin byline. At right, the four-plate emblem (newsprint, navy, sage arcs, terracotta) with a terracotta price roundel at its lower right corner, Franklin label over a slab figure.

### Box Score
Navy band directly under the cover. Four stats in a 2 or 4 column grid separated by pale hairlines; each stat is a slab figure in mustard (36 to 56px) with its Franklin label beneath it.

### Chapter Opener
A full-width page in one ink, cycled terracotta, sage, navy, mustard. The two-line slab headline sits bottom-left; a flat emblem sits right. The second line is the signature: on sage and terracotta it is knocked out onto a navy band in newsprint; on mustard it sits on a terracotta band in Deep Navy Ink; on navy it simply prints in mustard. The emblem's three ink slots are reassigned per opener so it always prints in the inks the page is not.

### Lineup Tables
Libre Franklin at 17px. Header cells are a solid navy band with newsprint text at 15px, 700. Rows divide on navy hairlines; the first column is 600 in Deep Navy Ink; figure cells are right-aligned slab numerals in Terracotta Ink at 20px. The body closes on a 3px navy rule. Two-team lineups use the same grammar with a navy home head and a terracotta away head, each item a Franklin name over a serif line.

### Program Boxes
Square, transparent, 2px navy frame, 24px or fluid padding. Used for the pattern note, chart, revenue bars, flow steps, number pairs and the Venu panel. Heads in Franklin 17px 700, figures in the slab, notes in Soft Navy Ink. Paired lists and fact rows use a 6px navy top rule instead of a frame.

### Figure Strip and Grand Total
A navy strip holding one huge mustard slab figure beside a short paragraph, mustard for bold runs. The ruled variant drops the field for 6px terracotta rules above and below and prints the figure in Terracotta Ink.

### Concession Price Board
Navy board capped by a 10px mustard band, max 820px. A slab head over a mustard 3px rule, then line items: Franklin name, a dotted leader, a mustard slab price. It ends on a terracotta total bar with a slab figure up to 72px in Deep Navy Ink.

### Chart and Bars
The chart lives in a program box: navy hairline grid, Franklin axis labels, a 4px Terracotta Ink line for streaming and a 4px navy line for linear TV, a translucent mustard band and a mustard dot ringed in ink marking the crossover. Revenue bars are 18px tracks of navy hairline tint filled in terracotta, navy, mustard, or the sage hatch.

### Motion
One easing for the world (cubic-bezier(0.16, 1, 0.3, 1)). On load the four emblem plates print out of register and snap in, ink by ink (900ms, staggered 80 to 500ms), the roundel stamps on (520ms), and title lines rise from a clip. Openers roll on left to right with a clip-path wipe (900ms) and the headline follows. Figures tally to their printed value (1300ms, quartic ease-out); bars fill (1100ms, staggered 120ms); price board lines arrive in order; chart lines draw once (1600ms). While the cover is on screen its broadcast arcs pulse and the cloud drifts. All content is visible without script; anything already on screen never waits; reduced motion shows the final state.

## Do's and Don'ts

### Do:
- **Do** print every field in one of the four inks or newsprint, and derive any new tone from those inks in OKLCH.
- **Do** switch to Terracotta Ink or Sage Ink whenever those hues carry text or numbers on newsprint.
- **Do** set every headline number in Alfa Slab One with tabular numerals.
- **Do** frame boxes with a 2px navy rule at 0 radius, and open lists and fact rows with a 6px navy top rule.
- **Do** keep the opener's second-line device: navy band on sage and terracotta, terracotta band on mustard, mustard type on navy.
- **Do** draw emblems as flat filled shapes in the inks, using the three per-opener ink slots.
- **Do** keep content visible without script and let reduced motion land on the final state.

### Don't:
- **Don't** use drop shadows, glows, glass or backdrop blur.
- **Don't** blend inks in gradients; a print hatch or a functional scroll fade is the limit.
- **Don't** round boxes, strips, tables or fields.
- **Don't** add hues outside the four inks, and don't change the author's four pins.
- **Don't** set prose in Franklin or headings in the reading serif.
- **Don't** apply these tokens to another surface in the hub; each surface keeps its own world.
