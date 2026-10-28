// Launches a headless Chromium for the scripts: Playwright's own download if there is one,
// else Google Chrome, else CHROME_PATH. Needs `playwright-core` (`npm install` at the repo root).
import { existsSync, readdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

let chromium;
try {
  ({ chromium } = await import("playwright-core"));
} catch {
  console.error("playwright-core is missing: run `npm install` in the skills repo root.");
  process.exit(1);
}

const BUNDLES = [
  "chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing",
  "chrome-mac/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing",
  "chrome-mac-x64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing",
  "chrome-linux64/chrome",
  "chrome-linux/chrome",
  "chrome-win64/chrome.exe",
];
const SYSTEM = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
];

export function chromePath() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const caches = [
    process.env.PLAYWRIGHT_BROWSERS_PATH,
    join(homedir(), "Library/Caches/ms-playwright"),
    join(homedir(), ".cache/ms-playwright"),
  ].filter(Boolean);
  for (const cache of caches) {
    if (!existsSync(cache)) continue;
    const versions = readdirSync(cache)
      .filter((name) => /^chromium-\d+$/.test(name))
      .sort((a, b) => Number(b.slice(9)) - Number(a.slice(9)));
    for (const version of versions)
      for (const bundle of BUNDLES) {
        const path = join(cache, version, bundle);
        if (existsSync(path)) return path;
      }
  }
  const system = SYSTEM.find((path) => existsSync(path));
  if (system) return system;
  throw new Error("No Chromium found: run `npx playwright install chromium` or set CHROME_PATH.");
}

export const launch = (options = {}) => chromium.launch({ executablePath: chromePath(), ...options });
