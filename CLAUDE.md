# lexipower-support

Public support, privacy and terms pages for **LexiPower**, a CosmoCrew app.
Three static HTML files, no build step. `privacy.html` and `terms.html` share
`_style.css`; `index.html` carries its own inline `<style>` block.

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
