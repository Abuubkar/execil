# 05 — How should PostHog run on a static marketing site without a consent banner?

Type: research
Status: resolved

## Question

PostHog is the analytics choice. The site is US-only, static, and adjacent to HIPAA. Establish from primary sources (PostHog docs):

- Cookieless or consent-free configuration: `persistence: 'memory'`, cookieless mode, `disable_session_recording`, `autocapture` defaults, and which of these avoid needing a consent banner.
- The install shapes: snippet versus `posthog-js` npm package, and how to initialise it safely inside a statically prerendered TanStack Start app without running on the server.
- Reverse proxy through Cloudflare to avoid ad blockers, and whether that is worth it for v1.
- Respecting Do Not Track and `prefers-reduced-motion` irrelevance; what PII PostHog captures by default and how to keep form field contents out of it.
- US versus EU cloud, free tier limits, and how to run with a placeholder key until the project exists.

Record findings in `docs/research/posthog-static.md`, each claim cited.

## Answer

Full findings: [docs/research/posthog-static.md](../../../docs/research/posthog-static.md), including a ready-to-use init config.

- **Configuration:** PostHog Cloud US with `cookieless_mode: 'always'` and `person_profiles: 'never'`. No cookies, no storage, IP stripped server-side before enrichment, so no consent banner and nothing individually identifying is stored. Requires the project setting "Cookieless server hash mode".
- **Surface trimmed:** `disable_session_recording: true`, `disable_surveys: true`, autocapture narrowed to clicks on `a` and `button`, `ph-no-capture` on the Assessment Form, one explicit `assessment_submitted` event, and `before_send` stripping query strings from `$current_url`.
- **Install shape:** npm `posthog-js`, not the snippet, initialised from a client-only `useEffect` in the root route with `VITE_POSTHOG_PROJECT_TOKEN`. An empty token makes `init` a logged no-op (verified in source), so local and preview builds run without a project. The `phc_` token is documented as safe to expose.
- **Reverse proxy:** skip for v1. No Cloudflare zone exists yet, PostHog's managed proxy is explicitly not HIPAA-compliant, and a self-hosted Worker proxy only improves capture rate. Keep `api_host` and `ui_host` in env so it is a config flip later.
- **Cost and compliance:** free tier (1M events/month) is ample. No BAA needed because no PHI reaches PostHog. Costs of cookieless mode: no returning-visitor tracking past 24 hours, no GeoIP, possible hash collisions on shared IP plus user agent.
- **DNT:** in cookieless `always` mode `respect_dnt` has no effect; honour DNT and Global Privacy Control with a manual `navigator.globalPrivacyControl` check before `init` if wanted.
