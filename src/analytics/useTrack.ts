import { usePostHog } from 'posthog-js/react'
import { useCallback } from 'react'

import type { AnalyticsEvent } from './events'

/**
 * The single way feature code sends an event.
 *
 * Using the hook rather than importing the `posthog` singleton is what the
 * React SDK asks for — a direct import can run before the client is
 * initialised. Taking an `AnalyticsEvent` rather than `(name, props)` is what
 * keeps the vocabulary closed: there is no overload accepting a free-form name
 * or arbitrary properties.
 *
 * NEVER call `identify()`. This site has no accounts and no stable visitor
 * identifier, and the assessment form's values must never become one.
 */
export function useTrack(): (event: AnalyticsEvent) => void {
  const posthog = usePostHog()

  return useCallback(
    (event: AnalyticsEvent) => {
      posthog?.capture(event.name, event.props)
    },
    [posthog],
  )
}
