# Map: Execile landing page

Label: wayfinder:map
Tracker: local markdown (`.scratch/landing-page/`). Tickets live in `issues/NN-<slug>.md`.

## Destination

A build-ready spec plus implementation tickets for the Execile landing page: the design canvas ported to TanStack Start + StyleX + Vite+, statically prerendered, hosted on Cloudflare, with the Assessment Form delivered to the Google Workspace inbox through a Turnstile-protected Worker, and PostHog analytics. Done when nothing is left to decide before building. When the frontier empties, run `/to-spec` then `/to-tickets` against Decisions so far.

## Notes

**Domain.** Marketing site for a medical billing / RCM service. Glossary in `CONTEXT.md`. Source of truth for structure and copy: `Landing page ready for review/RCM Landing.dc.html`. Sections: Hero, Problem, Services, How It Works, Specialties, Systems, Why Us, Fit, Results, FAQ, Assessment, Footer.

**Audience.** The developer plus agents. Tickets may prescribe and assume the rules below are known.

**Skills each session should consult.** `frontend`, `codebase-design` (base components are deep modules), `domain-modeling`, `grilling`; `research` for research tickets, `prototype` when behaviour is the question. Research findings live in `docs/research/<slug>.md`.

**Stack.** TanStack Start · TypeScript · SSG / static prerendering · Vite+ · StyleX · Cloudflare · Satoshi (Fontshare) · `messages.json` · Google Workspace (destination inbox for form submissions) · PostHog · Husky · Vite+ built-in lint/format.

**Rules.**
1. No third-party animation libraries.
2. Prefer CSS transitions/animations.
3. Use Web APIs where appropriate.
4. Respect `prefers-reduced-motion`.
5. Animations must never block interaction.
6. Animations must not cause layout shift.
7. All user-facing text comes from `messages.json`.
8. No raw base HTML elements in feature/page code.
9. Base elements must be created as reusable base components, rendering semantic tags from day 1.
10. Use the design system instead of arbitrary styling values.
11. All public pages must be statically generated.
12. No automated tests for v1.
13. No internationalization. `messages.json` is a single English file.

**Standing constraints.**
- No accounts exist yet (Cloudflare, domain, Google Workspace, PostHog). Nothing on this map may block on them; the spec must let the build run locally with a config/env layer that accepts credentials later.
- Placeholders stay in the copy. The client updates the body at the end.
- Spam protection on the form is Cloudflare Turnstile.
- SEO is in scope but minimal: meta, one static OG image, sitemap, robots.
- The StyleX research must also judge whether LightningCSS earns a place.

## Decisions so far

<!-- one line per closed ticket: gist, then the link for detail -->
- [Can Satoshi be self-hosted, and how is it loaded without layout shift?](issues/06-satoshi-font.md) — Yes, the ITF licence recommends self-hosting but forbids subsetting; ship the unmodified variable WOFF2 with `font-display: swap`, a preload, and a metric-matched Arial fallback computed from the font file at build; `@font-face` lives in the plain CSS entry, not StyleX.
- [How should PostHog run on a static marketing site without a consent banner?](issues/05-posthog-static.md) — PostHog Cloud US in cookieless `always` mode with person profiles off, replay off, autocapture limited to link and button clicks, `ph-no-capture` on the form; npm package initialised client-only with an env token that no-ops when empty; no proxy and no BAA for v1.
- [How does a Cloudflare Worker deliver a form submission to a Google Workspace inbox?](issues/04-worker-to-workspace-email.md) — Cloudflare Email Service `send_email` binding to the Workspace mailbox as a verified destination (free on every plan), sending from an Email Routing subdomain so Google's apex MX stays; `wrangler dev` simulates the binding locally; Resend is the runner-up.
- [What does Vite+ provide, and how does a TanStack Start project live inside it?](issues/01-vite-plus.md) — `vp` v0.3.0 beta bundles Vite 8, Oxlint, Oxfmt, tsgolint and pnpm; scaffold with `vp create @tanstack/start` then `vp migrate`; rules 7 and 8 map to `react/jsx-no-literals` and `react/forbid-elements`; Husky conflicts with Vite+'s hook dispatcher, decision parked in the scaffold ticket.
- [How does a statically prerendered TanStack Start site deploy to Cloudflare with one server endpoint?](issues/03-cloudflare-ssg.md) — One Worker with Static Assets via `@cloudflare/vite-plugin`; prerendered pages served as assets, the form POST as a TanStack server route in the same app; `vite dev` and Turnstile dummy keys run everything before any account exists.

## Not yet specified

- **Domain and email-domain setup.** DNS on Cloudflare; an Email Routing subdomain (e.g. `forms.<brand>`) for the form sender, with Cloudflare writing its MX/SPF/DKIM; the apex MX stays on Google. Whether the free send lane accepts a routing subdomain is unconfirmed until the account exists. Graduates into the deploy and provisioning ticket.
- **Structured data.** schema.org markup for a medical billing business. In scope, deferred until the SEO decision lands.
- **Accessibility beyond semantics.** Skip link, focus styles, colour contrast of the teal on white, table responsiveness on narrow screens. Likely graduates from the base-component and interaction tickets.
- **Performance budget.** What the static page may weigh (font, PostHog snippet, Turnstile script) and whether anything loads lazily. Depends on font, analytics and form decisions.

## Out of scope

- **Legal pages** (HIPAA Notice, Privacy, Terms). Footer links stay dead in v1; decided at the end.
- **Real copy and placeholder values.** The client fills them after the build.
- **The build itself.** This map ends at a spec and tickets.
- **Automated tests** (rule 12) and **internationalization** (rule 13).
