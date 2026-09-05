# 15 — How is the site deployed, and what is the provisioning checklist?

Type: grilling
Status: open
Blocked by: 03, 04, 05, 14

## Question

Decide the deploy shape and the ordered list of accounts to create later:

- Cloudflare project shape from the hosting research, build command, output directory, preview versus production, secrets.
- The provisioning checklist: Cloudflare account, domain purchase and DNS, Turnstile site, email path setup, Google Workspace mailbox, PostHog project. For each: what it produces (keys, IDs, records) and which env variable it fills.
- What can be verified before accounts exist, and what only after.

Produce the deploy plan and checklist as the resolution. A `wizard` skill run may follow when the accounts are created.
