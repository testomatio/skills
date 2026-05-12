#!/usr/bin/env node
// Sanity-check a coverage.*.yml file (manual or e2e — same format):
//   node check-coverage.mjs <coverage.yml>
//
// Prints any key whose path is missing on disk, any key with no
// identifiers, and the full list of @S/@T/tag IDs it references —
// cross-check those against the test set you already extracted.
// Exits non-zero if a problem is found. (Never use python.)

import { readFileSync, existsSync } from 'node:fs';

const file = process.argv[2];
if (!file) { console.error('usage: node check-coverage.mjs <coverage.yml>'); process.exit(64); }

const ids = new Set();
let key = null, items = 0, problems = 0;
const flush = () => { if (key && !items) { console.log('empty:  ', key); problems++; } };

for (const line of readFileSync(file, 'utf8').split('\n')) {
  if (!line.trim() || line.trimStart().startsWith('#')) continue;
  const k = line.match(/^(\S.*):\s*(#.*)?$/);                 // "<path or glob>:" line
  if (k) {
    flush();
    key = k[1].trim(); items = 0;
    if (key.startsWith('tag:')) continue;                     // tag selector, not a path
    const base = /[*?[\]]/.test(key)                          // glob → check its non-glob prefix
      ? key.replace(/[\/\\][^\/\\]*[*?[\]].*$/, '')
      : key;
    if (base && !existsSync(base)) { console.log('missing:', key); problems++; }
  } else {
    const m = line.match(/-\s*"?(@[A-Za-z0-9_-]+)"?/);        // "- @id" line
    if (m) { ids.add(m[1]); items++; }
  }
}
flush();

console.log('\nidentifiers:', [...ids].sort().join(', ') || '(none)');
console.log(problems ? `\n${problems} problem(s) above — fix them` : '\nall keys resolve, no empty entries');
process.exit(problems ? 1 : 0);
