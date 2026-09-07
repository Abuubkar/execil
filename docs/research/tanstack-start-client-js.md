# TanStack Start client JS on a prerendered page

Investigated 2026-09-05 for [issue #18](https://github.com/Abuubkar/execil/issues/18). Numbers are **measured from a real production build**, not estimates: a probe app matching TanStack's own `react-start.minimal` benchmark scenario plus the assessment form.

Versions: `react` 19.2.8, `react-dom` 19.2.8, `@tanstack/react-router` 1.170.32, `@tanstack/react-start` 1.168.49, `@tanstack/router-core` 1.171.27, Vite 8.2.2 (Rolldown), `tanstackStart({ prerender: { enabled: true } })`.

## Measured

| Layer (prerendered, production) | raw | gzip | brotli |
|---|---|---|---|
| React 19 + react-dom 19 (`hydrateRoot` + tiny component) | 191.1 kB | 59.5 kB | 51.2 kB |
| + `@tanstack/react-router` (RouterProvider, 1 route) | 266.6 kB | 84.7 kB | 73.9 kB |
| + `@tanstack/react-start` — full prerendered page | 312.5 kB | 98.9 kB | 85.9 kB |
| Same, with the real assessment form | 313.1 kB | **99.1 kB** | **86.1 kB** |
| *Vanilla equivalent: the form handler alone, minified* | 247 B | 212 B | **136 B** |

Router adds ~25.2 kB gzip on top of React; Start adds a further ~14.2 kB. Combined TanStack client runtime ≈ **39.4 kB gzip / 34.7 kB brotli**.

**The floor is entirely framework.** A route with zero interactivity measured 98.9 kB gzip — statistically identical to the version with the form. Application code is ~250 bytes gzipped.

## There is no supported way to skip hydration

A prerendered page hydrates exactly like an SSR page: same client entry `<script type="module" async>`, same modulepreloads, same inline `$_TSR.router` payload.

The feature that would fix this is [PR #6092, "page-level hydration via `hydrate` route option"](https://github.com/TanStack/router/pull/6092) — `hydrate: false` per route, `defaultHydrate` on the router, explicitly skipping "hydration-specific client assets". It is **open and unmerged**. Confirmed two ways: a GitHub code search for `defaultHydrate` on `TanStack/router` returns 0 results, and grep across the installed packages finds nothing. Its own caveat: even once merged it controls initial load only and does not remove route code from the client bundle.

The [Static Prerendering docs](https://tanstack.com/start/latest/docs/framework/react/guide/static-prerendering) are **silent** on hydration and client bundles — the behaviour above is observed from build output, not a documented claim.

## Levers, and why none of them work here

- **[Deferred hydration](https://tanstack.com/start/latest/docs/framework/react/guide/deferred-hydration) is a trap.** It reads like the answer and measurably is not. Wrapping the form in `<Hydrate when={interaction()}>` left the eager entry at 98.9 kB gzip and made the *total* slightly **larger** (101.96 kB) by adding a second chunk. It defers when component code runs; the React + Router runtime stays eager. The docs never state this.
- **[Code splitting](https://tanstack.com/router/latest/docs/framework/react/guide/code-splitting) / `autoCodeSplitting`** splits non-critical route config only. Reallocates chunks; does not shrink the runtime.
- **[Selective SSR](https://tanstack.com/start/latest/docs/framework/react/guide/selective-ssr)** (`ssr: false` / `'data-only'`) controls server rendering, not client JS. Makes things worse here — less HTML, same JS.
- **[SPA mode](https://tanstack.com/start/latest/docs/framework/react/guide/spa-mode)** explicitly does not reduce client JS.
- **Skipping the router** is not available within Start; file-based routing is the framework. Router without Start still costs ~84.7 kB gzip.

## Prerendered HTML plus a vanilla script

Not achievable within TanStack Start today. Route `scripts` / `head.scripts` lets you *add* a script tag, so the 212-byte handler is easy to inject — but nothing shipped lets you *remove* the client entry. You would pay ~99 kB gzip to add 212 bytes. The vanilla-only outcome means not using TanStack Start for this page.

## Bottom line

For a page whose only real JS need is a form handler and a PostHog init, TanStack Start costs **~86 kB brotli of framework to deliver ~136 bytes of functionality** — roughly 600× overhead. Every documented lever redistributes that cost rather than removing it.

## Also noted

[Issue #7527](https://github.com/TanStack/router/issues/7527): Start's ISR/cache-header docs are wrong for Cloudflare because Workers run *in front of* the CDN. Does not affect this site — pure Static Assets serving sidesteps it — but the CF hosting docs should not be trusted uncritically if dynamic routes are added later.

## Sources

[Static Prerendering](https://tanstack.com/start/latest/docs/framework/react/guide/static-prerendering) · [Selective SSR](https://tanstack.com/start/latest/docs/framework/react/guide/selective-ssr) · [Execution Model](https://tanstack.com/start/latest/docs/framework/react/guide/execution-model) · [Deferred Hydration](https://tanstack.com/start/latest/docs/framework/react/guide/deferred-hydration) · [SPA mode](https://tanstack.com/start/latest/docs/framework/react/guide/spa-mode) · [Code Splitting](https://tanstack.com/router/latest/docs/framework/react/guide/code-splitting) · [PR #6092](https://github.com/TanStack/router/pull/6092) · [issue #7527](https://github.com/TanStack/router/issues/7527) · [bundle-size benchmarks](https://github.com/TanStack/router/tree/main/benchmarks/bundle-size)
