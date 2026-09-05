# 03 — How does a statically prerendered TanStack Start site deploy to Cloudflare with one server endpoint?

Type: research
Status: open

## Question

Rule 11 says every public page is statically generated, but the Assessment Form needs one server endpoint. Establish from primary sources (TanStack Start docs, Cloudflare Workers and Pages docs):

- TanStack Start's static prerendering: the config that prerenders routes at build time, what the output looks like, and whether a prerendered route can coexist with a server function or API route in the same app.
- Cloudflare hosting shapes for that output: Pages, Workers with static assets, or a Worker alongside a static bucket. Which one Cloudflare currently recommends for new projects and which TanStack Start's Cloudflare target supports.
- How a single POST endpoint (form submission plus Turnstile verification) is deployed next to fully static pages in the recommended shape. Whether it is a TanStack server route or a separate Worker.
- Preview versus production deployments, environment variables and secrets, and how to run the whole thing locally with Wrangler or the Vite dev server before any Cloudflare account exists.
- Caching and headers for a static site on Cloudflare: `_headers`, immutable assets, HTML revalidation.

Record findings in `docs/research/cloudflare-ssg.md`, each claim cited.
