import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'

const POSTHOG_PROJECT_TOKEN = import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN
const POSTHOG_HOST = import.meta.env.VITE_PUBLIC_POSTHOG_HOST

/**
 * `window.posthog` exists only with the script-tag install; the npm build never
 * assigns it, so `posthog.capture(...)` in devtools throws ReferenceError. That
 * is a debugging trap, not a design choice, so expose it here.
 *
 * This is the same object the provider drives: given an `apiKey`,
 * PostHogProvider resolves `getDefaultPostHogInstance()` — the `posthog-js`
 * default export — and calls `init` on it. So the console gets the real client,
 * not a second uninitialised one.
 *
 * DEV only. `import.meta.env.DEV` is statically false in a production build, so
 * this block is dropped entirely rather than shipped and skipped.
 */
if (import.meta.env.DEV) {
  Object.assign(globalThis, { posthog })
}

if (import.meta.env.DEV) {
  if (!POSTHOG_PROJECT_TOKEN) {
    throw new Error(
      'VITE_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_PROJECT_TOKEN is configured',
    )
  }

  if (!POSTHOG_HOST) {
    throw new Error(
      'VITE_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_HOST is configured',
    )
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
        defaults: '2025-05-24',
        capture_exceptions: true,
        cookieless_mode: 'always',
        debug: import.meta.env.DEV,
        tracing_headers: typeof window !== 'undefined' ? [window.location.hostname] : [],
      }}
    >
      {children}
    </PostHogProvider>
  )
}
