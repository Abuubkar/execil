import type { AnalyticsEvent } from './events'

const TOKEN = import.meta.env.VITE_POSTHOG_PROJECT_TOKEN ?? ''

type PostHogClient = {
  init: (token: string, options: Record<string, unknown>) => void
  capture: (name: string, props?: Record<string, unknown>) => void
}

let client: PostHogClient | null = null

/**
 * Client-only, after hydration, on idle. Never runs during prerender.
 *
 * An empty token makes this a no-op, so the whole application runs with no
 * PostHog account — the map's standing constraint.
 */
export function initAnalytics(): void {
  if (!TOKEN || client) return

  const start = () => {
    void import('posthog-js').then(({ default: posthog }) => {
      posthog.init(TOKEN, {
        api_host: 'https://us.i.posthog.com',
        ui_host: 'https://us.posthog.com',
        defaults: '2026-05-30',

        // No cookies, no local/session storage, no persistent identifier.
        // This is what removes the need for a consent banner (issue #13).
        cookieless_mode: 'always',
        person_profiles: 'never',

        // OFF deliberately. Every interactive element on this page is already
        // enumerated, so there is nothing to discover; what autocapture would
        // add is events keyed on DOM selectors, pushing the page's marketing
        // copy into the analytics product as event data.
        autocapture: false,
        disable_surveys: true,
        capture_heatmaps: false,
        disable_session_recording: true,

        capture_pageview: 'history_change',
        // Carries max scroll depth — the most useful single signal here.
        capture_pageleave: true,
        capture_dead_clicks: true,
        rageclick: true,
      })
      client = posthog as unknown as PostHogClient
    })
  }

  // Idle, so measurement never competes with LCP.
  const idle = (globalThis as { requestIdleCallback?: (cb: () => void) => void })
    .requestIdleCallback
  if (idle) idle(start)
  else globalThis.setTimeout(start, 1200)
}

/** NEVER call identify(): in cookieless mode it would defeat the whole
 *  arrangement by creating a persistent identifier. */
export function track(event: AnalyticsEvent): void {
  client?.capture(event.name, event.props)
}
