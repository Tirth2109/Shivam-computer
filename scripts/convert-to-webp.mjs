import sharp from "sharp";
import { readdirSync, existsSync } from "fs";
import { join, extname } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");

const RASTER_EXT = [".png", ".jpg", ".jpeg", ".gif"];

function* walk(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) {
      yield* walk(full);
    } else if (RASTER_EXT.includes(extname(e.name).toLowerCase())) {
      yield full;
    }
  }
}

for (const file of walk(publicDir)) {
  const out = file.replace(extname(file), ".webp");
  try {
    await sharp(file).webp({ quality: 85 }).toFile(out);
    console.log(`Converted: ${file} -> ${out}`);
  } catch (err) {
    console.error(`Failed ${file}:`, err.message);
  }
}
