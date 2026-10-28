// Captures framed, high-density shots of a running app (or a local HTML graphic) from a list of
// shot specs. Each shot opens its page, runs its actions, then crops a frame of a fixed aspect
// around a target element, so the subject sits where the spec puts it.
//
//   node frame.mjs shots.json [out-name]      # every shot, or only the one whose `out` matches
//
// A spec (all fields but `out` and `url` optional):
// {
//   "out": "shots/usage-dark.png",            // where the PNG goes, relative to the spec file
//   "url": "http://localhost:5173/?days=30",  // http(s) or file:// (templates/*.html)
//   "viewport": { "width": 1440, "height": 900 },
//   "dpr": 3,                                  // device pixel ratio; 3 keeps crops sharp at 2400px
//   "theme": "dark",                           // prefers-color-scheme for the page
//   "localStorage": { "app-theme": "dark" },   // set before any script runs (theme toggles)
//   "cookieJar": "jar.txt",                    // a curl -c cookie jar to sign in (localhost only)
//   "storageState": "state.json",              // or a Playwright storage state
//   "actions": [                               // in order; each may add "wait" ms (default 400)
//     { "click": "[aria-label='Team']" },
//     { "hover": "figure", "pos": { "x": 420, "y": 120 } },
//     { "press": "/" }, { "type": "a question" }, { "press": "Enter", "wait": 30000 },
//     { "waitFor": "text=Sources" }, { "eval": "document.body.dataset.x = 1" }
//   ],
//   "hide": ["header", "svg.background"],      // visibility:hidden before the shot, layout kept
//   "target": "section:has(figure)",           // the subject; omit to shoot the whole viewport
//   "bottom": "button",                        // optional: the subject runs down to the last match
//   "frameW": 960,                             // frame width in CSS px (the zoom: smaller = closer)
//   "aspect": 1.6,                             // width / height; 1.6 is 16:10
//   "top": 100,                                // px of air above the target; omit to centre it
//   "centerX": 975,                            // frame centre x; default the target's centre
//   "left": 0,                                 // or pin the frame's left edge at this page x
//   "keepMouse": false,                        // keep the cursor where the actions left it
//   "freeze": false                            // finish CSS animations (tooltips mid-fade)
// }
import fs from "node:fs";
import path from "node:path";

import { launch } from "./browser.mjs";

const [specFile, only] = process.argv.slice(2);
if (!specFile) {
  console.error("usage: frame.mjs <shots.json> [out-name]");
  process.exit(1);
}
const base = path.dirname(path.resolve(specFile));
const specs = JSON.parse(fs.readFileSync(specFile, "utf8"));

function jarCookies(file) {
  return fs
    .readFileSync(path.resolve(base, file), "utf8")
    .split("\n")
    .map((line) => line.replace(/^#HttpOnly_/, ""))
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => line.split("\t"))
    .filter((parts) => parts.length >= 7)
    .map(([domain, , cookiePath, secure, , name, value]) => ({
      name,
      value,
      domain: domain.replace(/^\./, ""),
      path: cookiePath,
      secure: secure === "TRUE" || name.startsWith("__Secure-") || name.startsWith("__Host-"),
    }));
}

const browser = await launch();
for (const spec of [].concat(specs)) {
  if (only && !spec.out.includes(only)) continue;
  const viewport = spec.viewport ?? { width: 1440, height: 900 };
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: spec.dpr ?? 3,
    colorScheme: spec.theme ?? "dark",
    storageState: spec.storageState ? path.resolve(base, spec.storageState) : undefined,
  });
  if (spec.cookieJar) await context.addCookies(jarCookies(spec.cookieJar));
  if (spec.localStorage)
    await context.addInitScript((entries) => {
      try {
        for (const [key, value] of Object.entries(entries)) localStorage.setItem(key, value);
      } catch {}
    }, spec.localStorage);

  const page = await context.newPage();
  await page.goto(spec.url, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(spec.wait ?? 800);

  for (const action of spec.actions ?? []) {
    if (action.click) await page.locator(action.click).first().click();
    if (action.hover)
      await page.locator(action.hover).first().hover(action.pos ? { position: action.pos } : {});
    if (action.press) await page.keyboard.press(action.press);
    if (action.type) await page.keyboard.type(action.type, { delay: 15 });
    if (action.waitFor) await page.locator(action.waitFor).first().waitFor({ timeout: 120000 });
    if (action.eval) await page.evaluate(action.eval);
    await page.waitForTimeout(action.wait ?? 400);
  }
  if (spec.hide)
    await page.evaluate((selectors) => {
      for (const selector of selectors)
        for (const element of document.querySelectorAll(selector)) element.style.visibility = "hidden";
    }, spec.hide);
  if (!spec.keepMouse) await page.mouse.move(1, 1);

  const out = path.resolve(base, spec.out);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const animations = spec.freeze ? "disabled" : "allow";
  if (!spec.target) {
    await page.screenshot({ path: out, animations });
    console.log(spec.out, "viewport", viewport);
    await context.close();
    continue;
  }

  const box = await page.locator(spec.target).first().boundingBox();
  if (!box) throw new Error(`${spec.out}: target ${spec.target} is not visible`);
  const scroll = await page.evaluate(() => ({ x: scrollX, y: scrollY }));
  const top = box.y + scroll.y;
  let bottom = top + box.height;
  if (spec.bottom) {
    const boxes = await page.locator(spec.bottom).evaluateAll((elements) =>
      elements.map((element) => element.getBoundingClientRect()).filter((rect) => rect.width > 0),
    );
    if (boxes.length) bottom = Math.max(...boxes.map((rect) => rect.bottom + scroll.y));
  }
  const width = spec.frameW ?? viewport.width;
  const height = Math.round(width / (spec.aspect ?? 1.6));
  const x =
    spec.left !== undefined
      ? spec.left
      : Math.round((spec.centerX ?? box.x + scroll.x + box.width / 2) - width / 2);
  const y = Math.round(spec.top !== undefined ? top - spec.top : (top + bottom) / 2 - height / 2);
  await page.screenshot({
    path: out,
    clip: { x: Math.max(0, x), y: Math.max(0, y), width, height },
    fullPage: true,
    animations,
  });
  console.log(spec.out, { target: box, frame: { x, y, width, height } });
  await context.close();
}
await browser.close();
