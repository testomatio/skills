#!/usr/bin/env node
// Sanity-check a coverage.*.yml mapping (manual or e2e — same format).
//
// `js-yaml` does the YAML parsing; this script just checks the result.
// Run it from the project root and pipe the parsed file in:
//
//   npx js-yaml coverage.manual.yml | node check-coverage.mjs
//
// (`npx js-yaml` prints JSON, and fails loudly if the YAML is malformed,
// so a broken file never reaches this script.)
//
// Reports: keys whose path is missing on disk, keys with no identifiers,
// and the list of @S/@T/tag IDs referenced — cross-check those against
// the test set you already extracted. Exits non-zero on any problem.
// (Never use python.)

import { existsSync, readFileSync } from 'node:fs';

const map = JSON.parse(readFileSync(0, 'utf8')); // fd 0 = stdin
if (!map || typeof map !== 'object' || Array.isArray(map)) {
  console.error('expected a JSON object of "path": [ids] — pipe `npx js-yaml <file>` into me');
  process.exit(1);
}

const ids = new Set();
let problems = 0;

for (const [key, value] of Object.entries(map)) {
  const list = Array.isArray(value) ? value : value == null ? [] : [value];
  if (list.length === 0) { console.log('empty:  ', key); problems++; }
  list.forEach((id) => ids.add(String(id)));

  if (key.startsWith('tag:')) continue;                     // tag selector, not a path
  const base = key.replace(/[\/\\][^\/\\]*[*?[\]].*$/, ''); // a glob → its non-glob prefix
  if (base && !existsSync(base)) { console.log('missing:', key); problems++; }
}

console.log('\nidentifiers:', [...ids].sort().join(', ') || '(none)');
console.log(problems ? `\n${problems} problem(s) above — fix them` : '\nall keys resolve, no empty entries');
process.exit(problems ? 1 : 0);
