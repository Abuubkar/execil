# Provisioning runbook

Ordered by dependency. Each step names what it produces and which variable it fills. Everything before step 1 already works locally with **no accounts** — see "What already works" at the bottom.

Decisions behind this: [issue #16](https://github.com/Abuubkar/execil/issues/16).

> **This runbook is not the source of truth.** It records what was believed
> when it was written, much of it reasoned before any account existed. Where it
> disagrees with the vendor's own current documentation, **the vendor wins** —
> check the doc, follow it, and correct this file in the same change. Prefer a
> primary source to a blog or a search result. It has already been wrong about
> Email Routing subdomains, the mailbox provider, Free-plan rate-limiting
> fields, and `wrangler secret put`.

---

## ⚠️ Read before touching DNS

**Nothing in this runbook may touch the apex mail records.** The apex `MX` and `SPF` carry the Hostinger mailbox. Cloudflare Email Routing and Email Sending both want to rewrite them — its "Verify DNS records" screen offers to remove the conflicting Hostinger records "in place" — which is why neither is used here. Sending goes through Resend, which places its own MX and SPF on a `send.execil.net` subdomain and leaves the apex alone. This is the one area in this runbook that can cause real damage.

---

## 1 · Cloudflare account and Workers Builds

Free plan is enough.

Deployment is **Cloudflare Workers Builds**, connected to the GitHub repository —
not GitHub Actions. There is no API token and no GitHub secret: Cloudflare
builds on push and deploys itself. `.github/workflows/ci.yml` still runs format,
lint, types, build and the placeholder report on every push and pull request.

In the Worker's **Settings › Build**:

- **Branch**: `main`
- **Root directory**: `/`
- **Build command**: `pnpm run build`
- **Deploy command**: `pnpm run deploy:production` — this is
  `placeholders && wrangler deploy`, so the hard gate runs before production
  and **only** before production. Do not move the gate into the build command:
  the build runs for preview versions too, and the copy ships with bracketed
  placeholders deliberately until launch, so a gated build would fail every
  preview.
- **Version command**: `npx wrangler versions upload` — this is what produces
  preview URLs for non-production branches. Leave it ungated.
- **Build variables and secrets**: every `VITE_` value in the table below.
  These are build-time only. Runtime values live under *Settings › Variables &
  Secrets* and come from the `vars` block in `wrangler.jsonc`.

> **`VITE_SITE_URL` matters more than it looks.** `src/seo.ts` falls back to
> `http://localhost:3000` when it is unset, and that value becomes the
> `canonical` and `og:url` on every prerendered page. A build with no variables
> set ships a production site that tells search engines it lives on localhost.

## 2 · Domain and DNS

Purchase the domain, point its nameservers at Cloudflare, wait for the zone to go active.

- → Cloudflare **build variable** `VITE_SITE_URL` (e.g. `https://execil.com`)
- → Replace `REPLACE_AT_PROVISIONING` in `public/robots.txt` and `public/sitemap.xml`. These hard-code the domain because static files cannot read env vars.

## 3 · Hostinger mailbox

The address that receives submissions. **The apex MX stays pointed at Hostinger throughout** — nothing in this runbook changes it.

The provider is irrelevant to the delivery mechanism: the Worker POSTs to Resend, which delivers to whatever `ASSESSMENT_TO` names. Keep DNS on Cloudflare — the nameservers are delegated there, so Hostinger's own DNS panel is not served, and moving nameservers back to Hostinger would break the Worker custom domain and the WAF rule.

- → wrangler var `ASSESSMENT_TO`
- → Cloudflare **build variable** `VITE_CONTACT_EMAIL` (used by the form's failure-panel `mailto:`)

## 4 · Resend

Verify **`execil.net`** in Resend and add the records it gives you to
**Cloudflare** DNS — Cloudflare is authoritative for this zone, so Hostinger's
DNS panel is not served. Set them **DNS only (grey cloud)**.

Resend puts its MX and SPF on a `send.execil.net` subdomain of its own accord,
and DKIM on `resend._domainkey`. An MX record only affects the name it sits on,
so the apex `MX` and `SPF` carrying the Hostinger mailbox are untouched. **Do
not add a Resend `include:` to the apex SPF** — it does not need one, and the
apex may only hold one SPF policy.

- → wrangler var `RESEND_FROM`, the whole From header
  (`Execil Assessment <assessment@execil.net>`)
- → Worker **secret** `RESEND_API_KEY` (Settings › Variables & Secrets; locally
  `.dev.vars`). Never a `var`: this is a secret and `wrangler.jsonc` is
  committed. Never a build variable either — those are inlined into the browser
  bundle.

> **Baseline to protect.** `MX 5 mx1.hostinger.com` / `MX 10 mx2.hostinger.com`,
> `TXT "v=spf1 include:_spf.mail.hostinger.com ~all"`,
> `TXT _dmarc "v=DMARC1; p=none"`. Check with
> `dig +short MX execil.net @1.1.1.1` after any DNS change.

> **Known gap, unrelated to Resend.** Hostinger's three DKIM CNAMEs
> (`hostingermail-a/b/c._domainkey`) and the `autodiscover` / `autoconfig`
> CNAMEs exist in Hostinger's panel but were never copied into the Cloudflare
> zone, so outbound Hostinger mail is unsigned and mail-client autoconfig is
> broken.

## 5 · Recipient address

- → wrangler var `ASSESSMENT_TO` (`contact@execil.net`). Plain text on purpose:
  it is published on the site anyway, and a reviewer should see where leads go.

Resend verifies the SENDER domain, not the recipient, so nothing needs doing to
this address.

## 6 · Turnstile widget

Create an **invisible** widget. Add the production hostname; Cloudflare recommends production sitekeys **not** allow `localhost`.

- → Cloudflare **build variable** `VITE_TURNSTILE_SITEKEY`
- → Worker **secret** `TURNSTILE_SECRET` (Settings › Variables & Secrets). Not `wrangler secret put`: deployment is Workers Builds, so there is no local wrangler login.

## 7 · PostHog project

Cloud US.

- → Cloudflare **build variable** `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN`
- → Cloudflare **build variable** `VITE_PUBLIC_POSTHOG_HOST` (`https://us.i.posthog.com`)
- Enable **Cookieless server hash mode**. The client sets `cookieless_mode: 'always'`; without the matching project setting the events are sent and then dropped at ingestion, with nothing visible in the browser.

> The installed integration runs on PostHog's wizard defaults otherwise:
> autocapture, session replay, heatmaps and dead clicks are all on. That is a
> deliberate choice and it diverges from what `/privacy` and `/hipaa` describe.
> See the legal-review section of #34 before launch.

## 8 · WAF rate-limiting rule

Add a rate-limiting rule on `/api/assessment`.

> **Free plan cannot match on method.** Rate limiting on Free matches *Path* and
> *Verified Bot* only — `Method` needs Business. Match on the path alone: the
> route declares a `POST` handler and nothing else, so path-only matching is
> equivalent here. Free also allows **one rule per zone** and caps the period
> and mitigation timeout at **10 seconds**, so express the threshold as
> requests per 10s rather than per minute.

> **This rule lives only in the dashboard.** No code, no review, no history, and nothing in this repository will tell you if it is missing. If the Worker is ever recreated, this step is the easiest one to forget.

## 9 · Custom domain on the Worker

Attach `<domain>` (and `www` if wanted).

## 10 · Launch checks

- `pnpm placeholders` exits 0 — the production deploy **fails** while any bracketed value remains
- Submit the sitemap in Google Search Console
- Send one real test submission and confirm it arrives in the Inbox

---

## Variable map

| Name | Kind | From step | Known value |
|---|---|---|---|
| `VITE_SITE_URL` | Cloudflare build variable | 2 | `https://execil.net` |
| `ASSESSMENT_TO` | wrangler var | 5 | `contact@execil.net` |
| `VITE_CONTACT_EMAIL` | Cloudflare build variable | 3 | `contact@execil.net` |
| `RESEND_FROM` | wrangler var | 4 | `Execil Assessment <assessment@execil.net>` |
| `RESEND_API_KEY` | Worker secret | 4 | |
| `VITE_TURNSTILE_SITEKEY` | Cloudflare build variable | 6 | |
| `TURNSTILE_SECRET` | Worker secret | 6 | |
| `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` | Cloudflare build variable | 7 | |
| `VITE_PUBLIC_POSTHOG_HOST` | Cloudflare build variable | 7 | `https://us.i.posthog.com` |

## What already works with no accounts

| Verified locally | How |
|---|---|
| Full page, prerendered | `pnpm dev`, then `pnpm preview` on the production build |
| Form POST, all six paths | `pnpm preview` runs the Worker in workerd via Miniflare |
| Turnstile pass and fail | test keys: `1x…AA` passes, `2x…AA` fails, `3x…AA` returns "token already spent" |
| Analytics degrades without a project | the provider renders the tree untouched when either PostHog variable is absent. NOTE: `AnalyticsProvider` still **throws in dev** on a missing variable, so a fresh clone needs both set locally |
| Lint, format, types, build | `pnpm exec vp check`, `pnpm run build` |
| Placeholder inventory | `pnpm placeholders` |

## Only verifiable after accounts exist

- DNS propagation and zone activation
- **Whether the free send lane accepts a routing-subdomain sender** (step 4)
- Real email arriving in the Hostinger inbox, and its spam placement
- A real Turnstile challenge against a real hostname
- PostHog ingestion, and how much adblockers suppress
- WAF rate-limiting behaviour
- Preview URL and custom-domain routing

## Known risks carried into production

- **Cloudflare Email Service is Beta** — no SLA, unspecified quotas. The form's failure panel is the mitigation; `assessment_submission_failed{reason:"delivery"}` is the tripwire.
- **The routing-subdomain sender is unconfirmed** (step 4).
- **PostHog undercounts** without a reverse proxy — adblockers block it. This is systematic, not random. Adding a proxy later does not backfill.
- **The WAF rule has no representation in this repository** (step 8).
