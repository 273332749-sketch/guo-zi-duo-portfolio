import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const base = new URL(process.argv[2] || "http://localhost:4173/guo-zi-duo-portfolio/");
const walk = (directory) => fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const file = path.join(directory, entry.name);
  return entry.isDirectory() ? walk(file) : [file];
});
const hash = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const root = await fetch(base);
if (!root.ok) throw new Error(`Root returned ${root.status}`);
const html = await root.text();
const applicationFiles = [...html.matchAll(/(?:src|href)="([^"]+)"/g)]
  .map((match) => match[1]).filter((url) => /\.(?:js|css)$/.test(url));
const failures = [];
let checked = 0;

for (const file of walk("public")) {
  const relative = path.relative("public", file).replaceAll("\\", "/");
  const response = await fetch(new URL(relative, base));
  const data = new Uint8Array(await response.arrayBuffer());
  if (!response.ok || hash(data) !== hash(fs.readFileSync(file))) failures.push(`${relative}: status or content mismatch`);
  checked++;
}
for (const file of applicationFiles) {
  const url = new URL(file, base);
  if (!url.pathname.startsWith(base.pathname)) failures.push(`Wrong base path: ${url.pathname}`);
  const response = await fetch(url);
  const content = await response.text();
  if (!response.ok) failures.push(`${url.pathname}: ${response.status}`);
  if (file.endsWith(".css") && /url\(["']?\/(?:fonts|media)\//.test(content)) failures.push("CSS contains unprefixed public assets");
  if (file.endsWith(".js") && /showcase\.foxora\.studio|codrops-1f606\.kxcdn\.com/.test(content)) failures.push("Reference media found in runtime bundle");
}
console.log(JSON.stringify({ base: base.href, rootStatus: root.status, publicFilesChecked: checked, applicationFilesChecked: applicationFiles.length, failures }, null, 2));
if (failures.length) process.exitCode = 1;
