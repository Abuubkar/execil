# Execile

Landing page for Execile, a medical billing / RCM service. Glossary in `CONTEXT.md`. Design source of truth: `Landing page ready for review/RCM Landing.dc.html`.

## Conventions (not lint-enforced — check in review)

`react/forbid-elements` and `react/jsx-no-literals` cover rules 8 and 7 in `src/sections/` and `src/routes/`. These four are structurally unenforceable and are checked in review:

1. **Tokens, not values.** `stylex.create` takes token references only. A literal colour, size, radius or duration is a bug. See issue #8.
2. **Roles, not ramps.** Components import role keys (`color.textBody`, `color.surfaceBrand`). Ramp keys (`color.ink800`, `color.teal600`) exist to derive roles inside `tokens.stylex.ts` and are used nowhere else.
3. **`style` positions, never restyles.** A parent may pass `style` to place a child within its own layout (margin, grid placement, width). It must never set the child's interior: colour, font, padding, border. See issue #9.
4. **User-facing attribute strings come from `messages.json`.** `aria-label`, `alt`, `title` and `placeholder` are invisible to `jsx-no-literals`. Prefer a component that requires the string as a prop. See issue #11.

Import direction is one-way: `routes/ → sections/ → base/ → styles/`. Sections compose base components and never each other.

When a lint rule genuinely conflicts with a file's job, disable it for that file with a scoped
`// oxlint-disable-next-line <rule>` (or a file-level disable) and a one-line reason. Prefer the
narrowest scope that works. Do not silence a rule repo-wide to fix one file.

## Agent skills

- **Issue tracker:** GitHub Issues on this repo. Conventions in `docs/agents/issue-tracker.md`.
- **Wayfinder map:** issue #1 (`wayfinder:map`). Tickets are its sub-issues; blocking uses native issue dependencies. Resume with `/wayfinder 1`.
- **Domain docs:** single context. `CONTEXT.md` at the root, ADRs in `docs/adr/`.
- **Research findings:** `docs/research/<slug>.md`, one file per research ticket.
