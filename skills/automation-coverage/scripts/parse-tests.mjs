#!/usr/bin/env node
// Extract Testomat.io identifiers from automated test files.
//
// Usage:   node parse-tests.mjs <tests-dir> [glob-suffix...]
//   e.g.   node parse-tests.mjs tests/e2e
//          node parse-tests.mjs . .spec.ts .cy.js _test.js
//
// Walks the directory, and for every test file lists the @S/@T IDs and
// @tag markers found in describe / it / test / Scenario / Feature names.
// Use this instead of writing your own parser. (Never use python.)

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.argv[2] || '.';
const suffixes = process.argv.slice(3);
const DEFAULT_SUFFIXES = ['.spec.ts', '.spec.js', '.cy.ts', '.cy.js', '.test.ts', '.test.js', '.e2e.ts', '.e2e.js', '_test.ts', '_test.js'];
const accept = suffixes.length ? suffixes : DEFAULT_SUFFIXES;

const SKIP_DIRS = new Set(['node_modules', 'dist', 'build', 'out', '.git', '.cache', 'coverage', 'vendor']);
const ID_RE = /@[ST][0-9a-f]{8}/g;          // suite / test UIDs
const TAG_RE = /@[A-Za-z0-9_-]+/g;          // any @tag (includes the UIDs above)
const NAME_RE = /\b(?:describe|context|it|test|Scenario|Feature)\s*(?:\.\w+)?\s*\(\s*[`'"]([^`'"]+)[`'"]/g;

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
    if (e.isDirectory()) {
      if (SKIP_DIRS.has(e.name)) continue;
      out.push(...walk(join(dir, e.name)));
    } else if (accept.some((s) => e.name.endsWith(s))) {
      out.push(join(dir, e.name));
    }
  }
  return out;
}

const files = walk(root).sort();
if (!files.length) {
  console.error(`No test files (${accept.join(', ')}) found under ${root}`);
  process.exit(2);
}

let nFiles = 0;
let nWithIds = 0;
const allIds = new Set();
const allTags = new Set();

for (const file of files) {
  const src = readFileSync(file, 'utf8');
  const ids = new Set();
  const tags = new Set();
  for (const m of src.matchAll(NAME_RE)) {
    const name = m[1];
    (name.match(ID_RE) || []).forEach((x) => ids.add(x));
    (name.match(TAG_RE) || []).forEach((x) => { if (!ID_RE.test(x)) tags.add(x); });
  }
  // also catch IDs/tags placed outside the captured name (rare)
  (src.match(ID_RE) || []).forEach((x) => ids.add(x));
  if (!ids.size && !tags.size) continue;
  nFiles++;
  if (ids.size) nWithIds++;
  ids.forEach((x) => allIds.add(x));
  tags.forEach((x) => allTags.add(x));
  console.log(`\n${file}`);
  if (ids.size) console.log(`  IDs:  ${[...ids].sort().join(', ')}`);
  if (tags.size) console.log(`  tags: ${[...tags].sort().join(', ')}`);
}

console.log(`\n${files.length} test files scanned · ${nFiles} contain markers · ${nWithIds} have @S/@T IDs`);
console.log(`unique IDs: ${allIds.size}${allTags.size ? ` · unique tags: ${allTags.size}` : ''}`);
if (!nWithIds) {
  console.log('\nNo Testomat.io IDs found. Populate them first:  npx check-tests@latest <Framework> "<glob>" --update-ids');
}
