---
name: balance-out
description: Use when building or adjusting UI spacing — rows, cards, tables, charts, headline numbers — or when a layout looks uneven, cramped or off, such as "even out the padding", "rows look taller than wide", "the graph is too close to the top", "make it balanced". Pads to the letters, standardizes row heights and proves alignment by measurement.
---

# Balance out

A layout is _balanced_ when every edge reads as the same distance and every row as the same
height. The eye measures to the **letters**, not to the line box CSS pads from: a 14px font on a
20px line leaves 4–5px of empty space above its capitals and 5–6px under its baseline, so
`padding: 16px` reads as 21px on top and 16px at the sides. Balance is therefore built from
_optical insets_ (box edge to capitals, baseline to box edge, box edge to the first letter) and
proved with a measurement, never by eye.

## Steps

1. **Measure the font.** For each size and line height in play:
   `node <skill dir>/scripts/font-metrics.mjs <font file> 14/20 13/20 28/32 --inset <P>`.
   It prints `capTop`, `baselineBottom` and the `padTop` / `padBottom` that put the letters
   exactly P from the edge. Done when every size on the surface has a row.
2. **Pick the scale.** One inset P for every block of a surface (rows, table heads, card titles,
   empty states); the sides take the same P. Headline numbers take more (see Reference). Write
   the scale down where the surface's tokens live (a `ROW` class, the design doc) with the
   measured reason beside it, so the next block reuses it.
3. **Build** with the compensated padding: top `P − capTop`, bottom `P − baselineBottom`, sides
   P, on an explicit line height. Round to the nearest whole or half pixel. Done when no block
   of the surface pads with a raw "16px all round".
4. **Render and measure.** Run the app, open the surface at 1280 and 390 wide, in light and
   dark, and run `scripts/optical-insets.js` over the blocks (usage in its header). Done when
   every block's top, bottom and side insets are P ±1 and every single-line row reports the same
   height. A row that drifts is a finding: fix it and measure again.
5. **Report the numbers**: the scale, the measured table, the screenshots. "Looks balanced" is
   not evidence.

## Reference

**Insets**

- Measure to the letters. Line boxes, icons' boxes and `line-height` padding are invisible to
  the eye.
- Sides equal tops. A row 20px from the letters at top and bottom gets 20px sides; a mismatch
  reads as "wider than tall".
- A leading mark (swatch, avatar, icon) sits on the side inset; the text follows it at a fixed
  gap. `optical-insets.js` counts text only, so a row with a leading mark reports
  `left = P + mark + gap`.
- Bigger type gets more room, never less: a 28px headline number sits ≥1.2P from the edge above
  it and ≥2P from dense content under it (a chart), or it reads as crammed against both.
- Labels centered on a line (chart ticks, badges on a divider) stick out of their box by half
  their height. Count that overhang: a chart's top tick label is text at the chart's top edge.
- `text-box: trim-both cap alphabetic` trims to the letters for buttons and key caps, but
  clipping (`overflow: hidden`, `truncate`) then cuts accents and descenders. On anything that
  truncates, compensate in the padding instead.

**Rows**

- Every single-line row of a surface has the same height: one padding class, one explicit line
  height.
- Mixed sizes on one baseline (a 12px mono code beside 14px text, 13px figures in a grid) stretch
  the line box past its `line-height` and the row grows 1–2px. Give every span in the row the
  row's line height (`leading-5` on each), or align the row on `center` instead of `baseline`.
- Dividers run edge to edge and show in both themes; a divider that vanishes by day leaves rows
  floating.
- A divider drawn as a border (`divide-y`) sits inside a row's box and makes it 1px taller than
  its neighbours. The eye measures from the divider, and so does `optical-insets.js`: it reports
  insets and heights inside the borders.

**Alignment**

- One left edge line per surface: titles, row text, table heads and chart axis labels all start
  on it. Axis numbers align to that edge (left-aligned), not right-aligned into a gutter.
- Figures in tables are right-aligned in fixed-width columns with `tabular-nums`, so digits
  stack.
- Controls beside a page title align their glyphs, not their boxes, with the content edge
  below.

**Structure**

- A card's title is its first row, inside the card. A table's title row doubles as its column
  heads (title over the names, column names over the figures), so a table is one island with no
  separate heading row.
- Bars in a chart: each category is an equal cell with half the gap on each side, so the gaps
  between bars and at both ends match.
- A meter or progress bar means "this much of a limit is used up". Use one only for something
  depletable with a cap (credits, quota, storage). Counts without a cap are rows with the number,
  the share of the total and the change.
- The headline number states what is being counted and its period ("2,489 solicitudes, +13 % vs.
  la semana anterior"), with secondary figures on the same baseline.

## Example: Códice values

Radio Grotesk (`apps/app/public/fonts/PPRadioGrotesk-Regular.woff2`), measured: 14/20 → capTop
4.5, baselineBottom 5.5; 13/20 → 4, 6; 28/32 → 5, 7; 11/11 → 1, 2. The dashboard's P is 20
(`ROW` in `apps/app/src/components/ui.tsx`: `px-5 pt-4 pb-3.5 leading-5`); the Uso page's
headline sits 24 under its tabs and 40 over its chart (`apps/app/DESIGN.md`).
