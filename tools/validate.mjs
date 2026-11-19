#!/usr/bin/env node
// Validates ck-* section schemas and any JSON templates that use them.
// Usage:  node tools/validate.mjs [template.json ...]
// No dependencies. Exit code 1 if anything is wrong.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const sectionsDir = path.join(here, '..', 'theme', 'sections');
const errors = [];
const warn = [];
const err = (m) => errors.push(m);

// ---------- load schemas ----------
const schemas = {};
for (const f of fs.readdirSync(sectionsDir).filter((f) => f.endsWith('.liquid'))) {
  const src = fs.readFileSync(path.join(sectionsDir, f), 'utf8');
  const m = src.match(/{%-?\s*schema\s*-?%}([\s\S]*?){%-?\s*endschema\s*-?%}/);
  if (!m) { err(`${f}: no {% schema %}`); continue; }
  try { schemas[f.replace('.liquid', '')] = JSON.parse(m[1]); }
  catch (e) { err(`${f}: schema is not valid JSON (${e.message})`); }
}

const isHex = (v) => /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(v);
const onStep = (v, s) => s.step == null || Math.abs(((v - s.min) / s.step) - Math.round((v - s.min) / s.step)) < 1e-6;

function checkSettingDefs(where, defs) {
  const ids = new Set();
  for (const s of defs || []) {
    if (['header', 'paragraph'].includes(s.type)) continue;
    if (!s.id) { err(`${where}: setting without id`); continue; }
    if (ids.has(s.id)) err(`${where}: duplicate setting id "${s.id}"`);
    ids.add(s.id);
    if (s.type === 'range') {
      if ((s.max - s.min) / s.step > 101) err(`${where}.${s.id}: range has more than 101 steps`);
      if (s.default == null) err(`${where}.${s.id}: range needs a default`);
      else if (s.default < s.min || s.default > s.max || !onStep(s.default, s)) err(`${where}.${s.id}: default ${s.default} not on range`);
    }
    if (s.type === 'select' && s.default != null && !s.options.some((o) => o.value === s.default)) err(`${where}.${s.id}: default "${s.default}" not in options`);
    if (s.type === 'richtext' && s.default && !/^\s*<(p|ul|ol|h[1-6])/.test(s.default)) err(`${where}.${s.id}: richtext default must start with <p>`);
    if (s.type === 'inline_richtext' && s.default && /<(p|div|ul|h\d)/.test(s.default)) err(`${where}.${s.id}: inline_richtext cannot contain block tags`);
  }
}

for (const [name, sc] of Object.entries(schemas)) {
  if (!sc.name || sc.name.length > 25) err(`${name}: section name missing or longer than 25 chars`);
  checkSettingDefs(name, sc.settings);
  const types = new Set();
  for (const b of sc.blocks || []) {
    if (b.type === '@app') continue;
    if (types.has(b.type)) err(`${name}: duplicate block type ${b.type}`);
    types.add(b.type);
    if (!b.name || b.name.length > 25) err(`${name}: block ${b.type} name missing or longer than 25 chars`);
    checkSettingDefs(`${name}/${b.type}`, b.settings);
  }
}

