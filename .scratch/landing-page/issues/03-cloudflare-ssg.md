# 03 — How does a statically prerendered TanStack Start site deploy to Cloudflare with one server endpoint?

Type: research
Status: resolved

## Question

Rule 11 says every public page is statically generated, but the Assessment Form needs one server endpoint. Establish from primary sources (TanStack Start docs, Cloudflare Workers and Pages docs):

- TanStack Start's static prerendering: the config that prerenders routes at build time, what the output looks like, and whether a prerendered route can coexist with a server function or API route in the same app.
- Cloudflare hosting shapes for that output: Pages, Workers with static assets, or a Worker alongside a static bucket. Which one Cloudflare currently recommends for new projects and which TanStack Start's Cloudflare target supports.
- How a single POST endpoint (form submission plus Turnstile verification) is deployed next to fully static pages in the recommended shape. Whether it is a TanStack server route or a separate Worker.
- Preview versus production deployments, environment variables and secrets, and how to run the whole thing locally with Wrangler or the Vite dev server before any Cloudflare account exists.
- Caching and headers for a static site on Cloudflare: `_headers`, immutable assets, HTML revalidation.

Record findings in `docs/research/cloudflare-ssg.md`, each claim cited.

## Answer

Full findings: [docs/research/cloudflare-ssg.md](../../../docs/research/cloudflare-ssg.md).

- **Hosting shape:** one Cloudflare Worker with Static Assets, built by `@cloudflare/vite-plugin` alongside `tanstackStart({ prerender: { enabled: true } })`. Cloudflare steers new projects to Workers over Pages, and TanStack Start's only Cloudflare target is Workers.
- **Static pages plus one endpoint:** prerender writes `dist/client/<path>/index.html`; the Vite plugin serves that folder as Static Assets, so `GET /` never invokes the Worker. The form POST is a TanStack server route (`server.handlers.POST`, no component, so it is excluded from prerender discovery) that the Worker handles when no asset matches. No second Worker.
- **Preview vs production:** Workers Builds deploys the production branch with `wrangler deploy` and other branches with `wrangler versions upload`, giving a preview URL per version. No Wrangler environments needed.
- **Secrets and local dev with no account:** Turnstile secret via `wrangler secret put` with `secrets.required` in `wrangler.jsonc`; `.dev.vars` locally. `vite dev` runs the Worker in workerd without a login; `vite preview` serves the real prerendered build; Turnstile dummy keys work on localhost.
- **Caching:** assets default to revalidating HTML with ETag; add `public/_headers` making `/assets/*` immutable. `_headers` does not apply to Worker responses, so the POST handler sets its own.
- **Verify after first deploy:** an open TanStack issue claims prerender does not work on Workers, contradicting Cloudflare's guide and TanStack's changelog. Treat as a post-deploy check, not a blocker.
