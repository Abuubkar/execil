/**
 * Minimal declaration for the Worker env accessor.
 *
 * NOT generated with `wrangler types`: that emits a global Worker environment
 * which overrides DOM lib types across the whole project — it broke
 * `document.head.append()` in client code. Declaring only what the server
 * route needs keeps the two environments from colliding.
 */
declare module 'cloudflare:workers' {
  export const env: {
    TURNSTILE_SECRET?: string
    TURNSTILE_HOSTNAME?: string
    ASSESSMENT_TO?: string
    RESEND_FROM?: string
    RESEND_API_KEY?: string
  }
}
