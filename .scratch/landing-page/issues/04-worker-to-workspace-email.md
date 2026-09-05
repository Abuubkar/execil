# 04 — How does a Cloudflare Worker deliver a form submission to a Google Workspace inbox?

Type: research
Status: resolved

## Question

Google Workspace is the destination: when a visitor submits the Assessment Form, the email must arrive in the Execile Workspace mailbox. Establish from primary sources (Cloudflare docs, Google Workspace and Gmail API docs, provider docs):

- The candidate paths from a Worker to a Workspace inbox: Gmail API with a service account and domain-wide delegation; SMTP relay through Google's `smtp-relay.gmail.com` (Workers cannot open raw SMTP sockets without TCP sockets API, so check that); Cloudflare Email Routing or Workers email sending; a transactional provider (MailChannels, Resend, Postmark) sending to the Workspace address.
- For each path: what accounts and DNS records it needs (SPF, DKIM, DMARC, verified domain), cost, deliverability into a Workspace inbox, and whether it can be stubbed locally before any account exists.
- Cloudflare Turnstile server-side verification: the siteverify call, the secret handling, and the test keys that let local dev run without an account.
- A recommended path given: no accounts yet, one low-volume form, Turnstile in front, no PHI in the payload.

Record findings in `docs/research/worker-to-workspace-email.md`, each claim cited.

## Answer

Full findings: [docs/research/worker-to-workspace-email.md](../../../docs/research/worker-to-workspace-email.md), including a comparison table of all paths.

- **Recommended path:** Cloudflare Email Service's Workers `send_email` binding (`env.EMAIL.send(...)`) on the free "verified destination address" lane. The Workspace mailbox is added as a verified destination in the Cloudflare account; sends to it are free and unmetered on every plan, Workers Free included. No SMTP, no third-party account, no API key.
- **Sending domain:** the free lane sends only from a routing domain, and Email Routing on the apex would replace Google's MX records. So enable Email Routing on a subdomain such as `forms.<brand-domain>` and send from there. Cloudflare writes that subdomain's MX, SPF and DKIM itself; Google's apex records stay untouched.
- **Turnstile:** a `fetch` to `siteverify` with the secret in a Worker secret. Cloudflare's dummy sitekey and secret pairs run the whole flow on localhost.
- **Local dev with no accounts:** `wrangler dev` simulates the email binding (console plus local files); real sends are opt-in with `remote: true`. Nothing blocks on accounts.
- **Runner-up:** Resend (free tier 3,000/month, 100/day) over plain HTTPS if a dedicated mail vendor is preferred. Postmark (100/month, manual approval) and MailChannels (paid since 2024) are weaker.
- **Rejected:** Gmail API with a service account and domain-wide delegation (super-admin delegation, key-creation org policy, JWT signing in the Worker) and SMTP relay via `connect()` (port 25 blocked, no fixed egress IP).
- **Unconfirmed:** whether a routing subdomain satisfies the free lane's "from your routing domains" rule (fallback: Workers Paid at $5/month plus Email Sending onboarding, which adds an apex `_dmarc p=reject` record); Email Sending's beta status; whether ports 465/587 are open from Workers. Verify when the Cloudflare account exists.
