# PostHog on a static marketing site without a consent banner

Research for ticket 05 (`.scratch/landing-page/issues/05-posthog-static.md`). Investigated 2026-09-05 against posthog.com/docs, the `PostHog/posthog-js` repository (commit `2d22949`, 2026-09-04), and developers.cloudflare.com. Every claim carries its source; anything not confirmed from a primary source is flagged in the last section.

## Summary and recommended configuration

Context: US-only, statically prerendered TanStack Start site, HIPAA-adjacent (medical billing marketing, no patient data on the page), no consent banner, no PostHog account yet.

Recommendation: run PostHog Cloud US in **server-side cookieless mode** (`cookieless_mode: 'always'`) with person profiles off, session replay off, autocapture narrowed to clicks on links and buttons, and the assessment form wrapped in `ph-no-capture`. Initialise the npm package from a client-only effect so it never runs during prerender, read the token from a `VITE_`-prefixed env var, and let an empty token make init a no-op. Skip the reverse proxy for v1 and revisit once the Cloudflare zone exists. Do not sign a BAA: the site sends no PHI to PostHog, and with cookieless mode PostHog strips the IP before enrichment, so nothing PostHog stores is tied to an individual.

```ts
// src/analytics/posthog.ts — imported only from a client effect (see "Install shapes")
import posthog from 'posthog-js'

export function initAnalytics() {
  const token = import.meta.env.VITE_POSTHOG_PROJECT_TOKEN as string | undefined
  if (!token) return // posthog-js also no-ops on an empty token, this just keeps intent explicit

  posthog.init(token, {
    api_host: import.meta.env.VITE_POSTHOG_HOST ?? 'https://us.i.posthog.com',
    ui_host: 'https://us.posthog.com',      // only matters once api_host is a proxy
    defaults: '2026-05-30',                 // pins SDK defaults; includes capture_pageview: 'history_change'

    // No cookies, no localStorage, no banner. Requires the project setting
    // "Cookieless server hash mode" (Project settings > Web analytics) to be ON.
    cookieless_mode: 'always',
    person_profiles: 'never',

    // Product surface we do not want on a marketing site
    disable_session_recording: true,
    disable_surveys: true,
    capture_exceptions: false,

    // Keep autocapture, but only click events on links and buttons.
    autocapture: {
      dom_event_allowlist: ['click'],
      element_allowlist: ['a', 'button'],
    },
    capture_dead_clicks: false,

    // Belt and braces: never let a URL with a query string reach PostHog
    // (the assessment form is POST-only, but keep hrefs with params out too).
    before_send: (event) => {
      if (!event) return null
      const url = event.properties?.['$current_url']
      if (typeof url === 'string' && url.includes('?')) {
        event.properties['$current_url'] = url.split('?')[0]
      }
      return event
    },
  })
}
```

Plus, in markup: the assessment form gets `class="ph-no-capture"` on its root, and the form's success path fires one explicit `posthog.capture('assessment_submitted')` with no properties.

Project-level settings to flip once the project exists: enable "Cookieless server hash mode"; set "Discard client IP data" on (cookieless mode already strips it, this is defence in depth); leave "Record user sessions" off.

What this costs: no returning-visitor tracking beyond 24 hours, no GeoIP (country/state) breakdown, no session replay, no surveys, and unique-visitor counts that can merge two people on the same IP and browser. For a US-only lead-gen site those are acceptable in exchange for having nothing to put a banner in front of.

---

## 1. Cookieless or consent-free configuration

### 1.1 What the persistence options are

`persistence` accepts `localStorage+cookie` (default), `cookie`, `localStorage`, `sessionStorage`, and `memory`. Under the default, "Limited things are stored in the cookie such as the distinctID and the sessionID, and everything else in the browser's `localStorage`." `memory` "Stores everything in page memory, which means data is only persisted for the duration of the page view." What gets stored is the distinct ID, session and device IDs, active feature flags, super properties and configuration.
Source: https://posthog.com/docs/libraries/js/persistence

