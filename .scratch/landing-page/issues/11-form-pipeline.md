# 11 — What is the Assessment Form pipeline end to end?

Type: grilling
Status: open
Blocked by: 03, 04

## Question

From the visitor's keystroke to the Google Workspace inbox. Decide:

- Fields, required flags and validation, on the client and again in the Worker. Confirm no PHI is collected and say so in the copy.
- Turnstile placement, widget mode, and server verification.
- The endpoint: shape, method, payload, rate limiting, error responses.
- Email content and subject, reply-to set to the visitor, and the destination inbox address config.
- Success, error and pending states in the UI, matching the canvas's inline confirmation.
- Local development with no accounts: Turnstile test keys, a stubbed email transport, env variable names.

Produce the pipeline description as the resolution.
