// Exports cv.html to one A4 PDF per language in cv/out/.
// Usage: node cv/build.mjs   (needs the `playwright` package and a Chromium;
// set CHROME_PATH to use an existing browser binary)
import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile, mkdir } from "node:fs/promises";
import { extname, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const types = { ".html": "text/html", ".webp": "image/webp", ".css": "text/css", ".jpg": "image/jpeg", ".js": "text/javascript" };
const server = createServer(async (req, res) => {
  try {
    const p = join(root, decodeURIComponent(new URL(req.url, "http://x").pathname));
    if (!p.startsWith(root)) throw 0;
    const body = await readFile(p);
    res.writeHead(200, { "content-type": types[extname(p)] || "application/octet-stream" });
    res.end(body);
  } catch { res.writeHead(404); res.end(); }
}).listen(0);
const port = server.address().port;

const out = join(root, "cv", "out");
await mkdir(out, { recursive: true });
const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
const names = { ca: "AlbertMoraCvCat.pdf", es: "AlbertMoraCvEsp.pdf", en: "CvAlbertMoraEng.pdf" };
for (const [lang, file] of Object.entries(names)) {
  const page = await browser.newPage();
  await page.goto(`http://localhost:${port}/cv/cv.html?lang=${lang}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const overflow = await page.evaluate(() => [...document.querySelectorAll("aside, main")].map((e) => e.scrollHeight - e.clientHeight));
  if (overflow.some((d) => d > 1)) console.warn(`${lang}: content overflows the page by`, overflow, "px");
  await page.pdf({ path: join(out, file), format: "A4", printBackground: true, preferCSSPageSize: true });
  await page.screenshot({ path: join(out, `${lang}.png`), fullPage: false, clip: { x: 0, y: 0, width: 794, height: 1123 } });
  console.log("wrote", file);
  await page.close();
}
await browser.close();
server.close();
