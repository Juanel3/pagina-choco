#!/usr/bin/env node
/** Verifica que cada photo del catálogo exista en git (rutas NFC, como en Linux/Vercel). */

import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

const catalog = JSON.parse(
  readFileSync(new URL("../src/data/catalog.json", import.meta.url), "utf8"),
);
const gitFiles = new Set(
  execSync("git ls-files -z public", { encoding: "utf8" })
    .split("\0")
    .filter(Boolean)
    .map((file) => file.replace(/^public\//, "")),
);

const missing = catalog.filter((product) => {
  if (!product.photo) return true;
  const path = product.photo.replace(/^\//, "").normalize("NFC");
  return !gitFiles.has(path);
});

if (missing.length > 0) {
  console.error(`Imágenes faltantes en git: ${missing.length}`);
  for (const product of missing) {
    console.error(`- ${product.id}: ${product.photo}`);
  }
  process.exit(1);
}

console.log(`OK: ${catalog.length} productos con imagen en git.`);