`disable_persistence` (default `false`): "Disable persisting user data across pages. This will disable cookies, session storage and local storage."
Source: https://posthog.com/docs/libraries/js/config

### 1.2 `persistence: 'memory'` versus `cookieless_mode`

These are two different mechanisms.

- `persistence: 'memory'` is purely client-side: IDs are generated in the browser and forgotten at the end of the page view. Every page load is a new anonymous person. The event still carries the client IP, so server-side GeoIP still works. PostHog's own GDPR page frames this as the older "no cookies" pattern and links to the cookieless tutorial for the newer one.
  Sources: https://posthog.com/docs/libraries/js/persistence, https://posthog.com/docs/privacy/gdpr-compliance

- `cookieless_mode` (`'always'` | `'on_reject'`, default `undefined`): "Enables cookieless tracking: PostHog sets no cookies and uses no session or local storage, with user identity handled by a privacy-preserving hash generated on PostHog's servers."
  Source: https://posthog.com/docs/libraries/js/config

  The server computes `hash(team_id, daily_salt, ip_address, user_agent, hostname)`; the daily salt rotates and is deleted, so the hash is treated as non-identifying even though IP and user agent are inputs. Both modes require the project setting "Cookieless server hash mode" (Project settings > Web analytics).
  Source: https://posthog.com/docs/product-analytics/cookieless-tracking

  Documented config:
  ```js
  posthog.init("<ph_project_token>", {
    cookieless_mode: "always",
    api_host: "https://us.i.posthog.com",
    defaults: "2026-05-30",
  });
  ```
  Source: https://posthog.com/docs/product-analytics/cookieless-tracking

  In `'always'` mode PostHog "never stores data in cookies or local/session storage"; the docs advise not calling `identify()` and setting `person_profiles: 'never'` so no persistent identifier is ever created. In `'on_reject'` mode the SDK waits for consent (`posthog.get_explicit_consent_status()` returns `pending`, then `opt_in_capturing()` / `opt_out_capturing()`), which presupposes a banner.
  Sources: https://posthog.com/docs/product-analytics/cookieless-tracking, https://posthog.com/tutorials/cookieless-tracking

  In source, `'always'` mode registers `distinct_id: '$posthog_cookieless'` (the `COOKIELESS_SENTINEL_VALUE`) with `$device_id: null` and does not create a `SessionIdManager`.
  Sources: https://github.com/PostHog/posthog-js/blob/2d2294941c3a2ad564077ee4709cc3e562c888de/packages/browser/src/posthog-core.ts (`_init`, around line 1005), https://github.com/PostHog/posthog-js/blob/2d2294941c3a2ad564077ee4709cc3e562c888de/packages/browser/src/constants.ts (line 103)

### 1.3 What cookieless mode loses

From the docs and tutorial:
- Returning users: the daily salt means a visitor "appear[s] as new people after 24 hours".
- Session replay and surveys "are disabled if the user has not given cookie consent" because "both features rely on storing data in cookies/local storage".
- Feature flag caching: no browser storage, so "there can be a delay between the page loading and things like feature flags being available".
- Hash collisions: "two different users could be counted as one user" when they share IP and user agent; weekly/monthly uniques are unreliable.
- GeoIP and bot detection: "When Cookieless server hash mode is enabled, the IP is stripped before transformations run, so GeoIP enrichment and bot detection won't enrich your events."
Sources: https://posthog.com/docs/product-analytics/cookieless-tracking, https://posthog.com/tutorials/cookieless-tracking, https://posthog.com/docs/product-analytics/privacy

### 1.4 `disable_session_recording` and the project toggle

`disable_session_recording` (default `false`): "Determines if users should be opted out of session recording."
Source: https://posthog.com/docs/libraries/js/config

Recording is gated by both the project setting and the SDK. The docs say replay methods "will have no effect if session recordings are disabled in your PostHog Project Settings", and the project setting is "Record user sessions". In source, recording starts only when the remote config says `enabled`, `disable_session_recording` is false, and the user is not opted out:

