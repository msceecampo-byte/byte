// Exports every <section class="asset"> in marketing/kit.html to marketing/png/<name>.png
// at its exact pixel size.
//
//   npm i -g playwright   (once; uses the Chromium Playwright manages)
//   node tools/build_marketing.mjs

import { createRequire } from "node:module";
import { execSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
let playwright;
try {
  playwright = require("playwright");
} catch {
  playwright = require(join(execSync("npm root -g").toString().trim(), "playwright"));
}

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "marketing", "png");
mkdirSync(out, { recursive: true });

const browser = await playwright.chromium.launch();
const page = await browser.newPage({ viewport: { width: 2000, height: 1200 } });
await page.goto(pathToFileURL(join(root, "marketing", "kit.html")).href, { waitUntil: "networkidle" });
await page.waitForSelector("body[data-ready]");

for (const asset of await page.$$("section.asset")) {
  const name = await asset.getAttribute("data-name");
  await asset.screenshot({ path: join(out, `${name}.png`), animations: "disabled" });
  const { width, height } = await asset.boundingBox();
  console.log(`${name}.png  ${width}×${height}`);
}

await browser.close();
