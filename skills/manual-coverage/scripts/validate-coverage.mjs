#!/usr/bin/env node
// Validate a coverage.*.yml mapping file (manual or e2e — same grammar).
//
// Usage:   node validate-coverage.mjs <coverage.yml>
//
// Checks:
//   - structural sanity (well-formed key / item lines, no duplicate keys)
//   - every file key exists on disk; for glob keys, the literal directory
//     prefix exists
//   - no key with an empty identifier list
// Prints all referenced @S/@T IDs and tags so you can cross-check them
// against the IDs you extracted earlier. Exits non-zero if any issue found.
//
// Use this instead of writing a YAML parser by hand. (Never use python.)

import { readFileSync, existsSync } from 'node:fs';

const path = process.argv[2];
if (!path) {
  console.error('Usage: node validate-coverage.mjs <coverage.yml>');
  process.exit(64);
}

let text;
try {
  text = readFileSync(path, 'utf8');
} catch (e) {
  console.error(`Cannot read ${path}: ${e.message}`);
  process.exit(1);
}

const lines = text.split('\n');
const order = [];
const map = new Map(); // key -> string[]
const problems = [];
let key = null;

for (let i = 0; i < lines.length; i++) {
  const raw = lines[i];
  const ln = i + 1;
  if (!raw.trim() || raw.trimStart().startsWith('#')) continue;

  if (/^[^\s#]/.test(raw)) {
    // key line:  <path-or-glob>:  [optional inline comment]
    const m = raw.match(/^(.+?):\s*(#.*)?$/);
    if (!m) {
      problems.push(`line ${ln}: malformed key line: ${JSON.stringify(raw)}`);
      key = null;
      continue;
    }
    key = m[1].trim();
    if (map.has(key)) problems.push(`line ${ln}: duplicate key: ${key}`);
    else { map.set(key, []); order.push(key); }
  } else {
    // item line:  - "@Sxxxxxxxx"  [optional inline comment]
    const m = raw.match(/^\s+-\s+"?(@[A-Za-z0-9_-]+)"?\s*(#.*)?$/);
    if (!m) {
      problems.push(`line ${ln}: malformed item: ${JSON.stringify(raw)}`);
      continue;
    }
    if (!key) {
      problems.push(`line ${ln}: item before any key: ${JSON.stringify(raw)}`);
      continue;
    }
    map.get(key).push(m[1]);
  }
}

const ids = new Set();
for (const k of order) {
  const items = map.get(k);
  items.forEach((x) => ids.add(x));
  if (!items.length) {
    problems.push(`key has no identifiers: ${k}`);
    continue;
  }
  if (/[*?[\]]/.test(k)) {
    // glob: strip from the first path segment that contains a wildcard
    const base = k.split('/').reduce((acc, seg) => {
      if (acc.stop || /[*?[\]]/.test(seg)) { acc.stop = true; return acc; }
      acc.parts.push(seg);
      return acc;
    }, { parts: [], stop: false }).parts.join('/');
    if (base && !existsSync(base)) {
      problems.push(`glob base dir missing: ${k}  (looked for "${base}/")`);
    }
  } else if (!existsSync(k)) {
    problems.push(`file key does not exist: ${k}`);
  }
}

const isUid = (x) => /^@[ST][0-9a-f]{8}$/i.test(x);
const uids = [...ids].filter(isUid).sort();
const tags = [...ids].filter((x) => !isUid(x)).sort();

console.log(`${order.length} keys · ${ids.size} unique identifiers`);
if (uids.length) console.log(`  suite/test IDs: ${uids.join(', ')}`);
if (tags.length) console.log(`  tags:           ${tags.join(', ')}`);

if (problems.length) {
  console.log(`\n${problems.length} issue(s):`);
  for (const p of problems) console.log(`  - ${p}`);
  process.exit(1);
}
console.log('\n✓ coverage file looks good (cross-check the IDs above against the test set)');