```ts
private get _isRecordingEnabled() {
    const enabled_server_side = !!this._instance.get_property(SESSION_RECORDING_REMOTE_CONFIG)?.enabled
    const enabled_client_side = !this._config.disable_session_recording
    const isDisabled = this._config.disable_session_recording || this._instance.consent.isOptedOut()
    return window && enabled_server_side && enabled_client_side && !isDisabled
}
```
Sources: https://posthog.com/docs/session-replay/how-to-control-which-sessions-you-record, https://posthog.com/docs/session-replay/installation, https://github.com/PostHog/posthog-js/blob/2d2294941c3a2ad564077ee4709cc3e562c888de/packages/browser/src/extensions/replay/session-recording.ts (lines 118–123)

The recorder is not in the core bundle: "When recordings are enabled, `posthog-js` will fetch a `recorder.js` script from the PostHog server."
Source: https://posthog.com/docs/session-replay/troubleshooting

So `disable_session_recording: true` in the SDK is sufficient on its own, and leaving the project toggle off is a second lock. Either alone stops the recorder script from loading.

### 1.5 Autocapture defaults

`autocapture` (default `true`): "Determines if PostHog should autocapture events. This setting does not affect capturing pageview events." Sub-options `url_allowlist`, `dom_event_allowlist`, `element_allowlist`, `css_selector_allowlist` (all default `undefined` = everything allowed; an empty array = nothing), and `capture_copied_text` (default `false`).
Source: https://posthog.com/docs/libraries/js/config

By default autocapture records "clicks, taps, and other user interactions" on `a, button, form, input, select, textarea, label`, plus form submissions, form changes, and `contenteditable` changes. It respects `.ph-no-capture` and `[data-ph-no-autocapture]` by default.
Source: https://posthog.com/docs/product-analytics/autocapture

