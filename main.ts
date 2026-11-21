/* Entrypoint of "The Lighthouse Keeper's Desk" (program/v1).
 *
 * Copies game/ and screenshots/ from this repository into the output
 * directory and writes /output/dossier.json with buildDossier from the
 * kit's library (vendor/makefun-game.ts, unchanged). Outside the grader,
 * MAKEFUN_OUTPUT_DIR stands in for /output. Runs on Node 22+ with the
 * standard library only, and writes the same bytes on every run.
 */
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildDossier } from './vendor/makefun-game.ts';

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const here = new URL('.', import.meta.url).pathname;

// Empty the output directory's CONTENTS instead of removing the directory
// itself: in the grader the output directory is /output and its parent /
// is read-only, so rmSync(outDir) fails with EACCES and the run exits 1.
// Creating the directory if missing, then clearing each entry, works
// whether the parent is writable or not.
mkdirSync(outDir, { recursive: true });
for (const entry of readdirSync(outDir)) {
  rmSync(join(outDir, entry), { recursive: true, force: true });
}

for (const name of ['game', 'screenshots']) {
  const src = join(here, name);
  if (!existsSync(src)) throw new Error(`missing ${name}/ in the repository`);
  cpSync(src, join(outDir, name), { recursive: true });
}

const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
});
writeFileSync(join(outDir, 'dossier.json'), dossier);
console.log(`wrote ${outDir}/dossier.json (${dossier.length} bytes)`);
