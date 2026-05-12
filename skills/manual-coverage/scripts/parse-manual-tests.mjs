#!/usr/bin/env node
// Extract Testomat.io identifiers from manual test markdown.
//
// Usage:   node parse-manual-tests.mjs [tests-dir]      (default: manual-tests)
//
// For every *.test.md file under the directory, prints the suite ID + title,
// each test ID + title, and the tags used (from `tags:` metadata lines and
// `@tag` markers in titles). Use this instead of writing your own parser.

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.argv[2] || 'manual-tests';
const TAG_RE = /@[A-Za-z0-9_-]+/g;
const ID_RE = /^id:\s*(@[ST][0-9a-f]{8})/i;
const TAGS_META_RE = /^tags:\s*(.+)$/;
const HEADING_RE = /^#+\s+(.*\S)\s*$/;

function walk(dir) {
  const out = [];
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch (e) {
    console.error(`Cannot read ${dir}: ${e.message}`);
    process.exit(1);
  }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (e.name.endsWith('.test.md')) out.push(p);
  }
  return out;
}

function parseFile(file) {
  const lines = readFileSync(file, 'utf8').split('\n');
  const suites = [];
  const tests = [];
  const tags = new Set();

  // state machine: NONE -> IN_META -> AWAIT_TITLE -> NONE
  let mode = 'NONE';
  let kind = null;
  let pendingId = null;
  let pendingTags = [];

  for (const line of lines) {
    const open = line.match(/^<!--\s*(suite|test)\b/);
    if (open) {
      mode = 'IN_META';
      kind = open[1];
      pendingId = null;
      pendingTags = [];
      continue;
    }
    if (mode === 'IN_META') {
      const idm = line.match(ID_RE);
      if (idm) { pendingId = idm[1]; continue; }
      const tm = line.match(TAGS_META_RE);
      if (tm) {
        pendingTags = tm[1].split(',').map(s => s.trim()).filter(Boolean)
          .map(s => (s.startsWith('@') ? s : '@' + s));
        continue;
      }
      if (/^-->/.test(line.trim())) { mode = 'AWAIT_TITLE'; continue; }
      continue;
    }
    if (mode === 'AWAIT_TITLE') {
      const h = line.match(HEADING_RE);
      if (!h) continue;
      const title = h[1];
      const titleTags = title.match(TAG_RE) || [];
      const all = [...new Set([...pendingTags, ...titleTags])];
      all.forEach(t => tags.add(t));
      (kind === 'suite' ? suites : tests).push({ id: pendingId, title });
      mode = 'NONE';
      kind = null;
      pendingId = null;
      pendingTags = [];
    }
  }
  return { file, suites, tests, tags: [...tags] };
}

const files = walk(root).sort();
if (!files.length) {
  console.error(`No *.test.md files found under ${root}`);
  process.exit(2);
}

let nSuites = 0;
let nTests = 0;
let nNoId = 0;

for (const file of files) {
  const r = parseFile(file);
  console.log(`\n${r.file}`);
  for (const s of r.suites) {
    console.log(`  SUITE ${s.id ?? '(no id — not pushed to Testomat.io)'}  ${s.title}`);
    nSuites++;
    if (!s.id) nNoId++;
  }
  for (const t of r.tests) {
    console.log(`  TEST  ${t.id ?? '(no id — not pushed to Testomat.io)'}  ${t.title}`);
    nTests++;
    if (!t.id) nNoId++;
  }
  if (r.tags.length) console.log(`  TAGS  ${r.tags.join(', ')}`);
}

console.log(`\n${files.length} files · ${nSuites} suites · ${nTests} tests` +
  (nNoId ? ` · ${nNoId} without an ID (push via sync-cases before mapping)` : ''));