Other on-by-default capture in the same config page: `capture_pageview` (`true`, or `'history_change'` under `defaults: '2025-05-24'` and later), `capture_pageleave` (`true`), `capture_dead_clicks` (`true`), `rageclick` (`true`), `capture_exceptions` (`undefined`), `capture_heatmaps` (`undefined`, falls back to the project's remote config), `disable_surveys` (`false`).
Source: https://posthog.com/docs/libraries/js/config

### 1.6 Which of these avoid a consent banner

PostHog's GDPR page: "If you use PostHog with cookies on your website (for logged out users), you should also use a cookie banner to enable people to give and withdraw their consent for using cookies." The cookieless tutorial positions `cookieless_mode: 'always'` as the option for teams who want to avoid a banner entirely, because nothing is written to cookies or storage. PostHog's CCPA page asks for a "notice at collection" (a privacy notice listing categories of data collected and their use) and a 45-day deletion-response window; it does not ask for a consent banner.
Sources: https://posthog.com/docs/privacy/gdpr-compliance, https://posthog.com/tutorials/cookieless-tracking, https://posthog.com/docs/privacy/ccpa-compliance

Reading across those: on a US-only site the consent-banner driver is ePrivacy/GDPR, which does not apply. What does apply (CCPA) is a notice, not a banner. Using `cookieless_mode: 'always'` removes the cookie question altogether so that no future EU visitor or state-law change forces a retrofit. `persistence: 'memory'` would also avoid cookies, but PostHog would still receive and enrich the raw IP, which is the one datum PostHog's own HIPAA page lists as PHI-class ("emails, URLs, and IP addresses"). Cookieless mode strips it before enrichment. That is why the recommendation is cookieless mode rather than memory persistence.
Source for the PHI list: https://posthog.com/docs/privacy/hipaa-compliance

---

## 2. Install shapes: snippet vs `posthog-js`, and a prerendered TanStack Start app

### 2.1 Snippet vs npm

The docs mark the HTML snippet as "Recommended". The snippet is a small bootstrap that injects a `<script>` for `array.js`: it derives the assets host by `s.api_host.replace(".i.posthog.com","-assets.i.posthog.com") + "/static/array.js"`. The npm route is `npm install --save posthog-js` then `posthog.init('<ph_project_token>', { api_host: 'https://us.i.posthog.com', defaults: '2026-05-30' })`. The docs warn that with npm you should "be sure to update it frequently" because they "ship weirdly fast".
Source: https://posthog.com/docs/libraries/js

Either way, extensions are lazy-loaded: "By default, the JavaScript Web library only loads the core functionality. It lazy-loads extensions such as surveys or the session replay 'recorder' when needed." Alternative entrypoints exist: `posthog-js/dist/module.slim` (experimental, core only, extensions opted into via `__extensionClasses`), `posthog-js/dist/module.no-external` (disables remote loading), and `posthog-js/dist/module.full.no-external` (everything pre-bundled).
Source: https://posthog.com/docs/libraries/js

The `defaults` option: "The `defaults` is a date, such as `2026-05-30`, for a configuration snapshot used as defaults to initialize PostHog. This default is overridden when you explicitly set a value for any of the options." Dated snapshots: `2025-05-24` (capture_pageview → `history_change`), `2025-11-30`, `2026-01-30`, `2026-05-30` (adds `split_storage: true`, `persistence_save_debounce_ms: 250`, and more), `2026-06-25`, `2026-08-29` (`cookieWinsOnConflict: true`), `2026-08-30`.
Sources: https://posthog.com/docs/libraries/js, https://posthog.com/docs/libraries/js/config

Choice for this project: **npm package**. Reasons: (a) the token comes from the Vite env layer, which the snippet cannot read without templating; (b) one versioned dependency instead of a copy-pasted bootstrap; (c) `before_send` and structured `autocapture` config are easier to type-check. The snippet's advantage (always-latest `array.js`) is moot because the npm build fetches the same lazy extensions from the same assets host. The cost is remembering to bump `posthog-js`.

### 2.2 The project token is public

The project API key (`phc_...`) "is safe to expose publicly"; the capture endpoints "are POST-only public endpoints that use your project token and do not return any sensitive data from your PostHog instance."
Sources: https://posthog.com/docs/feature-flags/remote-config, https://posthog.com/docs/api/capture

So a `VITE_`-prefixed variable inlined into the static bundle is the intended shape, not a leak.

### 2.3 Initialising inside a statically prerendered TanStack Start app

PostHog's TanStack Start guide installs `@posthog/react` and `posthog-node` and wraps the body in `<PostHogProvider apiKey=... options={{ api_host, defaults: '2026-05-30', capture_exceptions: true }}>` inside the root route's `RootDocument`.
Source: https://posthog.com/docs/libraries/tanstack-start

The web-analytics TanStack page uses env vars `VITE_POSTHOG_PROJECT_TOKEN` and `VITE_POSTHOG_HOST`, noting "If you're using Vite, prefixing variable names with `VITE_` ensures they are accessible in the frontend."
Sources: https://posthog.com/docs/web-analytics/installation/tanstack, https://posthog.com/docs/libraries/react

Why this is safe during prerender: `PostHogProvider` calls `init` inside a `useEffect`, with the source comment "The init needs to happen in a useEffect rather than useMemo, as useEffect does not happen during SSR." It also dedupes React StrictMode double-init via a `previousInitializationRef`, and if `apiKey` is empty it skips init and logs that it assumes manual initialisation.
Source: https://github.com/PostHog/posthog-js/blob/2d2294941c3a2ad564077ee4709cc3e562c888de/packages/react/src/context/PostHogProvider.tsx

Importing `posthog-js` at module scope in Node is also safe: the library's globals are defined as `typeof window !== 'undefined' ? window : undefined` with `document`/`navigator` read through optional chaining.
Source: https://github.com/PostHog/posthog-js/blob/2d2294941c3a2ad564077ee4709cc3e562c888de/packages/browser-common/src/utils/globals.ts

Two concrete shapes for this project, both satisfying rule 11 (all public pages statically generated):

1. **`@posthog/react` provider** as in the TanStack guide. Simplest; the effect-based init keeps it off the server. Downside: another package, and the provider's context is only useful if components call `usePostHog()`.
2. **Plain `posthog-js` in a root-route `useEffect`** calling the `initAnalytics()` function in the summary. No extra package; components import the `posthog` singleton for `capture` calls. The React docs' warning ("Do not directly import `posthog` apart from installation… the library might not be initialized yet") applies to calls before init, so keep any `capture` calls in event handlers or effects, never at module scope.
   Source: https://posthog.com/docs/libraries/react

Recommend shape 2 for a single-page marketing site; shape 1 if the team later wants hooks.

Do not use the `posthog-node` half of the TanStack guide: the site has no server runtime for public pages, and the only server work (form submission) is a separate ticket.

Pageviews: with `defaults: '2026-05-30'`, `capture_pageview` is `'history_change'`, which "will capture pageviews based on path changes by listening to the browser's history API" — correct for TanStack Router client navigation after hydration.
Source: https://posthog.com/docs/libraries/js/config

---

## 3. Reverse proxy through Cloudflare

### 3.1 What PostHog says

"You don't need a reverse proxy to start using PostHog. We recommend setting one up before going to production for more reliable data capture." Ad blockers block known analytics domains; a proxy on your own domain typically recovers "10–30% depending on your user base". Naming advice: "Choose a neutral subdomain that doesn't include words like `analytics`, `tracking`, `telemetry`, `posthog`, or `ph`." Always set both `api_host` (proxy) and `ui_host` (`https://us.posthog.com`) so toolbar links resolve.
Source: https://posthog.com/docs/advanced/proxy

### 3.2 Options on Cloudflare

**Managed reverse proxy (PostHog-hosted).** "This option is free for all PostHog Cloud users." Setup is a CNAME from your subdomain to a generated `*.proxy-us.posthog.com` host. But: it "is not HIPAA-compliant and should not be used to process Protected Health Information (PHI)", any BAA does not cover it, and traffic transits Cloudflare as a PostHog subprocessor.
Source: https://posthog.com/docs/advanced/proxy/managed-reverse-proxy

**Cloudflare Worker (self-hosted on your zone).** Documented Worker code proxies `/static/*` and `/array/*` to `us-assets.i.posthog.com` (cached via `caches.default`) and everything else to `us.i.posthog.com`, copying `CF-Connecting-IP` into `X-Forwarded-For` and deleting `cookie` and `authorization` headers. The doc assigns the Worker a custom domain such as `e.yourdomain.com`. An Enterprise-only alternative uses DNS plus three Page Rules with Host Header Override.
Source: https://posthog.com/docs/advanced/proxy/cloudflare

Cloudflare route patterns also allow a path prefix on the main zone (`example.com/hello/*` takes precedence over `example.com/*`), so `/ingest/*` on the site's own hostname is technically possible; PostHog's doc uses a subdomain and warns against obvious path names like `/analytics`, `/tracking`, `/telemetry`, `/posthog`.
Sources: https://developers.cloudflare.com/workers/configuration/routing/routes/, https://posthog.com/docs/advanced/proxy/cloudflare

Cloudflare Workers Free plan: 100,000 requests/day, 10 ms CPU per invocation; request-body limit is by account plan (100 MB on Free).
Source: https://developers.cloudflare.com/workers/platform/limits/

### 3.3 Is it worth it for v1?

No. Reasons, in order:
1. There is no Cloudflare zone or PostHog project yet (map: standing constraints), so the proxy cannot be built or tested now, and nothing in the SDK config changes later except `api_host`.
2. The managed proxy is off the table for a HIPAA-adjacent brand by PostHog's own statement, so the only option is the self-hosted Worker, which is a second deployable to own.
3. The Worker forwards the real client IP (`X-Forwarded-For`), so the proxy does not improve the privacy posture; it only improves capture rates.
4. The 10–30% figure is PostHog's general estimate; on a B2B site whose visitors are practice managers, blocker prevalence is unknown.

Spec consequence: keep `api_host` and `ui_host` in env so the switch is a config change. Revisit after launch if the pageview count looks implausibly low against server-side request counts.

---

## 4. Do Not Track, motion, and PII

### 4.1 `respect_dnt`

`respect_dnt` (default `false`): "Determines whether PostHog should respect the browser's Do Not Track setting when computing consent. When true, users with Do Not Track enabled are treated as opted out."
Source: https://posthog.com/docs/libraries/js/config

Source detail: when enabled it checks `navigator.doNotTrack`, `navigator.msDoNotTrack`, `window.doNotTrack`, and `navigator.globalPrivacyControl` (commented as "DNT replacement, EFF Privacy Badger, Firefox 120+. Possibly legally required").
Source: https://github.com/PostHog/posthog-js/blob/2d2294941c3a2ad564077ee4709cc3e562c888de/packages/browser/src/consent.ts (`_getDnt`, lines 128–139)

Caveat found in source, not in docs: `is_capturing()` returns `true` unconditionally when `cookieless_mode === 'always'`, and `capture()` gates only on `is_capturing()`. So in cookieless-always mode `respect_dnt` has no effect on whether events are sent.

```ts
is_capturing(): boolean {
    if (this.config.cookieless_mode === COOKIELESS_ALWAYS) {
        return true
    }
    ...
```
Source: https://github.com/PostHog/posthog-js/blob/2d2294941c3a2ad564077ee4709cc3e562c888de/packages/browser/src/posthog-core.ts (`is_capturing`, around line 4782; `capture`, line 1643)

If the team wants to honour DNT/GPC anyway (a reasonable stance for a healthcare-adjacent brand, and GPC is a legal opt-out signal under CCPA regulations), do it outside the SDK: check `navigator.globalPrivacyControl` / `navigator.doNotTrack === '1'` in `initAnalytics()` and return before `init`. That is four lines and independent of PostHog's consent model. (The CCPA-GPC point is my reading of the law, not a PostHog claim; PostHog's CCPA page does not mention GPC.)

