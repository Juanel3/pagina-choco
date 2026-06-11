import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const HERO_DIR = path.join(process.cwd(), "public/hero");
const BLACK_THRESHOLD = 58;

function isBackgroundPixel(r, g, b, a) {
  return a > 12 && r <= BLACK_THRESHOLD && g <= BLACK_THRESHOLD && b <= BLACK_THRESHOLD;
}

function removeEdgeBackground(data, width, height) {
  const total = width * height;
  const visited = new Uint8Array(total);
  const queue = [];

  const pushIfBg = (x, y) => {
    const idx = y * width + x;
    if (visited[idx]) return;
    const i = idx * 4;
    if (!isBackgroundPixel(data[i], data[i + 1], data[i + 2], data[i + 3])) return;
    visited[idx] = 1;
    queue.push(idx);
  };

  for (let x = 0; x < width; x++) {
    pushIfBg(x, 0);
    pushIfBg(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    pushIfBg(0, y);
    pushIfBg(width - 1, y);
  }

  while (queue.length > 0) {
    const idx = queue.pop();
    const i = idx * 4;
    data[i + 3] = 0;

    const x = idx % width;
    const y = (idx - x) / width;
    if (x > 0) pushIfBg(x - 1, y);
    if (x < width - 1) pushIfBg(x + 1, y);
    if (y > 0) pushIfBg(x, y - 1);
    if (y < height - 1) pushIfBg(x, y + 1);
  }
}

async function processFrame(filePath) {
  const { data, info } = await sharp(filePath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  removeEdgeBackground(data, info.width, info.height);

  await sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4,
    },
  })
    .png()
    .toFile(filePath);
}

const entries = await fs.readdir(HERO_DIR);
const frames = entries.filter((name) => /^frame-\d+\.png$/i.test(name)).sort();

for (const name of frames) {
  const filePath = path.join(HERO_DIR, name);
  await processFrame(filePath);
  console.log("transparent:", name);
}

console.log(`Done: ${frames.length} frames`);
