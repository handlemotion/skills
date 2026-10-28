// Measures, in a rendered page, how far each block's letters sit from the block's edges: the
// optical insets. Run it in the page (Playwright's page.evaluate, or the browser console):
//
//   const source = fs.readFileSync("<skill dir>/scripts/optical-insets.js", "utf8");
//   const rows = await page.evaluate(`${source}; opticalInsets(${JSON.stringify(selector)})`);
//   console.table(rows);
//
// `selector` names the blocks (rows, cards, a chart's figure). For each, it finds the first and
// last line of text inside and reports top (block edge to the capitals), bottom (baseline to
// block edge), left and right (block edge to the nearest letter), and height, in CSS px, all
// measured inside the block's borders. Capitals and
// baselines come from the font's canvas metrics, so they are the letters, not the line boxes.
globalThis.opticalInsets = function opticalInsets(selector) {
  const canvas = document.createElement("canvas").getContext("2d");
  const metricsOf = (element) => {
    const style = getComputedStyle(element);
    canvas.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    const glyph = canvas.measureText("H");
    return {
      cap: glyph.actualBoundingBoxAscent,
      ascent: glyph.fontBoundingBoxAscent,
      descent: glyph.fontBoundingBoxDescent,
    };
  };
  const lines = (block) => {
    const found = [];
    const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      if (!node.textContent.trim()) continue;
      const parent = node.parentElement;
      const style = getComputedStyle(parent);
      if (style.visibility === "hidden" || style.display === "none" || style.opacity === "0")
        continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      const { cap, ascent, descent } = metricsOf(parent);
      for (const rect of range.getClientRects()) {
        if (rect.width === 0) continue;
        // The content area is ascent + descent tall, centered in the line box the rect reports.
        const contentTop = rect.top + (rect.height - (ascent + descent)) / 2;
        const baseline = contentTop + ascent;
        found.push({
          left: rect.left,
          right: rect.right,
          capTop: baseline - cap,
          baseline,
          text: node.textContent.trim().slice(0, 24),
        });
      }
    }
    return found;
  };
  const round = (value) => Math.round(value * 10) / 10;
  return [...document.querySelectorAll(selector)].map((block) => {
    // Inside the borders: a divider drawn as a row's border is the edge the eye measures from.
    const outer = block.getBoundingClientRect();
    const style = getComputedStyle(block);
    const border = (side) => parseFloat(style[`border${side}Width`]) || 0;
    const box = {
      top: outer.top + border("Top"),
      bottom: outer.bottom - border("Bottom"),
      left: outer.left + border("Left"),
      right: outer.right - border("Right"),
      height: outer.height - border("Top") - border("Bottom"),
    };
    const found = lines(block);
    if (found.length === 0) return { block: block.tagName.toLowerCase(), text: "(no text)" };
    const top = Math.min(...found.map((line) => line.capTop));
    const bottom = Math.max(...found.map((line) => line.baseline));
    const left = Math.min(...found.map((line) => line.left));
    const right = Math.max(...found.map((line) => line.right));
    return {
      text: found[0].text,
      top: round(top - box.top),
      bottom: round(box.bottom - bottom),
      left: round(left - box.left),
      right: round(box.right - right),
      height: round(box.height),
    };
  });
};