### 4.2 `prefers-reduced-motion`

Irrelevant to PostHog itself: the SDK renders no UI for visitors. The toolbar is launched by injecting a token into the URL hash from the PostHog app and "it's not visible to your users." Surveys are the one PostHog feature that draws UI; `disable_surveys: true` prevents the surveys script from loading. Map rule 4 therefore has no PostHog surface to cover.
Sources: https://posthog.com/docs/toolbar, https://posthog.com/docs/libraries/js/config

### 4.3 What PostHog captures by default that counts as PII

- **IP address**: sent with every event, used for GeoIP. Controls: project setting Settings > Project > Privacy (or General) > "IP data capture configuration" / "Discard client IP data", and an org-level default for new projects ("EU organizations automatically default to IP data capture disabled"; US orgs configure it manually). Cookieless mode strips the IP before enrichment regardless.
  Sources: https://posthog.com/docs/product-analytics/privacy, https://posthog.com/docs/settings/organizations, https://posthog.com/docs/privacy/data-collection
- **URL, referrer, UTMs, GeoIP** on anonymous events: `$initial_current_url`, `$initial_pathname`, `$initial_referrer`, `$initial_referring_domain`, `$initial_host`, and GeoIP properties are retained on anonymous events. `$current_url` is the property PostHog's own privacy docs show being nulled in `before_send`.
  Sources: https://posthog.com/docs/data/anonymous-vs-identified-events, https://posthog.com/docs/product-analytics/privacy
