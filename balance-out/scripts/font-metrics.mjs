// The empty space a font leaves inside its line box, and the padding that puts its letters a
// given distance from a box's edge.
//
//   node font-metrics.mjs <font file> <size>/<line-height> [...] [--inset 20]
//   node font-metrics.mjs apps/app/public/fonts/PPRadioGrotesk-Regular.woff2 14/20 28/32 --inset 20
//
// For each size: capTop (line box top to the capitals' top), baselineBottom (baseline to line box
// bottom) and, with --inset, padTop / padBottom: the box padding that leaves the letters exactly
// that far from the edge. Needs `npm install` at the skills repo root.
import { readFileSync } from "node:fs";

import { launch } from "../../visuals/scripts/browser.mjs";

const args = process.argv.slice(2);
const insetAt = args.indexOf("--inset");
const inset = insetAt >= 0 ? Number(args.splice(insetAt, 2)[1]) : undefined;
const [file, ...pairs] = args;
if (!file || pairs.length === 0) {
  console.error("usage: font-metrics.mjs <font file> <size>/<line-height> [...] [--inset <px>]");
  process.exit(1);
}

const browser = await launch();
const page = await browser.newPage();
const font = readFileSync(file).toString("base64");
await page.setContent(
  `<style>@font-face{font-family:M;src:url(data:font/woff2;base64,${font})}</style><canvas></canvas>`,
);
const rows = [];
for (const pair of pairs) {
  const [size, lineHeight] = pair.split("/").map(Number);
  const metrics = await page.evaluate(
    async ([size, lineHeight]) => {
      await document.fonts.load(`${size}px M`);
      const context = document.querySelector("canvas").getContext("2d");
      context.font = `${size}px M`;
      const glyph = context.measureText("H");
      const ascent = glyph.fontBoundingBoxAscent;
      const descent = glyph.fontBoundingBoxDescent;
      const half = (lineHeight - (ascent + descent)) / 2;
      return {
        capTop: half + ascent - glyph.actualBoundingBoxAscent,
        baselineBottom: half + descent,
        capHeight: glyph.actualBoundingBoxAscent,
      };
    },
    [size, lineHeight],
  );
  const row = { size: `${size}/${lineHeight}`, ...metrics };
  if (inset !== undefined) {
    row.padTop = inset - metrics.capTop;
    row.padBottom = inset - metrics.baselineBottom;
  }
  rows.push(row);
}
console.table(rows);
await browser.close();
