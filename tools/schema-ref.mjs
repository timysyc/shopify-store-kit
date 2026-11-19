#!/usr/bin/env node
// Regenerates the "SECTION REFERENCE" appendix inside STORE-BUILDER-PROMPT.md from the real schemas,
// so the prompt never drifts from the code. Run after editing any section:  node tools/schema-ref.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..');
const dir = path.join(root, 'theme', 'sections');
const order = ['ck-brand', 'ck-announcement', 'ck-hero', 'ck-ticker', 'ck-product', 'ck-sticky-atc', 'ck-benefits', 'ck-image-text', 'ck-before-after', 'ck-hotspots', 'ck-stats', 'ck-timeline', 'ck-comparison', 'ck-reviews', 'ck-reels', 'ck-guarantee', 'ck-faq', 'ck-popup'];

function fmt(s) {
  let t = s.type;
  if (s.type === 'range') t = `range ${s.min}–${s.max} step ${s.step}`;
  if (s.type === 'select') t = `select [${s.options.map((o) => o.value).join(' | ')}]`;
  const d = s.default === undefined ? '' : ` = ${JSON.stringify(s.default)}`;
  return `\`${s.id}\` (${t})${d}`;
}
function list(defs) {
  return (defs || []).filter((d) => d.id).map(fmt).join('; ');
}

let out = '';
for (const name of order) {
  const src = fs.readFileSync(path.join(dir, name + '.liquid'), 'utf8');
  const sc = JSON.parse(src.match(/{%-?\s*schema\s*-?%}([\s\S]*?){%-?\s*endschema\s*-?%}/)[1]);
  out += `\n#### \`${name}\` — ${sc.name}\n`;
  out += `- settings: ${list(sc.settings) || '(none)'}\n`;
  for (const b of sc.blocks || []) {
    if (b.type === '@app') { out += `- block \`@app\`: review-app / app blocks (no settings, added in the editor)\n`; continue; }
    out += `- block \`${b.type}\`${b.limit ? ` (max ${b.limit})` : ''}: ${list(b.settings) || '(no settings)'}\n`;
  }
}

const promptPath = path.join(root, 'STORE-BUILDER-PROMPT.md');
const prompt = fs.readFileSync(promptPath, 'utf8');
const next = prompt.replace(/<!-- SCHEMA:START -->[\s\S]*<!-- SCHEMA:END -->/, `<!-- SCHEMA:START -->\n${out}\n<!-- SCHEMA:END -->`);
fs.writeFileSync(promptPath, next);
console.log(`Section reference written (${order.length} sections).`);