- **Element text and attributes** via autocapture: `$el_text` (capped at 1024 chars) and `attr__*` on the clicked element chain, plus `attr__href` on links.
  Source: https://github.com/PostHog/posthog-js/blob/2d2294941c3a2ad564077ee4709cc3e562c888de/packages/browser/src/autocapture.ts (lines 97–124, 250–258)

`person_profiles` defaults to `'identified_only'`; `'never'` captures anonymous events for everything; calling `identify()`, `alias()`, `group()` or `setPersonProperties()` flips a user to identified. "Anonymous events can be up to 4x cheaper than identified ones."
Source: https://posthog.com/docs/data/anonymous-vs-identified-events

### 4.4 Keeping form field contents out

What PostHog already does:
- "To prevent accidental sensitive data capture, we do not automatically capture form values from form submissions."
  Source: https://posthog.com/docs/product-analytics/autocapture
- "We specifically only collect the `name`, `id`, and `class` attributes from input tags."
  Source: https://posthog.com/docs/product-analytics/privacy
- In source, `isSensitiveElement` treats every `input` except `button`/`checkbox`/`submit`/`reset`, plus `select`, `textarea`, and `contenteditable`, as sensitive; attributes other than `name`, `id`, `class`, `aria-label` are dropped for them. `shouldCaptureElement` refuses `type=hidden` and `type=password`, and any element with class `ph-sensitive` or `ph-no-capture` in its ancestry. `shouldCaptureValue` drops strings that look like credit-card or SSN numbers.
  Source: https://github.com/PostHog/posthog-js/blob/2d2294941c3a2ad564077ee4709cc3e562c888de/packages/browser-common/src/utils/autocapture-utils.ts (lines 455–515, 613–635)

