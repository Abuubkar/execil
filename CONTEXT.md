# Execile — Domain Glossary

Vocabulary for the Execile landing-page effort. Glossary only; decisions live in `docs/adr/` and `.scratch/`.

## Business terms

- **Execile** — the brand. A medical billing and revenue cycle management service for independent US practices. The `name` prop in the design canvas.
- **RCM (Revenue Cycle Management)** — the full billing lifecycle a practice runs to get paid: eligibility, credentialing, coding, claim submission, payment posting, AR follow-up, denials, patient statements, reporting.
- **Practice** — the customer. An independent medical practice with 1–20 providers.
- **Provider** — a clinician in a Practice who bills payers. Providers must be credentialed and enrolled before payers will pay for them.
- **Payer** — an insurer or program that pays claims.
- **Specialty** — a medical field (Primary Care, Behavioral Health, …). Execile assigns coders by Specialty.
- **Assessment** — the free billing assessment. The single conversion goal of the landing page; requested through the Assessment Form.
- **BAA (Business Associate Agreement)** — the HIPAA contract signed before any Practice data moves.
- **Fit** — the section stating who Execile is and is not built for.

## Landing-page terms

- **Design canvas** — the Claude Design export in `docs/design/`. Source of truth for page structure and copy.
- **Section** — one labelled block of the landing page: Hero, Problem, Services, How It Works, Specialties, Systems, Why Us, Fit, Results, FAQ, Assessment (CTA + form), Footer.
- **Placeholder** — bracketed copy in the canvas awaiting real values from the client, e.g. `[X%]`, `[SPECIALTY 1]`, `[Street address]`.
- **Results mode** — whether the Results section shows placeholder case studies or a "coming soon" notice. Launches in placeholder mode; the client swaps copy at the end.
- **Assessment Form** — the form in the Assessment section. Collects contact and practice details only; must never collect PHI.
- **Messages** — the single English-only `messages.json` that holds every user-facing string. No locale layer.
- **Base component** — a reusable wrapper around a raw HTML element. Feature and page code composes base components and never uses raw elements.
- **Design system** — the StyleX token set (colour, type, spacing, radius, shadow, motion) every component styles from. No arbitrary values.
- **Ramp** — a raw value scale inside a token group, named by hue and step (`ink500`, `teal700`). Ramps are the palette layer; feature code never names one.
- **Role** — a token named for its job rather than its value (`textProse`, `surfaceBrand`, `borderDashed`). Roles derive from Ramp keys in the same group, and are the only tokens components import.
- **Dark theme** — the StyleX `createTheme` applied to the footer and the Systems card, overriding Role values for those subtrees. Not a user-facing colour-scheme preference; the site is light.
- **Inverse surface** — a Section that renders on the dark ground and therefore carries the Dark theme.
- **Legal links** — the footer's HIPAA Statement, Privacy Policy and Terms of Service links. Each is a prerendered page of its own (`/hipaa`, `/privacy`, `/terms`) whose text lives in `src/legal.json`, kept apart from `messages.json` so it is bundled only with those routes.
- **Inbox** — the Google Workspace mailbox that receives every Assessment Form submission. Google Workspace is a destination, not a sending platform.
- **Turnstile** — Cloudflare's bot check on the Assessment Form.
- **Brand font** — Satoshi, from Fontshare. Replaces the earlier FT Kunst Grotesk decision.
