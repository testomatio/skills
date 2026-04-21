#!/usr/bin/env tsx
/**
 * gen-traceability.ts
 *
 * Parses `<!-- test ... -->` frontmatter across manual-tests-execution test-case files,
 * parses UC source references from `docs/product/manual-tests-execution/06-use-cases/UC-*.md`,
 * emits `_generated/traceability-matrix.md`, and rewrites each UC's
 * `## Verifying tests` block between `<!-- trace-uc ... -->` and `<!-- end-trace -->`.
 *
 * Run from repo root:
 *   npx tsx docs/product/manual-tests-execution/scripts/gen-traceability.ts
 *
 * Inputs
 *   - test-cases/manual-tests-execution/{sub}/*.md  (test-case files only; leading-underscore, -ac-delta,
 *     -scope, -review, -validation-log, -ui-delta suffixes are ignored)
 *   - docs/product/manual-tests-execution/06-use-cases/UC-*.md
 *
 * Outputs
 *   - docs/product/manual-tests-execution/_generated/traceability-matrix.md
 *   - In-place edits to each UC-NN-*.md between the two trace markers
 */

import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative, resolve, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(HERE, "../../../../");
const TEST_CASES_ROOT = join(REPO_ROOT, "test-cases/manual-tests-execution");
const UC_ROOT = join(REPO_ROOT, "docs/product/manual-tests-execution/06-use-cases");
const OUT_FILE = join(
  REPO_ROOT,
  "docs/product/manual-tests-execution/_generated/traceability-matrix.md",
);

type TestRecord = {
  subFeature: string;
  file: string; // repo-relative
  title: string;
  tags: string[]; // @smoke, @negative, etc.
  priority: string;
  type: string;
  automation: string;
  automationNote?: string;
  sources: string[]; // normalized: AC-N or {sub}/ac-delta-M
};

type UcRecord = {
  id: string; // UC-01
  file: string; // repo-relative
  absFile: string;
  title: string;
  primaryActor: string;
  subFeature: string;
  sources: string[]; // normalized
};

// ─── File walking ────────────────────────────────────────────────────────────

const SKIP_FILE_RE = /(?:^_|-(ac-delta|scope|review|validation-log|ui-delta)\.md$)/;

function walkTestCases(): string[] {
  const out: string[] = [];
  const subs = readdirSync(TEST_CASES_ROOT)
    .filter((name) => !name.startsWith("_") && !name.endsWith(".md"))
    .filter((name) => {
      try {
        return statSync(join(TEST_CASES_ROOT, name)).isDirectory();
      } catch {
        return false;
      }
    });
  for (const sub of subs) {
    const dir = join(TEST_CASES_ROOT, sub);
    for (const entry of readdirSync(dir)) {
      if (!entry.endsWith(".md")) continue;
      if (SKIP_FILE_RE.test(entry)) continue;
      out.push(join(dir, entry));
    }
  }
  return out;
}

// ─── Test-case parsing ───────────────────────────────────────────────────────

const TEST_BLOCK_RE = /<!--\s*test\s*\n([\s\S]*?)\n-->/g;

function parseFrontmatter(body: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const rawLine of body.split("\n")) {
    const line = rawLine.trim();
    if (!line) continue;
    const colon = line.indexOf(":");
    if (colon < 0) continue;
    const key = line.slice(0, colon).trim();
    let value = line.slice(colon + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    out[key] = value;
  }
  return out;
}

function normaliseSources(raw: string | undefined, sub: string): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      if (/^AC-\d+$/i.test(s)) return s.toUpperCase();
      if (/^ac-delta-\d+$/i.test(s)) return `${sub}/${s.toLowerCase()}`;
      return s; // unknown shape — keep as-is for visibility
    });
}

