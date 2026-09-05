# 04 — How does a Cloudflare Worker deliver a form submission to a Google Workspace inbox?

Type: research
Status: open

## Question

Google Workspace is the destination: when a visitor submits the Assessment Form, the email must arrive in the Execile Workspace mailbox. Establish from primary sources (Cloudflare docs, Google Workspace and Gmail API docs, provider docs):

- The candidate paths from a Worker to a Workspace inbox: Gmail API with a service account and domain-wide delegation; SMTP relay through Google's `smtp-relay.gmail.com` (Workers cannot open raw SMTP sockets without TCP sockets API, so check that); Cloudflare Email Routing or Workers email sending; a transactional provider (MailChannels, Resend, Postmark) sending to the Workspace address.
- For each path: what accounts and DNS records it needs (SPF, DKIM, DMARC, verified domain), cost, deliverability into a Workspace inbox, and whether it can be stubbed locally before any account exists.
- Cloudflare Turnstile server-side verification: the siteverify call, the secret handling, and the test keys that let local dev run without an account.
- A recommended path given: no accounts yet, one low-volume form, Turnstile in front, no PHI in the payload.

Record findings in `docs/research/worker-to-workspace-email.md`, each claim cited.
