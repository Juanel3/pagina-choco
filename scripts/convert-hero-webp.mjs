import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const HERO_DIR = path.join(process.cwd(), "public/imagenehero");
const QUALITY = 88;

const OVERRIDES = {
  3: "i3.png",
  21: "i21.png",
};

async function convertPngToWebp(pngName) {
  const input = path.join(HERO_DIR, pngName);
  const output = path.join(HERO_DIR, pngName.replace(/\.png$/i, ".webp"));

  await sharp(input)
    .webp({ quality: QUALITY, alphaQuality: 100, effort: 4 })
    .toFile(output);

  const [inputStat, outputStat] = await Promise.all([
    fs.stat(input),
    fs.stat(output),
  ]);

  return {
    file: pngName.replace(/\.png$/i, ".webp"),
    inputKb: Math.round(inputStat.size / 1024),
    outputKb: Math.round(outputStat.size / 1024),
  };
}

async function main() {
  const pngFiles = new Set(
    Array.from({ length: 28 }, (_, i) => `${i + 1}.png`),
  );

  for (const png of Object.values(OVERRIDES)) {
    pngFiles.add(png);
  }

  const results = [];
  for (const png of pngFiles) {
    results.push(await convertPngToWebp(png));
  }

  results.sort((a, b) => a.file.localeCompare(b.file, undefined, { numeric: true }));

  const totalIn = results.reduce((sum, item) => sum + item.inputKb, 0);
  const totalOut = results.reduce((sum, item) => sum + item.outputKb, 0);

  console.log(`Convertidos ${results.length} frames a WebP`);
  console.log(`Tamaño: ${totalIn} KB PNG → ${totalOut} KB WebP`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