// ---------- validate a value against a setting def ----------
function checkValue(where, def, v) {
  switch (def.type) {
    case 'checkbox': if (typeof v !== 'boolean') err(`${where}: must be true/false`); break;
    case 'range':
      if (typeof v !== 'number') { err(`${where}: must be a number`); break; }
      if (v < def.min || v > def.max) err(`${where}: ${v} outside ${def.min}-${def.max}`);
      else if (!onStep(v, def)) err(`${where}: ${v} not a multiple of step ${def.step}`);
      break;
    case 'number': if (typeof v !== 'number') err(`${where}: must be a number`); break;
    case 'select': case 'radio':
      if (!def.options.some((o) => o.value === v)) err(`${where}: "${v}" is not one of ${def.options.map((o) => o.value).join(', ')}`);
      break;
    case 'color': if (typeof v !== 'string' || !isHex(v)) err(`${where}: "${v}" is not a hex colour`); break;
    case 'font_picker': if (typeof v !== 'string' || !/^[a-z0-9_]+_[nio][1-9]$/.test(v)) err(`${where}: "${v}" is not a Shopify font handle like poppins_n7`); break;
    case 'richtext':
      if (typeof v !== 'string') err(`${where}: must be a string`);
      else if (v && !/^\s*<(p|ul|ol|h[1-6])/.test(v)) err(`${where}: richtext must start with <p>, <ul>, <ol> or <h1-6>`);
      break;
    case 'inline_richtext':
      if (typeof v !== 'string') err(`${where}: must be a string`);
      else if (/<(p|div|ul|ol|h\d|br)\b/i.test(v)) err(`${where}: inline_richtext allows only <strong>, <em>, <a>`);
      break;
    case 'image_picker':
      if (typeof v !== 'string' || !v.startsWith('shopify://')) err(`${where}: images must be uploaded in Shopify (shopify://shop_images/...). Leave it out of the JSON instead.`);
      break;
    case 'url':
      if (typeof v !== 'string' || !(/^(\/|#|https?:\/\/|shopify:\/\/|mailto:|tel:)/.test(v))) err(`${where}: "${v}" is not a valid link (start with /, #, https://)`);
      break;
    case 'product': case 'collection': case 'page': case 'blog': case 'article':
      if (typeof v !== 'string' || !/^[a-z0-9-]+$/.test(v)) err(`${where}: must be a ${def.type} handle like "my-product"`);
      break;
    default:
      if (typeof v !== 'string') err(`${where}: must be a string`);
  }
}

function checkSettings(where, defs, values) {
  const map = Object.fromEntries((defs || []).filter((d) => d.id).map((d) => [d.id, d]));
  for (const [k, v] of Object.entries(values || {})) {
    if (!map[k]) { err(`${where}: unknown setting "${k}"`); continue; }
    checkValue(`${where}.${k}`, map[k], v);
  }
}

// ---------- templates ----------
const files = process.argv.slice(2);
for (const file of files) {
  let t;
  try { t = JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch (e) { err(`${file}: not valid JSON (${e.message})`); continue; }
  const tag = path.basename(file);
  if (!t.sections || !t.order) { err(`${tag}: needs "sections" and "order"`); continue; }
  const keys = Object.keys(t.sections);
  if (keys.length > 25) err(`${tag}: more than 25 sections`);
  for (const k of t.order) if (!t.sections[k]) err(`${tag}: order lists "${k}" but it is not in sections`);
  for (const k of keys) if (!t.order.includes(k)) warn.push(`${tag}: section "${k}" is not in order (it will not show)`);
  for (const [sid, s] of Object.entries(t.sections)) {
    const sc = schemas[s.type];
    const where = `${tag} > ${sid} (${s.type})`;
    if (!sc) { if (!s.type?.startsWith('ck-')) warn.push(`${where}: not a ck- section, skipped`); else err(`${where}: unknown section type`); continue; }
    checkSettings(where, sc.settings, s.settings);
    const blocks = s.blocks || {};
    const bkeys = Object.keys(blocks);
    if (bkeys.length > 50) err(`${where}: more than 50 blocks`);
    if (bkeys.length && !Array.isArray(s.block_order)) err(`${where}: has blocks but no block_order`);
    for (const k of s.block_order || []) if (!blocks[k]) err(`${where}: block_order lists "${k}" but it is not in blocks`);
    const counts = {};
    for (const [bid, b] of Object.entries(blocks)) {
      const bdef = (sc.blocks || []).find((x) => x.type === b.type);
      if (!bdef) { err(`${where} > ${bid}: block type "${b.type}" not allowed here`); continue; }
      counts[b.type] = (counts[b.type] || 0) + 1;
      if (bdef.limit && counts[b.type] > bdef.limit) err(`${where}: more than ${bdef.limit} "${b.type}" block(s)`);
      checkSettings(`${where} > ${bid}`, bdef.settings, b.settings);
    }
  }
}

console.log(`Checked ${Object.keys(schemas).length} section schemas and ${files.length} template(s).`);
warn.forEach((w) => console.log('WARN  ' + w));
if (errors.length) { errors.forEach((e) => console.log('ERROR ' + e)); console.log(`\n${errors.length} error(s).`); process.exit(1); }
console.log('All good.');
