# Worker to Google Workspace email

Research ticket: `.scratch/landing-page/issues/04-worker-to-workspace-email.md`. Investigated 2026-09-05 against primary sources (Cloudflare docs, Google Workspace and Gmail API docs, provider docs). Google Workspace is the *destination* inbox; the question is how the Cloudflare Worker that receives the Assessment Form submission gets an email into it.

## Summary and recommendation

**Recommended path: Cloudflare Email Service, Workers `send_email` binding, "verified destination address" lane.**

1. The Worker calls `env.EMAIL.send({ from, to, subject, text, html })`. No SMTP, no third-party account, no API key to rotate. [1]
2. The Workspace mailbox that should receive submissions is added as a *verified destination address* in the Cloudflare account (Cloudflare emails it a verification link). Sends to verified destination addresses are free on every plan, including Workers Free, and do not count toward any quota or daily limit. [2][3][4]
3. Sending from a domain requires that domain to be onboarded to Email Service. On the free lane "you can only send from your routing domains", and Email Routing on the apex would replace Google's MX records, so the sending domain must be a *subdomain* enabled for Email Routing (for example `forms.<brand-domain>`), leaving the apex MX pointed at Google. Cloudflare writes the subdomain's MX, SPF and DKIM records itself. [3][5][6]
4. Turnstile sits in front: the Worker POSTs the token to `siteverify` with the secret from a Worker secret; Cloudflare's dummy sitekey/secret pairs make the whole flow run on `localhost` with no account. [7][8]
5. Local development needs no account at all: `wrangler dev` simulates the email binding and writes the message to the console and local files. Real sends during dev are opt-in via `remote: true`. [9]

If the client later wants to send *to* arbitrary addresses (for example an auto-reply to the visitor), the same code keeps working after (a) upgrading to Workers Paid (USD 5/month, 3,000 emails/month included) and (b) onboarding the apex or a subdomain for Email Sending, which adds `cf-bounce` MX/SPF/DKIM records plus a `_dmarc` `p=reject` record. [4][6][10]

**Runner-up:** Resend (free: 3,000/month, 100/day) called over plain `fetch` with a Bearer key. It needs its own account, its own domain verification (DKIM + SPF/MX or CNAME records on a subdomain), and a key in a Worker secret; it wins only if the team prefers a vendor with a mail-specific dashboard over Cloudflare's beta. [11][12][13]

**Rejected for this project:** Gmail API with a service account and domain-wide delegation (a Google Cloud project, a super-admin delegation step, a downloadable RSA key that new Google Cloud organisations block by default, and a JWT signing routine in the Worker, all to deliver one low-volume form) and SMTP relay through Google (Workers block outbound port 25; ports 465/587 are not documented as blocked but would require a hand-written SMTP client over `connect()` plus an app password or IP allowlist, and Workers have no fixed egress IP). [14][15][16][17][18]

## Constraints this answers

From the ticket and `.scratch/landing-page/map.md`: no accounts exist yet (Cloudflare, domain, Workspace); one low-volume form; Turnstile in front; no PHI in the payload; the build must run locally with a config/env layer that accepts credentials later.

## Baseline facts about the Worker side

- **No raw SMTP on port 25.** "By default, Workers cannot create outbound TCP connections on port `25` to send email to SMTP mail servers." The `connect()` API supports `secureTransport: "on" | "starttls"` and lists SMTP among protocols it can speak, but the docs do not say whether 465/587 are open. [14]
- **Secrets.** Production secrets are set with `npx wrangler secret put <KEY>`; local values live in `.dev.vars` (or `.env`, not both), and `.dev.vars*` / `.env*` must be gitignored. [19]
- **Local dev.** `wrangler dev` runs the Worker locally with bindings simulated; "remote bindings" (`remote: true` per binding) make a local Worker talk to real Cloudflare resources and need authentication. [20]
- **Workers pricing.** Free: 100,000 requests/day, 10 ms CPU per invocation. Paid: USD 5/month minimum, 10 M requests included. [10]
- **Web Crypto.** RSASSA-PKCS1-v1_5 `sign()` and `importKey()` are supported, so a Google service-account JWT can be signed in a Worker if that path were chosen. [21]

## Path A: Cloudflare Email Service (Workers binding)

