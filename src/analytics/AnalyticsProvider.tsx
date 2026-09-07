import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'

const POSTHOG_PROJECT_TOKEN = import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN
const POSTHOG_HOST = import.meta.env.VITE_PUBLIC_POSTHOG_HOST

if (import.meta.env.DEV) {
  /**
   * `window.posthog` exists only with the script-tag install; the npm build
   * never assigns it, so `posthog.capture(...)` in devtools throws
   * ReferenceError. That is a debugging trap, not a design choice.
   *
   * This is the same object the provider drives: given an `apiKey`,
   * PostHogProvider resolves `getDefaultPostHogInstance()` — the `posthog-js`
   * default export — and calls `init` on it. So the console gets the real
   * client, not a second uninitialised one.
   *
   * `import.meta.env.DEV` is statically false in a production build, so this
   * block is dropped rather than shipped and skipped.
   */
  Object.assign(globalThis, { posthog })

  /** Warn, never throw. Missing analytics config must not stop the dev server:
   *  a fresh clone with no PostHog account is a supported state. */
  for (const [name, value] of [
    ['VITE_PUBLIC_POSTHOG_PROJECT_TOKEN', POSTHOG_PROJECT_TOKEN],
    ['VITE_PUBLIC_POSTHOG_HOST', POSTHOG_HOST],
  ] as const) {
    if (!value) {
      console.warn(`${name} is not set. PostHog will not load and no events will be captured.`)
    }
  }
}

/**
 * The only component that knows PostHog exists. `__root` renders this; every
 * other file reaches analytics through `useTrack()`, which is what keeps the
 * event vocabulary in `events.ts` a closed union rather than a convention.
 *
 * Missing configuration renders the tree untouched rather than failing, so the
 * site runs with no PostHog account.
 */
export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  if (!POSTHOG_PROJECT_TOKEN || !POSTHOG_HOST) return children

  return (
    <PostHogProvider
      apiKey={POSTHOG_PROJECT_TOKEN}
      options={{
        api_host: POSTHOG_HOST,
        // Only consulted when `api_host` is a reverse proxy, which it is not
        // yet. Set now so switching the proxy on is a change to one variable
        // rather than a two-part edit that can be half-done. See section 3 of
        // docs/research/posthog-static.md.
        ui_host: 'https://us.posthog.com',
        defaults: '2026-05-30',

        // No cookies, no local/session storage, no persistent identifier.
        // Requires "Cookieless server hash mode" ON in project settings, or
        // events are sent and then dropped at ingestion with nothing visible
        // in the browser.
        cookieless_mode: 'always',
        person_profiles: 'never',

        // Pinned rather than inherited from `defaults`: this site navigates
        // with plain anchors today, so it changes nothing, but it becomes
        // load-bearing the moment any route goes client-side.
        capture_pageview: 'history_change',

        capture_exceptions: true,
        debug: import.meta.env.DEV,
      }}
    >
      {children}
    </PostHogProvider>
  )
}