What the spec should add:
- `class="ph-no-capture"` on the assessment form root so no `$autocapture` event (click, change, submit) originates inside it. Note the class also hides the element from session replay, which is moot here.
  Sources: https://posthog.com/docs/product-analytics/privacy, https://posthog.com/docs/session-replay/privacy
- `autocapture: { dom_event_allowlist: ['click'], element_allowlist: ['a', 'button'] }` so change/submit events on inputs are never generated at all.
  Source: https://posthog.com/docs/libraries/js/config
- Explicit `posthog.capture('assessment_submitted')` with no properties from the success handler; that is the only form signal analytics needs.
- `before_send` to strip query strings from `$current_url` (see summary config). PostHog documents `before_send` as "A function that allows you to amend or reject events before they are sent to PostHog."
  Source: https://posthog.com/docs/libraries/js/config
- Do not enable `capture_copied_text`; do not call `identify()`.
- `mask_all_text` / `mask_all_element_attributes` (both default `false`) are available if the client later objects to button labels appearing in PostHog; not needed for static marketing copy.
  Source: https://posthog.com/docs/libraries/js/config

---

## 5. US vs EU cloud, free tier, placeholder key

### 5.1 Region

Default `api_host` is `https://us.i.posthog.com`; the EU equivalents in PostHog's proxy docs are `eu.i.posthog.com` / `eu-assets.i.posthog.com`, and the app hosts are `us.posthog.com` / `eu.posthog.com`. "PostHog Cloud EU" is "hosted on servers based in Frankfurt", offered for GDPR data-residency. PostHog's CCPA page recommends "PostHog Cloud US for CCPA compliance".
Sources: https://posthog.com/docs/libraries/js/config, https://posthog.com/docs/advanced/proxy/cloudflare, https://posthog.com/docs/privacy/data-storage, https://posthog.com/docs/privacy/ccpa-compliance

Moving later is expensive: event migration between Cloud regions requires a support ticket and "is only available to customers on the Scale or Enterprise package".
Source: https://posthog.com/docs/migrate/migrate-to-cloud

Decision: **US Cloud**. US-only audience, US regulatory frame, and the region is effectively permanent on the free tier.

### 5.2 Free tier and prices

Monthly free allowance, "No credit card required", "Your free allowance renews every month. Yes, for everything. Yes, forever.", usage stops at the limit rather than billing:
- Product analytics: 1M events
- Session replay: 5K recordings
- Feature flags: 1M requests
- Surveys: 1,500 responses
- Error tracking: 100K exceptions
- Data warehouse: 1M rows
Source: https://posthog.com/pricing

