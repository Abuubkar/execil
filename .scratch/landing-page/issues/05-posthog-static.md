# 05 — How should PostHog run on a static marketing site without a consent banner?

Type: research
Status: open

## Question

PostHog is the analytics choice. The site is US-only, static, and adjacent to HIPAA. Establish from primary sources (PostHog docs):

- Cookieless or consent-free configuration: `persistence: 'memory'`, cookieless mode, `disable_session_recording`, `autocapture` defaults, and which of these avoid needing a consent banner.
- The install shapes: snippet versus `posthog-js` npm package, and how to initialise it safely inside a statically prerendered TanStack Start app without running on the server.
- Reverse proxy through Cloudflare to avoid ad blockers, and whether that is worth it for v1.
- Respecting Do Not Track and `prefers-reduced-motion` irrelevance; what PII PostHog captures by default and how to keep form field contents out of it.
- US versus EU cloud, free tier limits, and how to run with a placeholder key until the project exists.

Record findings in `docs/research/posthog-static.md`, each claim cited.
