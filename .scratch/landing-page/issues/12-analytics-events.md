# 12 — What does PostHog track, and how is it initialised?

Type: grilling
Status: open
Blocked by: 05

## Question

Decide the event list and the initialisation given the PostHog research:

- Events: page view, CTA clicks by location, FAQ opens, form start, form submit success and failure, phone link clicks. Properties per event, with no PII and no form values.
- Initialisation: cookieless configuration, where it runs (client only, after hydration), placeholder key handling until the project exists.
- Whether to proxy through Cloudflare in v1.

Produce the event table and config as the resolution.