Beyond free: product analytics 1–2M events at $0.0000500/event, decreasing to $0.0000090 at 250M+; session replay 5k–15k at $0.0050/recording.
Sources: https://posthog.com/product-analytics/pricing, https://posthog.com/session-replay/pricing

Platform add-ons: Boost $250/mo ("Unlimited projects, white labeling, HIPAA BAA, SSO enforcement…"), Scale $750/mo, Enterprise custom. BAAs are offered "for PostHog Cloud to users with the Boost, Scale, or Enterprise package"; a BAA "does not make your setup compliant on its own"; managed reverse proxies are excluded; PostHog AI features must be disabled for orgs handling PHI.
Sources: https://posthog.com/platform-addons, https://posthog.com/docs/privacy/hipaa-compliance

For a marketing site sending anonymous, cookieless, IP-stripped pageviews and CTA clicks, 1M events/month is orders of magnitude above need, and no BAA is warranted because no PHI reaches PostHog.

### 5.3 Running with a placeholder key until the project exists

Source behaviour: `_init` trims the token and, if it is empty, logs `PostHog was initialized without a token. This likely indicates a misconfiguration…` and returns without initialising. Every `capture()` on an uninitialised instance logs an "uninitialized" warning and returns.
Source: https://github.com/PostHog/posthog-js/blob/2d2294941c3a2ad564077ee4709cc3e562c888de/packages/browser/src/posthog-core.ts (`_init` lines 788–795; `capture` lines 1638–1641)

`@posthog/react`'s provider likewise skips init when `apiKey` is falsy.
Source: https://github.com/PostHog/posthog-js/blob/2d2294941c3a2ad564077ee4709cc3e562c888de/packages/react/src/context/PostHogProvider.tsx

Recommended env layer:
- `.env.example` ships `VITE_POSTHOG_PROJECT_TOKEN=` (empty) and `VITE_POSTHOG_HOST=https://us.i.posthog.com`.
- `initAnalytics()` returns early on an empty token (summary config), so local builds and the client's preview deploys run with analytics off and one console line, no network calls.
- When the project exists, set the real `phc_` token in the Cloudflare build environment; nothing else changes.

Do not use a fake non-empty token like `phc_placeholder`: the SDK would initialise, fetch remote config from `us-assets.i.posthog.com/array/<token>/config.js`, and POST events that PostHog rejects, all of which shows up as console noise and blocked-request errors. (The rejection response format is not documented; see below.)

---

## Not confirmed from a primary source

- **Sessions in `cookieless_mode: 'always'`.** The docs say sessions and replay are disabled "if the user has not given cookie consent", written in the context of `on_reject`. Source shows no `SessionIdManager` is created in `always` mode. Whether PostHog synthesises a session ID server-side for the web-analytics "sessions" and "bounce rate" tiles under `always` mode is not stated on any page I read. Treat session-level metrics as best-effort until observed in the real project.
- **Exact response to an invalid project token.** The capture API doc only says PostHog returns "a failure response if an error is encountered"; status code and body are not documented.
- **Anonymous vs identified per-event prices.** The product-analytics pricing page I fetched shows one event price table; the anonymous-vs-identified doc says anonymous events are "up to 4x cheaper". The page may render two tables client-side that the fetch did not capture. Irrelevant under the free tier.
- **Whether "Record user sessions" is off by default for a brand-new project.** Multiple pages say the setting must be enabled and that SDK calls are no-ops without it; none says what a fresh project starts with. `disable_session_recording: true` in the SDK makes the question moot.
- **Location of the IP setting.** Two docs pages give different paths (Settings > Project > Privacy vs Settings > Project > General) for "IP data capture configuration"; the toggle name "Discard client IP data" is consistent.
- **The `posthog-js` file line numbers** are from commit `2d2294941c3a2ad564077ee4709cc3e562c888de` (2026-09-04) and will drift; the permalinks above are pinned to that commit.
- **CCPA and GPC.** The statement that Global Privacy Control is a legal opt-out signal under CCPA regulations is general legal knowledge, not sourced from PostHog; PostHog's CCPA page does not discuss GPC or DNT.
