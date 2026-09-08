# lexipower-support

Public support / help page for the LexiPower iOS and web app.

Served via GitHub Pages at <https://anunnakicosmocrew.github.io/lexipower-support/>.

This URL is registered as the **Support URL** on App Store Connect for the
LexiPower app submission (issue #836 in `WordPower-app`).

## Editing

Three static pages — `index.html`, `privacy.html`, `terms.html` — with no build
step. `privacy.html` and `terms.html` share `_style.css`; `index.html` has its own
inline `<style>`. Edit, commit, push; GitHub Pages redeploys automatically
(~1 minute).

Every page must carry the Luvita attribution line in its footer, per
[ADR 0001](https://github.com/AnunnakiCosmoCrew/luvita-docs/blob/main/adr/0001-public-brand-attribution.md).
`.githooks/pre-push` checks this — enable it once per clone with:

```bash
git config core.hooksPath .githooks
```

See CLAUDE.md for the exact wording and the rules behind it.
