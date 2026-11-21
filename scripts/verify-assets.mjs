import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const walk = (directory) => fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const file = path.join(directory, entry.name);
  return entry.isDirectory() ? walk(file) : [file];
});
const sourceFiles = walk("src").filter((file) => /\.(jsx?|scss)$/.test(file));
const source = sourceFiles.map((file) => fs.readFileSync(file, "utf8")).join("\n");
const references = [...new Set([...source.matchAll(/["'](\/(?:models|textures|basis|fonts)\/[^"']+)["']/g)].map((match) => match[1]))];
const missing = references.filter((file) => !fs.existsSync(path.join("public", file)));
const forbiddenReferenceMedia = /showcase\.foxora\.studio|codrops-1f606\.kxcdn\.com|<iframe|<video/.test(source);
const publicFiles = walk("public");
const hash = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const upstream = process.argv[2];
const changedAssets = upstream ? publicFiles.filter((file) => {
  const original = path.join(upstream, file);
  return !fs.existsSync(original) || hash(file) !== hash(original);
}) : [];
const unexpectedChanges = changedAssets.filter((file) => file.replaceAll("\\", "/") !== "public/media/site.webmanifest");

const result = {
  publicFiles: publicFiles.length,
  runtimeAssetReferences: references.length,
  missing,
  forbiddenReferenceMedia,
  upstreamCompared: Boolean(upstream),
  changedAssets,
  unexpectedChanges,
};
console.log(JSON.stringify(result, null, 2));
if (missing.length || forbiddenReferenceMedia || unexpectedChanges.length) process.exitCode = 1;