Cloudflare folded Email Routing and the new Email Sending product into "Email Service". Email Sending is in **Beta** and "Available on Workers Paid plan"; Email Routing is on Free and Paid. The banner on the same page: "Sending to verified destination addresses in your account is free on all plans, even when only Email Routing is configured." [2] Email Sending entered public beta on 2026-04-16; SMTP submission (`smtp.mx.cloudflare.net:465`) went beta 2026-06-08; Queues event subscriptions and an activity-log preview landed July 2026. [22]

**API.** `send(message: EmailMessage | EmailMessageBuilder): Promise<EmailSendResult>`; the builder takes `to`, `from`, `subject`, `text`, `html`, `cc`, `bcc`, `replyTo`, `headers`, `attachments`; the result carries `messageId`; errors throw with `.code` (for example `E_SENDER_NOT_VERIFIED` "Attempting to send from unverified domain", `E_SENDER_DOMAIN_NOT_AVAILABLE` "Domain not onboarded to Email Service", `E_RECIPIENT_SUPPRESSED`). The older raw-MIME `EmailMessage` API "remains supported for backward compatibility"; "For new code, prefer the structured `send()` method". [1][23]

**Binding.** `{"send_email": [{"name": "EMAIL"}]}`; optional `destination_address` (single fixed recipient, used when `to` is null), `allowed_destination_addresses`, `allowed_sender_addresses`. "The sender address must always belong to a domain you have onboarded to Email Service." "No restriction attribute: The binding can send to any verified destination address in your account." For this project `destination_address` pinned to the Workspace mailbox is the safest shape. [5]

**Recipient rule.** "Before you onboard a sending domain, you can send emails only to verified destination addresses in your account. After you onboard a sending domain, you can send to any recipient immediately." "Sends to verified destination addresses are always free: they do not count toward your monthly quota or your daily sending limits, on any plan, including when only Email Routing is configured. You can only send from your routing domains." [3]

**Verified destination addresses.** Added under Compute > Email Service > Email Routing > Destination Addresses; Cloudflare emails a link and "Until a destination address is verified, any routing rule that points to it stays disabled." Addresses are account-level and reusable across domains; limit 200 per account. [24][3]

