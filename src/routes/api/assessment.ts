import { env } from 'cloudflare:workers'
import { createFileRoute } from '@tanstack/react-router'

/**
 * The Assessment Form endpoint. No component, so it is excluded from prerender
 * discovery and stays live in the Worker. See issue #28.
 *
 * The response contract is a discriminated union the UI maps straight onto its
 * states (issue #12).
 */
export type AssessmentResult =
  | { ok: true }
  | { ok: false; error: 'validation'; fields: Record<string, string> }
  | { ok: false; error: 'challenge' | 'rate' | 'delivery' }

/** What the Worker environment supplies. Declared rather than cast, so a
 *  missing binding is a type error instead of "[object Object]" in an email. */
type AssessmentEnv = {
  TURNSTILE_SECRET?: string
  ASSESSMENT_TO?: string
  SENDER_DOMAIN?: string
  EMAIL?: { send: (message: Record<string, string>) => Promise<unknown> }
}

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

/** Server-side caps. Client validation is a convenience, never a guard. */
const LIMITS = {
  name: 200,
  email: 254,
  phone: 40,
  practice: 200,
  specialty: 100,
  providers: 40,
  concern: 100,
  message: 2000,
} as const

type FieldName = keyof typeof LIMITS
const FIELD_NAMES = Object.keys(LIMITS) as FieldName[]
const REQUIRED: readonly FieldName[] = ['name', 'email']

const json = (body: AssessmentResult, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json',
      // _headers does not apply to Worker responses, so this is set here.
      'cache-control': 'no-store',
    },
  })

const readString = (form: FormData, key: string): string => {
  const value = form.get(key)
  return typeof value === 'string' ? value.trim() : ''
}

/** Deliberately loose: the only job is rejecting obvious nonsense. Anything
 *  stricter rejects valid addresses. */
const looksLikeEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

function validate(form: FormData) {
  const values = {} as Record<FieldName, string>
  const fields: Record<string, string> = {}

  for (const name of FIELD_NAMES) {
    const value = readString(form, name)
    if (value.length > LIMITS[name]) {
      fields[name] = 'too_long'
      continue
    }
    values[name] = value
  }

  for (const name of REQUIRED) {
    // Don't overwrite a length failure: a 250-character name is too_long, not
    // required, and reporting the wrong reason would send the visitor looking
    // for an empty field.
    if (!fields[name] && !values[name]) fields[name] = 'required'
  }
  if (values.email && !looksLikeEmail(values.email)) fields.email = 'invalid'

  return { values, fields }
}

function plainTextBody(values: Record<FieldName, string>): string {
  return FIELD_NAMES.filter((name) => values[name])
    .map((name) => `${name}: ${values[name]}`)
    .join('\n')
}

export const Route = createFileRoute('/api/assessment')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // `cloudflare:workers` is the documented accessor inside Start server
        // code. globalThis.env is NOT populated: reading it yields an empty
        // secret, which short-circuits every submission to "challenge" and
        // looks exactly like a Turnstile failure.
        const bindings: AssessmentEnv = env
        const form = await request.formData()

        // 1. Honeypot. Visually hidden and out of the tab order; a real
        //    visitor never fills it.
        if (readString(form, 'company_website')) {
          return json({ ok: false, error: 'validation', fields: {} }, 400)
        }

        // 2. Turnstile. Server-side verification is mandatory, and an empty
        //    client sitekey must NOT disable it.
        const token = readString(form, 'cf-turnstile-response')
        const secret = bindings.TURNSTILE_SECRET ?? ''
        if (!token || !secret) {
          return json({ ok: false, error: 'challenge' }, 403)
        }

        const verifyBody = new FormData()
        verifyBody.append('secret', secret)
        verifyBody.append('response', token)
        const ip = request.headers.get('CF-Connecting-IP')
        if (ip) verifyBody.append('remoteip', ip)

        const verifyResponse = await fetch(TURNSTILE_VERIFY_URL, {
          method: 'POST',
          body: verifyBody,
        })
        const verdict = (await verifyResponse.json()) as {
          success?: boolean
          hostname?: string
        }
        if (!verdict.success) {
          return json({ ok: false, error: 'challenge' }, 403)
        }

        // 3. Revalidate everything independently of the client.
        const { values, fields } = validate(form)
        if (Object.keys(fields).length > 0) {
          return json({ ok: false, error: 'validation', fields }, 400)
        }

        // 4. Deliver. Sender is on the Email Routing subdomain so the apex MX
        //    stays with Google.
        const email = bindings.EMAIL
        if (!email) {
          // Locally wrangler simulates the binding; if it is genuinely absent
          // the submission cannot be delivered and the UI offers the mailto
          // fallback rather than pretending success.
          return json({ ok: false, error: 'delivery' }, 502)
        }

        try {
          await email.send({
            from: `assessment@forms.${bindings.SENDER_DOMAIN ?? 'example.com'}`,
            to: bindings.ASSESSMENT_TO ?? '',
            replyTo: values.email,
            subject: `New assessment request — ${values.practice || values.name}`,
            text: plainTextBody(values),
          })
        } catch {
          // Field NAMES and outcomes only — never values. No message body,
          // email address or field value is ever logged (issue #12).
          console.error('assessment: delivery failed', {
            fields: FIELD_NAMES.filter((name) => values[name]),
          })
          return json({ ok: false, error: 'delivery' }, 502)
        }

        return json({ ok: true }, 200)
      },
    },
  },
})
