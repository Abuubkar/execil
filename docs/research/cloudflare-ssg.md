# TanStack Start static prerendering on Cloudflare, with one form endpoint

Ticket: `.scratch/landing-page/issues/03-cloudflare-ssg.md`. Researched 2026-09-05 against TanStack Start docs, the TanStack `router` repo, and Cloudflare developer docs. Every claim carries its source; anything not confirmed from a primary source is flagged inline and collected at the end.

## Summary and recommendation

**Hosting shape: one Cloudflare Worker with Static Assets, built by `@cloudflare/vite-plugin`.** Cloudflare's Pages docs now open with "Start new projects with Workers" ([Pages docs](https://developers.cloudflare.com/pages/)), and TanStack Start's only Cloudflare target is Workers via `@cloudflare/vite-plugin` ([TanStack hosting guide](https://tanstack.com/start/latest/docs/framework/react/guide/hosting)); Pages has no Vite-plugin support at all ([compatibility matrix](https://developers.cloudflare.com/workers/static-assets/compatibility-matrix/)). A separate R2 bucket is not a hosting shape Cloudflare documents for sites ([R2 public buckets](https://developers.cloudflare.com/r2/buckets/public-buckets/)).

**How the form endpoint sits next to static pages.** `tanstackStart({ prerender: { enabled: true } })` writes every public route as `<path>/index.html` into the client build output; the Vite plugin points `assets.directory` at that same output, so the pages are Static Assets and are served without invoking the Worker ([Cloudflare TanStack guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/tanstack-start/), [Vite plugin static assets](https://developers.cloudflare.com/workers/vite-plugin/reference/static-assets/), [Static Assets](https://developers.cloudflare.com/workers/static-assets/)). The Assessment Form POST is a **TanStack server route** (a route file with `server.handlers.POST` and no component) inside the same app; component-less routes are excluded from prerender discovery, and any request that matches no asset falls through to the Worker ([static prerendering guide](https://tanstack.com/start/latest/docs/framework/react/guide/static-prerendering), [server routes guide](https://tanstack.com/start/latest/docs/framework/react/guide/server-routes), [worker script routing](https://developers.cloudflare.com/workers/static-assets/routing/worker-script/)). No second Worker is needed. Asset requests are free and unlimited; only the POST hits Workers billing ([billing and limitations](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/)).

**Other headline decisions.**
- Preview vs production: Workers Builds runs `npx wrangler deploy` on the production branch and `npx wrangler versions upload` on other branches, which yields a Preview URL per version without touching production ([Builds configuration](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/), [Preview URLs](https://developers.cloudflare.com/workers/configuration/previews/)).
- Secrets: the Turnstile secret is a Worker secret (`wrangler secret put`) in production and a `.dev.vars` entry locally; `secrets.required` in `wrangler.jsonc` makes deploys fail if it is missing ([Secrets](https://developers.cloudflare.com/workers/configuration/secrets/), [Wrangler configuration](https://developers.cloudflare.com/workers/wrangler/configuration/)).
- Local dev before any account exists: `vite dev` runs the Worker in workerd via Miniflare with no Cloudflare login; `vite preview` runs the production build including prerendered assets; Turnstile ships dummy site/secret keys that work on `localhost` ([Development and testing](https://developers.cloudflare.com/workers/development-testing/), [Vite plugin](https://developers.cloudflare.com/workers/vite-plugin/), [Turnstile testing](https://developers.cloudflare.com/turnstile/troubleshooting/testing/)).
- Caching: Static Assets default to `Cache-Control: public, max-age=0, must-revalidate` plus an `ETag`; add a `public/_headers` rule making Vite's hashed `/assets/*` immutable and leave HTML on the revalidating default. `_headers` never applies to Worker-generated responses, so the POST handler sets its own headers ([Headers](https://developers.cloudflare.com/workers/static-assets/headers/)).

## 1. TanStack Start static prerendering

### Config

Prerendering is configured on the `tanstackStart` plugin in `vite.config.ts` (an Rsbuild variant exists too). Options and defaults, from the [static prerendering guide](https://tanstack.com/start/latest/docs/framework/react/guide/static-prerendering) (verbatim from the docs source, [static-prerendering.md](https://raw.githubusercontent.com/TanStack/router/main/docs/start/framework/react/guide/static-prerendering.md)):

```ts
tanstackStart({
  prerender: {
    enabled: false,               // switch to true
    autoSubfolderIndex: true,     // `/page/index.html` rather than `/page.html`
    autoStaticPathsDiscovery: true,
    concurrency: 14,
    crawlLinks: true,             // extract links from rendered HTML and prerender them too
    filter: ({ path }) => !path.startsWith('/do-not-render-me'),
    retryCount: 2,
    retryDelay: 1000,
    maxRedirects: 5,
    failOnError: true,
    onSuccess: ({ page }) => {},
  },
  pages: [
    { path: '/my-page', prerender: { enabled: true, outputPath: '/my-page/index.html' } },
  ],
})
```

Automatic discovery excludes routes with path parameters, layout routes (prefixed `_`), and "routes without components (e.g., API routes)"; discovered routes merge with `pages` ([static prerendering guide](https://tanstack.com/start/latest/docs/framework/react/guide/static-prerendering)). With `crawlLinks` on, "if `/` contains a link to `/posts`, then `/posts` will also be automatically prerendered" (same source).

For a single-page landing site, `prerender: { enabled: true }` with defaults is sufficient: `/` is discovered, and anything it links to (e.g. a future `/404` or legal page) is crawled.

### What the output looks like

The prerenderer fetches each page from the built server handler and writes the HTML into the **client output directory** (`handler.getClientOutputDirectory()`); with `autoSubfolderIndex` (default true) the file is `<path>/index.html`, otherwise `<path>.html` ([`packages/start-plugin-core/src/prerender.ts`](https://github.com/TanStack/router/blob/main/packages/start-plugin-core/src/prerender.ts), lines ~54-58 and ~160-198). The hosting guide states Vite builds emit client assets to `dist/client` ([hosting guide](https://tanstack.com/start/latest/docs/framework/react/guide/hosting)). So a build produces `dist/client/index.html` next to Vite's hashed `dist/client/assets/*` bundles, plus a server bundle for the Worker.

### Coexistence with server functions and server routes

Confirmed from primary sources:

- Server routes are ordinary route files with a `server.handlers` map (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`, ...) receiving a Web `Request` and returning a `Response`; they are "meant for HTTP endpoints that need to be called from outside your TanStack Start application" ([server routes guide](https://tanstack.com/start/latest/docs/framework/react/guide/server-routes)).
- A server-only route has no component and is therefore skipped by prerender discovery ([static prerendering guide](https://tanstack.com/start/latest/docs/framework/react/guide/static-prerendering)). The page routes are prerendered; the endpoint stays live in the Worker. The same `tanstackStart` plugin builds both from one config.
- Cloudflare documents exactly this combination: the Cloudflare TanStack Start guide shows `prerender: { enabled: true }` alongside `cloudflare({ viteEnvironment: { name: 'ssr' } })`, with `main` still pointing at the Start server entry, and notes "Prerendering runs at build time. It uses your local environment variables, secrets, and bindings storage data"; requires `@tanstack/react-start` >= 1.138.0 ([Cloudflare TanStack Start guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/tanstack-start/), [Cloudflare changelog 2025-12-19](https://developers.cloudflare.com/changelog/post/2025-12-19-tanstack-start-prerendering/)).
- Server functions (`createServerFn`) also keep working from a prerendered page: "On the client, calls become `fetch` requests to the server" ([server functions guide](https://tanstack.com/start/latest/docs/framework/react/guide/server-functions)). For the form, a server route is the better fit because the endpoint takes a browser form POST with a Turnstile token and returns a plain `Response`; server functions exist for typed in-app calls with Start-managed serialization ([server routes guide](https://tanstack.com/start/latest/docs/framework/react/guide/server-routes)).

Not confirmed: the exact `fetch` URL path server functions use (the docs page does not spell it out); irrelevant if a server route is used.

## 2. Cloudflare hosting shapes

| Shape | Status | Source |
|---|---|---|
| **Workers + Static Assets** | Cloudflare's "primary platform for building applications"; "Start new projects with Workers." Requests to assets are free and unlimited, no storage cost. | [Pages docs banner](https://developers.cloudflare.com/pages/), [billing](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/) |
| Pages | Still runs, but Cloudflare's own migration guide and matrix show Workers has the broader feature set; Pages lacks the Cloudflare Vite plugin, gradual deployments, Workers Logs, source maps. | [Migrate from Pages](https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/), [compatibility matrix](https://developers.cloudflare.com/workers/static-assets/compatibility-matrix/) |
| Worker + R2 bucket | R2 public buckets are documented as bucket exposure (custom domain, or rate-limited `r2.dev` for non-production), not as site hosting. Nothing on TanStack's side targets it. | [R2 public buckets](https://developers.cloudflare.com/r2/buckets/public-buckets/) |
| Workers Sites | Deprecated in Wrangler v4; Cloudflare says not to use it for new projects and the Vite plugin does not support it. | [Workers Sites](https://developers.cloudflare.com/workers/configuration/sites/) |

TanStack Start's supported Cloudflare target is Workers, as an "Official Partner", and "the official Cloudflare Workers setup currently uses Vite through `@cloudflare/vite-plugin`" ([hosting guide](https://tanstack.com/start/latest/docs/framework/react/guide/hosting)). The reference setup (identical in TanStack's guide, Cloudflare's guide, and TanStack's [`start-basic-cloudflare` example](https://github.com/TanStack/router/tree/main/examples/react/start-basic-cloudflare)):

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import { cloudflare } from '@cloudflare/vite-plugin'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    tanstackStart({ prerender: { enabled: true } }),
    viteReact(),
  ],
})
```

```jsonc
// wrangler.jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "execil-landing",
  "compatibility_date": "2026-09-05",
  "compatibility_flags": ["nodejs_compat"],
  "main": "@tanstack/react-start/server-entry",
  "observability": { "enabled": true }
}
```

```json
{ "scripts": { "dev": "vite dev", "build": "vite build", "preview": "vite preview",
  "deploy": "npm run build && wrangler deploy", "cf-typegen": "wrangler types" } }
```

Sources: [TanStack hosting guide](https://tanstack.com/start/latest/docs/framework/react/guide/hosting), [Cloudflare TanStack Start guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/tanstack-start/), example [`wrangler.jsonc`](https://raw.githubusercontent.com/TanStack/router/main/examples/react/start-basic-cloudflare/wrangler.jsonc) and [`package.json`](https://raw.githubusercontent.com/TanStack/router/main/examples/react/start-basic-cloudflare/package.json) (example pins `@cloudflare/vite-plugin ^1.29`, `wrangler ^4.74`, `vite ^8`).

Build and deploy mechanics: `vite build` emits `dist/<env>` directories and a generated `wrangler.json`; its `assets.directory` "is automatically populated with the path to your `client` build output"; `wrangler deploy` reads that generated config ([Vite plugin](https://developers.cloudflare.com/workers/vite-plugin/), [Vite plugin static assets](https://developers.cloudflare.com/workers/vite-plugin/reference/static-assets/)). The redirect works through a `.wrangler/deploy/config.json` file containing `{ "configPath": "../../<generated wrangler.json>" }`, honoured by `wrangler deploy`, `wrangler dev`, `wrangler versions upload` and `wrangler versions deploy` ([Wrangler configuration, generated configuration](https://developers.cloudflare.com/workers/wrangler/configuration/#generated-wrangler-configuration)). You therefore do not hand-write `assets.directory` in `wrangler.jsonc`; other `assets.*` keys (`html_handling`, `not_found_handling`, `run_worker_first`) can be set there and are carried into the generated file.

Note: Cloudflare's guide also says a bare `npx wrangler deploy` on an existing project auto-detects TanStack Start and generates config pointing at `.output/server/index.mjs` and `.output/public`. Those are Nitro-build paths ([TanStack hosting guide](https://tanstack.com/start/latest/docs/framework/react/guide/hosting), Node/Nitro section), not the Vite-plugin layout; use the explicit Vite-plugin setup above and ignore that shortcut.

## 3. Deploying the single POST endpoint next to static pages

Routing on Workers with Static Assets: "By default, if a requested URL matches a file in the static assets directory, that file will be served — without invoking Worker code"; if no asset matches, the Worker runs ([Static Assets](https://developers.cloudflare.com/workers/static-assets/), [worker script routing](https://developers.cloudflare.com/workers/static-assets/routing/worker-script/)). So:

- `GET /` matches `dist/client/index.html` and is served from the asset store; the Worker is not invoked and the request is unbilled.
- `POST /api/assessment` matches no asset and reaches the Worker, where the Start server entry dispatches it to the server route.

Recommended shape: a **TanStack server route**, not a separate Worker.

```ts
// src/routes/api/assessment.ts  (no component => not prerendered)
import { createFileRoute } from '@tanstack/react-router'
import { env } from 'cloudflare:workers'

export const Route = createFileRoute('/api/assessment')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const form = await request.formData()
        const token = form.get('cf-turnstile-response')
        const verify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ secret: env.TURNSTILE_SECRET_KEY, response: token,
                                 remoteip: request.headers.get('CF-Connecting-IP') }),
        })
        const outcome = await verify.json()
        if (!outcome.success) return Response.json({ ok: false }, { status: 400 })
        // ... deliver the submission (email path is a separate ticket)
        return Response.json({ ok: true })
      },
    },
  },
})
```

Grounding for each piece:
- Route shape, handler context (`request`, `params`, `context`), `Response.json()`, and route-level middleware: [server routes guide](https://tanstack.com/start/latest/docs/framework/react/guide/server-routes).
- `import { env } from 'cloudflare:workers'` inside Start server code is the pattern in Cloudflare's guide ([Cloudflare TanStack Start guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/tanstack-start/)); secrets are also reachable via the `env` parameter or `process.env` with `nodejs_compat` ([Secrets](https://developers.cloudflare.com/workers/configuration/secrets/)).
- Turnstile: the widget is `<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer>` plus `<div class="cf-turnstile" data-sitekey="...">`; inside a `<form>` "an invisible input field with the name `cf-turnstile-response` is automatically created" ([client-side rendering](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/)). Siteverify is `POST https://challenges.cloudflare.com/turnstile/v0/siteverify` accepting JSON or form-encoded `secret` and `response`, optional `remoteip` and `idempotency_key`, returning `{ success, "error-codes", hostname, challenge_ts, ... }`; "Server-side validation is mandatory"; tokens expire after 300 s and validate once ([server-side validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/), [Turnstile get started](https://developers.cloudflare.com/turnstile/get-started/)).

Optional hardening: `assets.run_worker_first: ["/api/*"]` forces the Worker to run for those paths regardless of assets; arrays support `*` and `!` negation, up to 100 entries ([SPA routing](https://developers.cloudflare.com/workers/static-assets/routing/single-page-application/), [assets binding](https://developers.cloudflare.com/workers/static-assets/binding/)). Not required here because no asset will ever exist under `/api/`, and on the Free plan requests matching `run_worker_first` patterns return 429 once the daily Worker quota is exceeded rather than falling back to assets ([billing and limitations](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/)). Free-plan Worker quota is 100,000 requests/day; asset limits are 20,000 files per version (Free) at 25 MiB each ([limits](https://developers.cloudflare.com/workers/platform/limits/)).

Not confirmed: whether Cloudflare serves assets only for `GET`/`HEAD` and routes every `POST` to the Worker irrespective of a path match. No page I read states the method rule. It does not matter for this design (the endpoint path has no asset), but do not rely on posting to `/`.

## 4. Preview vs production, env vars and secrets, local dev

### Preview vs production

- `wrangler deploy` creates a version and sends 100% of traffic to it; versions and deployments are decoupled, with rollbacks and gradual splits available ([versions and deployments](https://developers.cloudflare.com/workers/configuration/versions-and-deployments/)).
- `wrangler versions upload` creates a version without deploying it and gives it a **Preview URL** of the form `<VERSION_PREFIX or ALIAS>-<WORKER_NAME>.<SUBDOMAIN>.workers.dev`; `--preview-alias staging` pins a stable alias. Preview URLs are on by default when `workers_dev` is on (`preview_urls` in Wrangler config), require Wrangler >= 3.91, and have no logs ([Preview URLs](https://developers.cloudflare.com/workers/configuration/previews/), [Wrangler configuration](https://developers.cloudflare.com/workers/wrangler/configuration/)).
- Workers Builds (git integration): the production branch runs the build command then `npx wrangler deploy`; non-production branches, when enabled under Settings > Build > Branch control, run `npx wrangler versions upload` and get Preview URLs. Build-time variables/secrets are configured separately from runtime ones ([Builds configuration](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/), [build branches](https://developers.cloudflare.com/workers/ci-cd/builds/build-branches/)). The matrix marks "Branch Deploy Controls" as partial and "Custom Branch Aliases" as pending on Workers versus Pages ([compatibility matrix](https://developers.cloudflare.com/workers/static-assets/compatibility-matrix/)).
- Alternative isolation: Wrangler environments (`[env.staging]`) deploy a distinct Worker named `<name>-<env>` via `wrangler deploy --env staging` or `CLOUDFLARE_ENV=staging`; vars, bindings and secrets are non-inheritable and must be repeated per environment ([environments](https://developers.cloudflare.com/workers/wrangler/environments/)).

Recommendation: one Worker, Workers Builds with non-production-branch previews. Environments are unnecessary for a single marketing site.

### Environment variables and secrets

- Plaintext config goes in `vars` in `wrangler.jsonc` (the TanStack example uses `"vars": { "MY_VAR": ... }`); values that must stay hidden are **secrets**, set with `npx wrangler secret put <KEY>` (or `wrangler versions secret put` for gradual deploys), the dashboard, or `wrangler deploy --secrets-file .env.production` for bulk ([Secrets](https://developers.cloudflare.com/workers/configuration/secrets/), example [`wrangler.jsonc`](https://raw.githubusercontent.com/TanStack/router/main/examples/react/start-basic-cloudflare/wrangler.jsonc)).
- Declare `"secrets": { "required": ["TURNSTILE_SECRET_KEY"] }` so a deploy without the secret fails loudly ([Wrangler configuration](https://developers.cloudflare.com/workers/wrangler/configuration/), [Secrets](https://developers.cloudflare.com/workers/configuration/secrets/)).
- The Turnstile **site key** is public and belongs in `vars` (or a build-time Vite env var, since it is baked into the prerendered HTML); the **secret key** is a Worker secret.
- Locally, secrets live in `.dev.vars` or `.env` (pick one style); per-environment files `.dev.vars.<env>` / `.env.<env>` are supported; add `.dev.vars*` and `.env*` to `.gitignore` ([Secrets](https://developers.cloudflare.com/workers/configuration/secrets/)). With the Vite plugin, `CLOUDFLARE_ENV=staging vite dev` loads `.dev.vars.staging`, and `vite build` copies the relevant `.dev.vars` into the output "only used when running `vite preview` and is not deployed with your Worker" ([Vite plugin secrets](https://developers.cloudflare.com/workers/vite-plugin/reference/secrets/)).
- Prerendering "uses your local environment variables, secrets, and bindings storage data" at build time; in CI set `CLOUDFLARE_INCLUDE_PROCESS_ENV=true` or use remote bindings if production values are needed during the build ([Cloudflare TanStack Start guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/tanstack-start/)). For this site the only build-time value is the public Turnstile site key.

### Running everything locally before any Cloudflare account exists

- `vite dev` with `@cloudflare/vite-plugin` runs the Worker inside `workerd` via Miniflare, matching production "as closely as possible"; bindings are simulated locally; **no Cloudflare login is required** unless remote bindings or `--remote` are used ([Development and testing](https://developers.cloudflare.com/workers/development-testing/), [Vite plugin](https://developers.cloudflare.com/workers/vite-plugin/)).
- `vite build` then `vite preview` serves the real build output, including prerendered HTML as static assets and the server route in the Workers runtime ([Vite plugin](https://developers.cloudflare.com/workers/vite-plugin/), [Cloudflare TanStack Start guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/tanstack-start/)).
- Turnstile without an account: dummy site keys `1x00000000000000000000AA` (always passes, visible), `1x00000000000000000000BB` (always passes, invisible), `2x...AB`/`2x...BB` (always fails), `3x00000000000000000000FF` (forces interactive); dummy secret keys `1x0000000000000000000000000000000AA` (passes), `2x...AA` (fails), `3x...AA` (token already spent). "Dummy sitekeys can be used from any domain, including on localhost" ([Turnstile testing](https://developers.cloudflare.com/turnstile/troubleshooting/testing/)). So `.dev.vars` ships with the `1x...` secret and the site key var defaults to `1x00000000000000000000AA`; real keys replace them when the account exists.
- `wrangler login` / `wrangler whoami` are only needed at deploy time ([TanStack hosting guide](https://tanstack.com/start/latest/docs/framework/react/guide/hosting)).

## 5. Caching and headers for the static site

**Defaults for Static Assets** (all overridable): `Content-Type` from the file extension, `Cache-Control: public, max-age=0, must-revalidate` for non-authenticated requests, an `ETag` that is a hash of the file so browsers can revalidate with `If-None-Match`, and `CF-Cache-Status` ([Headers](https://developers.cloudflare.com/workers/static-assets/headers/)). Assets are cached across Cloudflare's network: fetched from storage on first request and cached at the nearest location, with tiered caching filling other data centers from nearby caches instead of storage ([Static Assets](https://developers.cloudflare.com/workers/static-assets/)).

**`_headers` file.** Plain text in the static assets directory (`public/` for framework projects; with the Vite plugin, "the paths in these files should reflect the structure of your client build output"). Syntax is a URL pattern line followed by indented `Name: Value` lines; `*` splats and `:placeholder` segments; `! Header-Name` removes a header; limits are 100 rules and 2,000 characters per line ([Headers](https://developers.cloudflare.com/workers/static-assets/headers/), [Vite plugin static assets](https://developers.cloudflare.com/workers/vite-plugin/reference/static-assets/)). The same directory holds `_redirects` (`[source] [destination] [code]`, default 302, 2,000 static + 100 dynamic rules) ([Redirects](https://developers.cloudflare.com/workers/static-assets/redirects/)).

Suggested `public/_headers`:

```
# Vite writes content-hashed bundles under /assets/
/assets/*
  Cache-Control: public, max-age=31536000, immutable

# Security baseline for every asset response (HTML included)
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: DENY
```

The immutable example mirrors Cloudflare's own "aggressive caching for fingerprinted assets" sample ([Headers](https://developers.cloudflare.com/workers/static-assets/headers/)). HTML deliberately keeps the default `max-age=0, must-revalidate` + `ETag`, which is the "HTML revalidation" behaviour the ticket asks about: browsers always revalidate and get a 304 when nothing changed, so a redeploy is picked up immediately. Fonts fetched from Fontshare and the Turnstile/PostHog scripts are third-party and outside this file.

**Limitation that matters for the endpoint.** "Custom headers defined in the `_headers` file are not applied to responses" generated by the Worker, even on matching URLs; set them in the handler ([Headers](https://developers.cloudflare.com/workers/static-assets/headers/)). Worker responses are not CDN-cached unless the code uses the Cache API; "Cloudflare Workers run before the cache" ([how the cache works](https://developers.cloudflare.com/workers/reference/how-the-cache-works/)). For a POST endpoint that is the desired behaviour anyway.

**Trailing slashes.** `assets.html_handling` defaults to `auto-trailing-slash`: a folder index such as `/services/index.html` is served at `/services/` (with `/services` 307-redirecting to `/services/`), while a flat `/services.html` is served at `/services` ([HTML handling](https://developers.cloudflare.com/workers/static-assets/routing/advanced/html-handling/), [SSG routing](https://developers.cloudflare.com/workers/static-assets/routing/static-site-generation/)). TanStack's default `autoSubfolderIndex: true` therefore yields trailing-slash canonical URLs for any page other than `/`. If additional pages are ever added and slash-less URLs are wanted, set `autoSubfolderIndex: false` on the TanStack side rather than fighting `html_handling`. For a single `/` page there is nothing to do.

**404s.** `assets.not_found_handling: "404-page"` serves the nearest `404.html` with a 404 status for unmatched paths ([SSG routing](https://developers.cloudflare.com/workers/static-assets/routing/static-site-generation/)). Note the default falls through to the Worker for unmatched paths, which would invoke (and bill) the Worker for every random URL; pairing `404-page` with a prerendered `404.html` (via `pages: [{ path: '/404', prerender: { enabled: true, outputPath: '/404.html' } }]`) keeps those requests on the free asset path. Not confirmed: that TanStack's not-found route renders correctly when fetched at `/404` during prerender; verify in the build ticket.

## 6. Open point from the community, for awareness

A TanStack issue opened 2026-06-02 claims prerendering "cannot work with Cloudflare as workers run in front of CDN" and that prerendered assets serve with Cloudflare's cache headers rather than user-specified ones; it has no maintainer reply and is still open ([TanStack/router#7527](https://github.com/TanStack/router/issues/7527)). Against the primary docs above, the first claim conflates Worker-generated responses (not cached, `_headers` not applied) with Static Assets (served and cached by Cloudflare without invoking the Worker); the second is the documented `_headers` behaviour and is what the `_headers` file is for. Treat it as a reminder to confirm `CF-Cache-Status` and `Cache-Control` on the deployed `/` and `/assets/*` once an account exists.

## Not confirmed from primary sources

- Whether Static Assets are served only for `GET`/`HEAD` and other methods always reach the Worker (section 3).
- Exact client-side URL path used by server-function `fetch` calls (section 1; moot with a server route).
- That TanStack's not-found route prerenders cleanly to `/404.html` (section 5).
- Any Cloudflare statement about R2 as a site host; the docs simply do not present it as one (section 2).
