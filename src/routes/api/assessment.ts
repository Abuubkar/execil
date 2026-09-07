import { env } from 'cloudflare:workers'
import { createFileRoute } from '@tanstack/react-router'
import { Resend } from 'resend'

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
  TURNSTILE_HOSTNAME?: string
  ASSESSMENT_TO?: string
  RESEND_FROM?: string
  RESEND_API_KEY?: string
}

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

/** Binds a token to this one form. A token minted against another surface
 *  sharing the sitekey is rejected. Must match the `action` passed to
 *  `turnstile.render` in the Assessment section. */
const TURNSTILE_ACTION = 'assessment'

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

        const verifyBody = new URLSearchParams({ secret, response: token })
        // CF-Connecting-IP rather than X-Forwarded-For: on Workers this is the
        // header Cloudflare sets itself and a client cannot forge.
        const ip = request.headers.get('CF-Connecting-IP')
        if (ip) verifyBody.append('remoteip', ip)

        let verdict: { success?: boolean; hostname?: string; action?: string }
        try {
          const verifyResponse = await fetch(TURNSTILE_VERIFY_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            // Without this a hung siteverify hangs the submission with it.
            signal: AbortSignal.timeout(10_000),
            body: verifyBody,
          })
          verdict = await verifyResponse.json()
        } catch {
          return json({ ok: false, error: 'challenge' }, 403)
        }

        // Cloudflare requires all three, not just `success`: an approved
        // hostname, and the action the token was minted for.
        //
        // The hostname check is what stops a token minted on localhost being
        // spent here. Turnstile adds localhost and 127.0.0.1 to every widget
        // automatically and they cannot be removed, and the sitekey is public,
        // so without it anyone could solve a challenge on their own machine and
        // post the token to production.
        //
        // Both are skipped in DEV because they cannot be satisfied there:
        // Cloudflare's TEST keys answer with hostname "example.com" and no
        // `action` at all, whatever the widget was rendered with. `success` is
        // still required. import.meta.env.DEV is statically false in a
        // production build, so this relaxation cannot ship.
        const hostnameAndActionMatch =
          verdict.action === TURNSTILE_ACTION && verdict.hostname === bindings.TURNSTILE_HOSTNAME
        if (!verdict.success || !(hostnameAndActionMatch || import.meta.env.DEV)) {
          return json({ ok: false, error: 'challenge' }, 403)
        }

        // 3. Revalidate everything independently of the client.
        const { values, fields } = validate(form)
        if (Object.keys(fields).length > 0) {
          return json({ ok: false, error: 'validation', fields }, 400)
        }

        // 4. Deliver through Resend. Its verification records live on
        //    send.<domain>, so the apex MX and SPF carrying the mailbox are
        //    untouched -- an MX only affects the name it sits on.

        // A local run NEVER calls Resend, even with a real key in .dev.vars.
        // Development must not put mail in the client's inbox, and a working
        // key on a developer's machine is otherwise one submit away from doing
        // exactly that. Logs the message instead and reports success, so the
        // form's success path stays exercisable offline.
        //
        // `import.meta.env.DEV` is statically false in a production build, so
        // this branch is removed at build time rather than shipped behind a
        // runtime check that could be reached by spoofing a header.
        if (import.meta.env.DEV) {
          console.info(
            [
              'assessment: DRY RUN — not sending, this is a local build',
              `  from:    ${bindings.RESEND_FROM ?? '(unset)'}`,
              `  to:      ${bindings.ASSESSMENT_TO ?? '(unset)'}`,
              `  replyTo: ${values.email}`,
              `  subject: New assessment request — ${values.practice || values.name}`,
              '',
              plainTextBody(values),
            ].join('\n'),
          )
          return json({ ok: true }, 200)
        }

        const apiKey = bindings.RESEND_API_KEY
        if (!apiKey) {
          // No key locally or in preview. The submission cannot be delivered,
          // so the UI offers the mailto fallback rather than pretending
          // success.
          return json({ ok: false, error: 'delivery' }, 502)
        }

        try {
          const { error } = await new Resend(apiKey).emails.send({
            from: bindings.RESEND_FROM ?? '',
            to: [bindings.ASSESSMENT_TO ?? ''],
            replyTo: values.email,
            subject: `New assessment request — ${values.practice || values.name}`,
            text: plainTextBody(values),
          })

          // The SDK RESOLVES on an API error, returning it in `error` rather
          // than throwing. Without this check a rejected send would look like
          // success and the visitor would be told their request was delivered.
          if (error) throw new Error(error.message)
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
