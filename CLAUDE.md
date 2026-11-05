# lexipower-support

Public support, privacy and terms pages for **LexiPower**, a CosmoCrew app.
Three static HTML files, no build step, all sharing `_style.css`.

Deployed by **GitHub Pages** from `main` at the repo root, served at
<https://cosmocrew.dev/lexipower-support/>. That URL is registered as the
**Support URL** on App Store Connect, so it is a surface reviewers and vendors
actually land on. Note it is *not* `lexipower.app` — that domain serves the
Flutter web app from `WordPower-app` on Firebase Hosting.

## Hard rules

- **Every page carries the Luvita attribution line, verbatim.** In the footer of
  all three pages:

  ```html
  © 2026 CosmoCrew — a brand of <a href="https://luvita.tr/">Luvita Teknoloji Ltd. Şti.</a>
  ```

  The wording is ratified in [ADR 0001: Public brand attribution](https://github.com/AnunnakiCosmoCrew/luvita-docs/blob/main/adr/0001-public-brand-attribution.md).
  Do not re-derive it, reword it, or shorten it. A new page ships with the line,
  not as a later fix.
- **`Luvita Teknoloji Ltd. Şti.` is the link text**, target `https://luvita.tr/`.
  A bare `luvita.tr` link next to the sentence does not satisfy the ADR — that is
  exactly the form a Google for Startups reviewer looked at and reported finding
  no company (case #00302760).
- **Link to luvita.tr directly, never via cosmocrew.dev.** One hop is not enough;
  the observed failure was a reviewer going no further than the page they landed on.
- **Short form of the name only.** Never the full registered trade name — it
  contains "Enerji", and spreading it across software surfaces undoes the
  software-only positioning that `luvita-web/adr/0003` protects.
- **Keep the CosmoCrew brand.** `© CosmoCrew` leads and the clause is appended.
  Do not rebrand these pages to Luvita — the defect ADR 0001 fixes is missing
  attribution, not wrong attribution.
- **The copyright holder is the company, never a person and never a brand.** These
  pages previously read `© 2026 Mert Ertugrul · LexiPower`; do not reintroduce a
  personal name or a bare brand as the holder anywhere, including legal prose.

## Enforcement

`.githooks/pre-push` greps all three pages for the attribution line and fails the
push if any is missing it. Enable it once per clone or worktree:

```bash
git config core.hooksPath .githooks
```

Per ADR 0001 this is deliberately a hook and a rule here, not a CI workflow — a
one-line string per site does not justify a workflow to guard it.

## Accessibility

Per [ADR 0011](https://github.com/AnunnakiCosmoCrew/luvita-docs/blob/main/adr/0011-front-end-platform-and-accessibility-baseline.md) §5.1
this repo follows the first row of the table: **WCAG 2.2 Level AA** for anything
rendered in a browser. Every page keeps `lang` on `<html>`, a skip link to
`<main id="main">`, all content inside landmarks, and the global `:focus-visible`
style in `_style.css`. Colours come from the variables in `_style.css` only; there
is no inline `<style>` any more.

- **Automated check:** `.github/a11y/axe-check.mjs` runs axe-core (WCAG 2.0/2.1/2.2
  A and AA tags plus axe's best-practice rules, which is where a missing `<main>`
  is caught) on every `*.html` in the repo root, in the `build` job of `ci.yml`.
  Any violation fails the job. Exceptions go in `.github/a11y/allowlist.json` as
  `{page, rule, reason}`; an entry with no reason, or one that no longer matches a
  violation, also fails. Review the list in every PR that grows it.
- **Run it locally:**

  ```bash
  cd ~/Projects/lexipower-support
  mkdir -p /tmp/a11y && npm install --prefix /tmp/a11y puppeteer@24 axe-core@4.11.4
  NODE_PATH=/tmp/a11y/node_modules node .github/a11y/axe-check.mjs
  ```

- **Manual pass:** keyboard-only walk of the three pages (Tab shows the skip link
  first; focus is visible everywhere) plus VoiceOver landmarks rotor. Last pass:
  **not yet done** (the founder or a reviewer records the date here after the first
  one). Automation finds roughly half of the issues, so this stays a per-release step.
- **Required check:** `build` must be listed under the `main-protection` ruleset's
  required checks (ADR 0011 §5.3).