**Accounts and DNS.**
- The domain must be on Cloudflare DNS. [6]
- *Email Routing onboarding* (needed for the free lane's "routing domain") writes on the chosen name: MX to `route1/2/3.mx.cloudflare.net`, `TXT "v=spf1 include:_spf.mx.cloudflare.net ~all"`, and a DKIM key at `cf2024-1._domainkey`. "Email Routing requires Cloudflare MX records ... Cannot use Email Routing with external mail servers." Therefore it cannot be enabled on the apex that Google Workspace receives mail for; enable it on a subdomain instead: the Subdomains page says Cloudflare "adds the required DNS records to the subdomain" and routing rules then work "in the same way as on the apex domain". Up to 30 domains per zone across Routing and Sending. [6][25]
- *Email Sending onboarding* (only needed for arbitrary recipients) writes records on `cf-bounce.<domain>` (MX to Cloudflare, SPF `include:_spf.mx.cloudflare.net`, DKIM at `cf-bounce._domainkey`) plus `TXT _dmarc.<domain> "v=DMARC1; p=reject;"`. Because SPF lives on the `cf-bounce` subdomain, the apex SPF record Google needs is untouched; the `_dmarc` record, however, is apex-wide, so Google's own mail must be DKIM-aligned (it is, via `google._domainkey`), and the client should know a reject policy is being set. The troubleshooting page lists `google._domainkey` alongside Cloudflare's selectors as coexisting. [6][26]

**Cost.** Workers Free: outbound sending "Not available", inbound unlimited. Workers Paid: "3,000 included per month, then $0.35 per 1,000 emails". "Sends to verified destination addresses are free and do not count toward the included quota." [4]

**Deliverability into Workspace.** "outbound emails sent through Email Service are always authenticated with both SPF and DKIM"; outbound IPv4 range `104.30.0.0/19` (shared). [27] Google's sender guidelines require every sender to "Set up SPF or DKIM email authentication for your sending domains" and to use TLS; DMARC and alignment are mandatory only for bulk senders (5,000+/day). [28] Sends to a verified destination are to an address the account owner controls, which is the lowest-risk case; the docs do not promise inbox placement for any path, and Email Service Beta status is a real caveat (see "Not confirmed").

**Local stub.** "By default, `wrangler dev` simulates the email binding locally -- emails are logged to the console but not actually sent." "the email content is logged to the console and saved to local files for inspection." With `remote: true` "your Worker runs locally but sends real emails through Email Service". Known limitation: `ArrayBuffer` attachment content cannot be serialised by the simulator (irrelevant to a text form). The page's prerequisites list a Cloudflare account, but the simulation itself does not touch the API. [9]

## Path B: Transactional provider over HTTPS

All three are a `fetch()` to an HTTPS endpoint with a key held in a Worker secret, so the Worker code is trivial; the cost is an extra account, a domain verification per provider, and one more credential to manage.

**Resend.** `POST https://api.resend.com/emails`, `Authorization: Bearer re_...`, body `from`, `to`, `subject` (+ `html`/`text`); response `{ "id": ... }`. Free plan: 3,000 emails/month, "100 emails a day", 3 domains, 30-day retention; Pro USD 20/month. Production needs a verified domain: "Use a verified domain in the `from` address for production. `onboarding@resend.dev` is for testing only"; Resend also offers sink recipients `delivered@resend.dev`, `bounced@resend.dev` etc. Domain verification: Resend "strongly recommend[s] sending emails from a subdomain", DKIM and SPF "(`TXT` and `MX` or `CNAME` records)" with a Return-Path defaulting to `send.<domain>`, DMARC as a follow-up step, and CNAMEs must not be Cloudflare-proxied. [12][13][11][29]

**Postmark.** `POST https://api.postmarkapp.com/email` with `X-Postmark-Server-Token`, JSON `From`, `To`, `Subject`, `TextBody`/`HtmlBody`. Free developer plan: 100 emails/month, "No overages allowed", never expires; Basic USD 15/month for 10,000. New accounts are gated: "Until your account is approved, you won't be able to send to any email address outside the domains you've added to your account and verified"; review "in less than 24 hours on weekdays"; a sink `test@blackhole.postmarkapp.com` exists for testing. Sending from the brand domain to the brand's own Workspace address would work even pre-approval, but the extra review step and the 100/month cap make it the weakest fit. [30][31][32]

**MailChannels.** The old zero-setup free sending from Workers is gone: MailChannels' notice (reproduced in a GitHub issue; the original support page sits behind a JS challenge, see "Not confirmed") said the free service "will be coming to an end on June 30th, 2024" after which "the API endpoint will begin rejecting connections from unauthorized senders". Today's MailChannels Email API free plan is "$0 /mo Up to 3,000 emails per month No overages (100 emails per day)", then USD 10/month for 10,000; a Domain Lockdown DNS record is required per sending domain. Nothing about it is Workers-specific any more, so it is just another HTTPS provider with a smaller ecosystem than Resend/Postmark. [33][34]

**Local stub for all three.** None is stubbed by Wrangler; the app needs its own `EmailSender` seam that logs locally when the key is absent. Resend's and Postmark's sink addresses let a real key be exercised without reputation impact once an account exists. [13][32]

## Path C: Gmail API with a service account and domain-wide delegation

Mechanics, all documented: create a service account and JSON key in a Google Cloud project [15]; a Workspace **super administrator** authorises the client ID with scopes under Security > Access and data control > API controls > Manage Domain Wide Delegation ("with domain-wide delegation, the app has access to the data belonging to all of your users"; changes take up to 24 h) [16]; the Worker builds a JWT (`iss`, `scope`, `aud=https://oauth2.googleapis.com/token`, `iat`, `exp` ≤ 1 h, and `sub` = "The email address of the user for which the application is requesting delegated access"), signs it RS256 and exchanges it for a ~3,600 s access token [17]; then `POST https://gmail.googleapis.com/gmail/v1/users/me/messages/send` with a base64url RFC 2822 message in `raw`, scope `https://www.googleapis.com/auth/gmail.send` [35][36]. Alternatives on the same auth: `messages.import` (delivers "similar to receiving via SMTP", has `neverMarkSpam`, scope `gmail.insert`) or `messages.insert` (bypasses classification, "Does not send a message"). [37][38]

Why it is a poor fit here:
- **Accounts:** Workspace subscription, a Google Cloud project with Gmail API enabled, a service account, and a super-admin delegation step. [15][16]
- **Keys:** since 2024-03 new Google Cloud organisations enforce `iam.disableServiceAccountKeyCreation` by default; it can be relaxed per project, but that is one more admin exception. [18]
- **Scope classification:** `gmail.send` is a *sensitive* scope that "require[s] additional OAuth App Verification" for apps; the docs read do not state an exemption for internal DWD use, so this is unconfirmed (see below). [36]
- **Limits:** generous (100 quota units per `messages.send`, 6,000 units/min/user; Workspace users may send 2,000 messages/day, 500 on trial). [39][40]
- **DNS:** none beyond the Workspace MX/SPF/DKIM the client sets up anyway, since mail is sent *as* the impersonated user.
- **Local stub:** nothing official; the seam must fake it, and even remote testing needs every account above.

## Path D: SMTP into Google from the Worker

Google documents three servers for apps and devices: `smtp-relay.gmail.com` (ports 25/465/587, auth by IP allowlist or SMTP AUTH, 10,000/day per user, needs a Workspace licence, "SMTP relay should not be used as a relay for email that originates from Gmail"), `smtp.gmail.com` (465/587, auth + TLS required, 2,000/day, app password when 2-Step Verification is on) and the restricted `aspmx.l.google.com` (port 25, no auth, "Gmail or Google Workspace users only", IP allowlist + SPF). [41][42] Password-only IMAP/POP/SMTP sign-in ended 2025-03-14 "with the exception of app passwords". [43]

From a Worker: port 25 is blocked, which rules out the restricted server outright [14]; IP-allowlist auth is impractical because Workers egress from shared Cloudflare ranges; SMTP AUTH on 587/465 would need a hand-rolled SMTP client on `connect()` and a Workspace user's app password in a secret. Cloudflare's own docs answer the "SMTP from a Worker" question by pointing to Email Workers. [14] Not recommended.

## Comparison

| Path | Accounts needed | DNS records | Cost at this volume | Deliverability to Workspace | Local stub |
|---|---|---|---|---|---|
| **A. Email Service binding, verified destination** | Cloudflare (Free) + Workspace mailbox to verify | Subdomain enabled for Email Routing: MX + SPF + DKIM, written by Cloudflare | Free, unmetered [3][4] | SPF + DKIM signed by Cloudflare [27]; recipient is your own verified address | Built into `wrangler dev` (console + files) [9] |
| A'. Email Service, any recipient | + Workers Paid | Email Sending onboarding: `cf-bounce` MX/SPF/DKIM + apex `_dmarc p=reject` [6] | USD 5/mo, 3,000 emails included [4][10] | As above | Same |
| B1. Resend | Resend + domain verification | DKIM + SPF/MX (or CNAME) on a subdomain, DMARC recommended [29] | Free 3,000/mo, 100/day [11] | Provider-signed; shared IPs | App-level seam; sink addresses [13] |
| B2. Postmark | Postmark + approval review | Sender/domain verification (DKIM, Return-Path) | Free 100/mo, no overage [30] | Provider-signed | App-level seam; blackhole sink [32] |
| B3. MailChannels Email API | MailChannels | Domain Lockdown record | Free 3,000/mo, 100/day [34] | Provider-signed | App-level seam |
| C. Gmail API + DWD | Workspace + Google Cloud + super-admin step | None extra | Free within quota [39] | Sent *as* the user; lands like any internal mail | App-level seam; no official stub |
| D. Google SMTP via `connect()` | Workspace user/app password | SPF for relay | Free | Port 25 blocked; 587 undocumented; no fixed egress IP [14] | App-level seam |

## Turnstile server-side verification

- **Endpoint:** `POST https://challenges.cloudflare.com/turnstile/v0/siteverify`; accepts `application/x-www-form-urlencoded` or `application/json`, always returns JSON. Parameters: `secret` (required), `response` (required, the token), `remoteip` (optional), `idempotency_key` (optional UUID for safe retries). Response: `success`, `challenge_ts`, `hostname`, `action`, `cdata`, `error-codes`. "Each token is valid for 300 seconds (5 minutes) after generation." "Each token can only be validated once. A replayed token will be rejected with the `timeout-or-duplicate` error code." Check `hostname` and `action` against expected values. [7]
- **Secret handling:** "Only call the Siteverify API in your backend environment. If you expose the secret key in the front-end client code ... attackers can bypass the security check." Store it with `wrangler secret put TURNSTILE_SECRET`, locally in `.dev.vars`. [7][19]
- **Client side:** load `https://challenges.cloudflare.com/turnstile/v0/api.js` (`async defer`); an element with class `cf-turnstile` and `data-sitekey` renders implicitly and "An invisible input with the name `cf-turnstile-response` is added" to the enclosing form. Widget types: managed (recommended), non-interactive, invisible. [44][45]
- **Test keys (no account needed).** Sitekeys: `1x00000000000000000000AA` always passes (visible), `2x00000000000000000000AB` always fails (visible), `1x00000000000000000000BB` always passes (invisible), `2x00000000000000000000BB` always fails (invisible), `3x00000000000000000000FF` forces an interactive challenge. Secrets: `1x0000000000000000000000000000000AA` always passes, `2x0000000000000000000000000000000AA` always fails, `3x0000000000000000000000000000000AA` returns "token already spent". "Test keys work on any domain, including: `localhost`, `127.0.0.1`, `0.0.0.0`, Any development domain." [8]
- **Real widget later.** Free plan: up to 20 widgets, unlimited challenges, 10 hostnames per widget, 7-day analytics; a widget needs at least one hostname and the site need not be proxied by Cloudflare. Serving the widget on an unlisted hostname yields client error `110200` "Domain not authorized". Cloudflare recommends production sitekeys not allow `localhost`. [46][47][48][49][8]

## Suggested config/env layer

Keep both credentials and the transport behind two seams so the build never blocks on an account:

- `TURNSTILE_SITEKEY` (public, build-time) and `TURNSTILE_SECRET` (Worker secret). Defaults for local dev: the always-pass test pair above; production values come from the Turnstile dashboard. [8][19]
- `EMAIL` binding declared in Wrangler config from day one with `destination_address` set to the Workspace mailbox (or a placeholder until it is verified); `wrangler dev` will simulate it and write the message to console/files with no account. Add `remote: true` only when someone wants to see a real email land. [5][9]
- Sender address on the routing subdomain (for example `assessment@forms.<brand-domain>`), `replyTo` set to the visitor's address so the client can answer from Gmail; subject and body text from `messages.json` per map rule 7.
- `E_RECIPIENT_SUPPRESSED` / bounce handling can wait; at this volume, surfacing a non-2xx from `send()` as a form error is enough. [23]

## Not confirmed from a primary source

- **Routing-subdomain sender on the free lane.** The limits page says free sends must come "from your routing domains" and the Subdomains page says routing subdomains get the same records and rules as the apex, but no page states in one sentence that a *subdomain* enabled for Email Routing is an acceptable `from` domain for verified-destination sends. Confirm at setup time; if it is not, the fallback is Workers Paid + Email Sending onboarding (path A'). [3][25]
- **Email Sending is Beta** and the recommended lane rides on it; the docs give no SLA, and per-account daily quotas are "conservative" and unspecified. [2][3]
- **Ports 465/587 from `connect()`.** The docs only state that port 25 is blocked; whether submission ports work is undocumented. [14]
- **MailChannels end-of-life notice.** `support.mailchannels.com` returned a JavaScript challenge page; the quoted dates come from a GitHub issue reproducing the notice, and the later 2024-08-31 cutoff appears only in search snippets and community posts. The current MailChannels pricing page was read directly. [33][34]
- **`gmail.send` verification for internal DWD apps.** The scopes page marks it sensitive and says such scopes need OAuth App Verification; it does not say whether that applies to a service account used only inside one Workspace tenant. [36]
- **Inbox placement.** No provider promises inbox rather than spam; Google's published requirements were checked, not tested. [28]
- **Workspace pricing** was not researched; the ticket treats the subscription as a given.

## Sources

1. Cloudflare Email Service, Workers API: https://developers.cloudflare.com/email-service/api/send-emails/workers-api/
2. Cloudflare Email Service overview: https://developers.cloudflare.com/email-service/
3. Cloudflare Email Service limits: https://developers.cloudflare.com/email-service/platform/limits/
4. Cloudflare Email Service pricing: https://developers.cloudflare.com/email-service/platform/pricing/
5. Cloudflare Email Service, send bindings: https://developers.cloudflare.com/email-service/configuration/send-bindings/
6. Cloudflare Email Service, domains and DNS records: https://developers.cloudflare.com/email-service/configuration/domains/
7. Turnstile server-side validation: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
8. Turnstile testing (dummy keys): https://developers.cloudflare.com/turnstile/troubleshooting/testing/
9. Cloudflare Email Service local development, sending: https://developers.cloudflare.com/email-service/local-development/sending/
10. Workers pricing: https://developers.cloudflare.com/workers/platform/pricing/
11. Resend pricing: https://resend.com/pricing
12. Resend send-email API: https://resend.com/docs/api-reference/emails/send-email
13. Resend with Cloudflare Workers: https://resend.com/docs/send-with-cloudflare-workers
14. Workers TCP sockets: https://developers.cloudflare.com/workers/runtime-apis/tcp-sockets/
15. Google Workspace, create credentials (service accounts, domain-wide delegation): https://developers.google.com/workspace/guides/create-credentials
16. Google Workspace Admin, control API access with domain-wide delegation: https://support.google.com/a/answer/162106 (redirects to https://knowledge.workspace.google.com/admin/apps/control-api-access-with-domain-wide-delegation)
17. Google OAuth 2.0 for service accounts (JWT flow): https://developers.google.com/identity/protocols/oauth2/service-account
18. Google Cloud blog, stronger default org policies: https://cloud.google.com/blog/products/identity-security/introducing-stronger-default-org-policies-for-our-customers
19. Workers secrets: https://developers.cloudflare.com/workers/configuration/secrets/
20. Workers local development and remote bindings: https://developers.cloudflare.com/workers/development-testing/
21. Workers Web Crypto: https://developers.cloudflare.com/workers/runtime-apis/web-crypto/
22. Email Service changelog: https://developers.cloudflare.com/changelog/product/email-service/
23. Email Workers send API (legacy EmailMessage note): https://developers.cloudflare.com/email-routing/email-workers/send-email-workers/
24. Email routing rules and destination addresses: https://developers.cloudflare.com/email-service/configuration/email-routing-addresses/
25. Email Service subdomains: https://developers.cloudflare.com/email-service/configuration/subdomains/
26. Email Service troubleshooting (DNS conflicts, DKIM selectors): https://developers.cloudflare.com/email-service/reference/troubleshooting/
27. Email Service postmaster: https://developers.cloudflare.com/email-service/reference/postmaster/
28. Google email sender guidelines: https://support.google.com/a/answer/81126
29. Resend, add a domain (from https://resend.com/docs/llms-full.txt): https://resend.com/docs/dashboard/domains/introduction
30. Postmark pricing: https://postmarkapp.com/pricing
31. Postmark Email API: https://postmarkapp.com/developer/api/email-api
32. Postmark account approval: https://postmarkapp.com/support/article/1084-how-does-the-account-approval-process-work
33. MailChannels EOL notice (original, not fetchable): https://support.mailchannels.com/hc/en-us/articles/26814255454093-End-of-Life-Notice-Cloudflare-Workers ; reproduced at https://github.com/Sh4yy/cloudflare-email/issues/19
34. MailChannels pricing: https://www.mailchannels.com/pricing/
35. Gmail API, sending guide: https://developers.google.com/workspace/gmail/api/guides/sending
36. Gmail API scopes: https://developers.google.com/workspace/gmail/api/auth/scopes ; messages.send reference: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages/send
37. Gmail API messages.import: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages/import
38. Gmail API messages.insert: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages/insert
39. Gmail API quota: https://developers.google.com/workspace/gmail/api/reference/quota
40. Gmail sending limits in Google Workspace: https://support.google.com/a/answer/166852 (redirects to https://knowledge.workspace.google.com/admin/gmail/gmail-sending-limits-in-google-workspace)
41. Google Workspace SMTP relay: https://support.google.com/a/answer/2956491 (redirects to https://knowledge.workspace.google.com/admin/gmail/advanced/route-outgoing-smtp-relay-messages-through-google)
42. Send email from a printer, scanner, or app: https://support.google.com/a/answer/176600 (redirects to https://knowledge.workspace.google.com/admin/gmail/send-email-from-a-printer-scanner-or-app)
43. Transition from less secure apps to OAuth: https://knowledge.workspace.google.com/admin/sync/transition-from-less-secure-apps-to-oauth
44. Turnstile client-side rendering: https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/
45. Turnstile widget types: https://developers.cloudflare.com/turnstile/concepts/widget/
46. Turnstile plans: https://developers.cloudflare.com/turnstile/plans/
47. Turnstile get started: https://developers.cloudflare.com/turnstile/get-started/
48. Turnstile hostname management: https://developers.cloudflare.com/turnstile/additional-configuration/hostname-management/
49. Turnstile client-side error codes: https://developers.cloudflare.com/turnstile/troubleshooting/client-side-errors/error-codes/