function extractTitleAndTags(afterBlock: string): { title: string; tags: string[] } {
  const lines = afterBlock.split("\n");
  for (const line of lines) {
    const m = line.match(/^##\s+(.+?)\s*$/);
    if (m) {
      const rest = m[1];
      const tagMatches = [...rest.matchAll(/@[\w-]+/g)].map((x) => x[0]);
      const title = rest.replace(/@[\w-]+/g, "").trim();
      return { title, tags: tagMatches };
    }
    if (/^<!--/.test(line.trim())) continue;
    if (line.trim()) return { title: line.trim(), tags: [] };
  }
  return { title: "(untitled)", tags: [] };
}

function parseTestFile(abs: string): TestRecord[] {
  const subFeature = basename(dirname(abs));
  const raw = readFileSync(abs, "utf8");
  const rel = relative(REPO_ROOT, abs);
  const out: TestRecord[] = [];

  for (const m of raw.matchAll(TEST_BLOCK_RE)) {
    const body = m[1];
    const fm = parseFrontmatter(body);
    const endIdx = (m.index ?? 0) + m[0].length;
    const afterBlock = raw.slice(endIdx, endIdx + 2000);
    const { title, tags } = extractTitleAndTags(afterBlock);
    out.push({
      subFeature,
      file: rel,
      title,
      tags,
      priority: fm["priority"] ?? "",
      type: fm["type"] ?? "",
      automation: fm["automation"] ?? "",
      automationNote: fm["automation-note"],
      sources: normaliseSources(fm["source"], subFeature),
    });
  }
  return out;
}

// ─── UC parsing ──────────────────────────────────────────────────────────────

function parseUcFile(abs: string): UcRecord | null {
  const raw = readFileSync(abs, "utf8");
  const idMatch = raw.match(/<!--\s*trace-uc:\s*(UC-\d+)\s*-->/);
  const srcMatch = raw.match(/<!--\s*sources:\s*([^\n]*?)\s*-->/);
  const subMatch = raw.match(/<!--\s*sub-feature:\s*([a-z0-9-]+)\s*-->/);
  const actorMatch = raw.match(/^\*\*Primary actor:\*\*\s*(.+)$/m);
  const h1Match = raw.match(/^#\s+(.+)$/m);
  if (!idMatch || !srcMatch) return null;
  const id = idMatch[1];
  const subFeature = subMatch?.[1] ?? "";
  const sources = normaliseSources(srcMatch[1], subFeature);
  return {
    id,
    file: relative(REPO_ROOT, abs),
    absFile: abs,
    title: (h1Match?.[1] ?? id).trim(),
    primaryActor: (actorMatch?.[1] ?? "").trim(),
    subFeature,
    sources,
  };
}

function readAllUcs(): UcRecord[] {
  const out: UcRecord[] = [];
  for (const entry of readdirSync(UC_ROOT)) {
    if (!entry.startsWith("UC-") || !entry.endsWith(".md")) continue;
    const rec = parseUcFile(join(UC_ROOT, entry));
    if (rec) out.push(rec);
  }
  return out.sort((a, b) => a.id.localeCompare(b.id));
}

// ─── Index building ──────────────────────────────────────────────────────────

type SourceIndex = Map<string, TestRecord[]>;

function buildSourceIndex(tests: TestRecord[]): SourceIndex {
  const idx: SourceIndex = new Map();
  for (const t of tests) {
    for (const src of t.sources) {
      const list = idx.get(src) ?? [];
      list.push(t);
      idx.set(src, list);
    }
  }
  return idx;
}

// ─── UC "Verifying tests" block rewrite ──────────────────────────────────────

function rewriteUcVerifyingTestsBlock(uc: UcRecord, idx: SourceIndex): number {
  const raw = readFileSync(uc.absFile, "utf8");
  const matched = new Map<string, TestRecord>();
  for (const src of uc.sources) {
    const list = idx.get(src) ?? [];
    for (const t of list) matched.set(`${t.file}#${t.title}`, t);
  }
  const testsSorted = [...matched.values()].sort((a, b) => {
    if (a.subFeature !== b.subFeature) return a.subFeature.localeCompare(b.subFeature);
    if (a.file !== b.file) return a.file.localeCompare(b.file);
    return a.title.localeCompare(b.title);
  });

  const lines: string[] = [];
  lines.push("<!-- auto-generated by traceability script — do not edit by hand -->");
  lines.push(`<!-- trace-uc: ${uc.id} -->`);
  lines.push(`<!-- sources: ${uc.sources.join(", ")} -->`);
  lines.push(`<!-- sub-feature: ${uc.subFeature} -->`);
  if (testsSorted.length === 0) {
    lines.push("");
    lines.push("_No matching tests found for cited sources._");
  } else {
    lines.push("");
    lines.push(`_${testsSorted.length} test(s) match the cited sources._`);
    lines.push("");
    lines.push("| # | Priority | Sub-feature | Test | Sources matched |");
    lines.push("|---|---|---|---|---|");
    let n = 1;
    for (const t of testsSorted) {
      const matchedSrcs = t.sources.filter((s) => uc.sources.includes(s));
      const tagSuffix = t.tags.length ? " " + t.tags.join(" ") : "";
      const link = `[${t.title}${tagSuffix}](../../../../${t.file})`;
      lines.push(
        `| ${n++} | ${t.priority || "—"} | ${t.subFeature} | ${link} | ${matchedSrcs.join(", ")} |`,
      );
    }
  }
  lines.push("<!-- end-trace -->");
  const block = lines.join("\n");

  const BLOCK_RE =
    /<!--\s*auto-generated by traceability script[\s\S]*?<!--\s*end-trace\s*-->/;
  if (!BLOCK_RE.test(raw)) {
    console.warn(
      `[warn] ${uc.id}: no existing trace block found; skipping rewrite (add a placeholder block first)`,
    );
    return 0;
  }
  const next = raw.replace(BLOCK_RE, block);
  if (next !== raw) {
    writeFileSync(uc.absFile, next, "utf8");
  }
  return testsSorted.length;
}

// ─── Matrix output ───────────────────────────────────────────────────────────

function sortSourceKeys(keys: string[]): string[] {
  return keys.sort((a, b) => {
    const acA = a.match(/^AC-(\d+)$/);
    const acB = b.match(/^AC-(\d+)$/);
    if (acA && acB) return Number(acA[1]) - Number(acB[1]);
    if (acA) return -1;
    if (acB) return 1;
    return a.localeCompare(b);
  });
}

function writeMatrix(
  tests: TestRecord[],
  ucs: UcRecord[],
  idx: SourceIndex,
  ucMatchCounts: Map<string, number>,
): void {
  const acKeys = sortSourceKeys([...idx.keys()].filter((k) => /^AC-\d+$/.test(k)));
  const deltaKeys = sortSourceKeys([...idx.keys()].filter((k) => !/^AC-\d+$/.test(k)));

  const lines: string[] = [];
  lines.push("---");
  lines.push("audience: qa-team, dev-team");
  lines.push("feature: manual-tests-execution");
  lines.push(`last-generated: ${new Date().toISOString()}`);
  lines.push('owner: "@gololdf1sh"');
  lines.push("generator: docs/product/manual-tests-execution/scripts/gen-traceability.ts");
  lines.push("---");
  lines.push("");
  lines.push("# Traceability Matrix — Manual Tests Execution");
  lines.push("");
  lines.push(
    "> **Do not edit by hand.** Regenerate via `npx tsx docs/product/manual-tests-execution/scripts/gen-traceability.ts`.",
  );
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push(`- **Tests scanned:** ${tests.length}`);
  lines.push(`- **Unique ACs cited:** ${acKeys.length}`);
  lines.push(`- **Unique ac-delta IDs cited:** ${deltaKeys.length}`);
  lines.push(`- **UCs with sources:** ${ucs.length}`);
  lines.push("");
  lines.push("## UC ↔ Tests");
  lines.push("");
  lines.push("| UC | Title | Primary actor | Sub-feature | Sources | Tests |");
  lines.push("|---|---|---|---|---|---|");
  for (const uc of ucs) {
    const sourcesStr = uc.sources.length > 8 ? `${uc.sources.slice(0, 8).join(", ")}, …` : uc.sources.join(", ");
    const count = ucMatchCounts.get(uc.id) ?? 0;
    lines.push(
      `| [${uc.id}](../06-use-cases/${basename(uc.absFile)}) | ${uc.title.replace(/^UC-\d+:\s*/, "")} | ${uc.primaryActor} | ${uc.subFeature} | ${sourcesStr} | ${count} |`,
    );
  }
  lines.push("");
  lines.push("## AC ↔ Tests");
  lines.push("");
  lines.push("| AC | Tests | Sub-feature(s) |");
  lines.push("|---|---|---|");
  for (const key of acKeys) {
    const list = idx.get(key)!;
    const subs = [...new Set(list.map((t) => t.subFeature))].join(", ");
    const testLinks = list
      .map((t) => `[${t.title}](../../../../${t.file})`)
      .slice(0, 6);
    const moreSuffix = list.length > 6 ? ` _(+ ${list.length - 6} more)_` : "";
    lines.push(`| ${key} | ${testLinks.join(" · ")}${moreSuffix} | ${subs} |`);
  }
  lines.push("");
  lines.push("## ac-delta ↔ Tests");
  lines.push("");
  lines.push("| ac-delta | Tests | Count |");
  lines.push("|---|---|---|");
  for (const key of deltaKeys) {
    const list = idx.get(key)!;
    const testLinks = list
      .map((t) => `[${t.title}](../../../../${t.file})`)
      .slice(0, 4);
    const moreSuffix = list.length > 4 ? ` _(+ ${list.length - 4} more)_` : "";
    lines.push(`| ${key} | ${testLinks.join(" · ")}${moreSuffix} | ${list.length} |`);
  }
  lines.push("");
  lines.push("## Uncovered ACs (AC-1..AC-100)");
  lines.push("");
  const covered = new Set(acKeys);
  const uncovered: string[] = [];
  for (let n = 1; n <= 100; n++) {
    if (!covered.has(`AC-${n}`)) uncovered.push(`AC-${n}`);
  }
  if (uncovered.length === 0) {
    lines.push("_All 100 baseline ACs are cited by at least one test._");
  } else {
    lines.push(`${uncovered.length} baseline AC(s) not cited by any test:`);
    lines.push("");
    lines.push(uncovered.join(", "));
  }
  lines.push("");
  writeFileSync(OUT_FILE, lines.join("\n"), "utf8");
}

// ─── Main ────────────────────────────────────────────────────────────────────

function main(): void {
  const testFiles = walkTestCases();
  const tests = testFiles.flatMap(parseTestFile);
  const idx = buildSourceIndex(tests);
  const ucs = readAllUcs();

  const ucMatchCounts = new Map<string, number>();
  for (const uc of ucs) {
    const matched = rewriteUcVerifyingTestsBlock(uc, idx);
    ucMatchCounts.set(uc.id, matched);
  }
  writeMatrix(tests, ucs, idx, ucMatchCounts);

  console.log(
    `gen-traceability: ${tests.length} tests across ${testFiles.length} files; ${ucs.length} UCs rewritten; matrix → ${relative(REPO_ROOT, OUT_FILE)}`,
  );
}

main();
