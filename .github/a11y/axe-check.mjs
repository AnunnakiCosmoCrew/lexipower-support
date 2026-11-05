// Accessibility check (ADR 0011 §5.1/§5.3): axe-core on every HTML page in the repo root.
// Fails on any WCAG 2.0/2.1/2.2 A/AA violation and on axe's best-practice rules (a missing
// <main> is a best-practice rule, not a WCAG tag, so the tag list adds it explicitly).
// Documented exceptions go in .github/a11y/allowlist.json as {page, rule, reason}. An entry
// without a reason fails the job, and so does an entry that no longer matches anything, so
// the list cannot rot. How to run it locally: CLAUDE.md -> Accessibility.
import { readdirSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const puppeteer = require('puppeteer'); // require, not import(): only require honours NODE_PATH

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../..');
const allow = JSON.parse(readFileSync(resolve(here, 'allowlist.json'), 'utf8'));
const used = new Set();
if (allow.some((e) => !e.page || !e.rule || !String(e.reason || '').trim())) {
  console.error('allowlist.json: every entry needs page, rule and a non-empty reason');
  process.exit(1);
}

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];
const pages = readdirSync(root).filter((f) => f.endsWith('.html')).sort();
const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
let failures = 0;
for (const page of pages) {
  const tab = await browser.newPage();
  await tab.goto(pathToFileURL(resolve(root, page)).href);
  await tab.evaluate(axeSource);
  const result = await tab.evaluate(
    (tags) => globalThis.axe.run(document, { runOnly: { type: 'tag', values: tags } }),
    TAGS,
  );
  for (const v of result.violations) {
    const idx = allow.findIndex((e) => e.page === page && e.rule === v.id);
    if (idx >= 0) { used.add(idx); continue; }
    failures += 1;
    console.error(`${page}: ${v.id} (${v.impact}) ${v.help}\n  ${v.helpUrl}`);
    for (const n of v.nodes) console.error(`  - ${n.target.join(' ')}`);
  }
  console.log(`${page}: ${result.violations.length} violation(s), ${result.passes.length} rules passed`);
  await tab.close();
}
await browser.close();
allow.forEach((e, i) => {
  if (!used.has(i)) { failures += 1; console.error(`allowlist.json: stale entry ${e.page} / ${e.rule}`); }
});
process.exit(failures ? 1 : 0);
