# What established billing and RCM sites do that the Execile landing page does not

Ticket: none, direct request. Reviewed on 2026-09-07. Live websites are the primary source; every observation below cites the exact URL it was read from, and pages that could not be loaded are listed at the end rather than described from memory. Where a fetch was redirected, the effective URL is the one cited.

**Audience constraint that governs everything here.** Execile sells to independent US practices with 1 to 20 providers. Three of the four named vendors (Tebra, AdvancedMD, athenahealth) are software platforms whose billing service is an add-on to their own EHR, and CureMD is the same shape. What they do for enterprise groups is not relevant. What they do to reassure a five-provider practice is. The independent firms reviewed are closer to Execile's shape, and one of them (Medical Billers and Coders) has visibly pivoted its home page to health systems, which is itself a data point about who is left talking to small practices.

**Framing constraint.** Execile has no clients, no outcomes, no review badges and no years in business. Every recommendation says whether a startup can do it honestly and what the honest version is. Competitor statistics are recorded as their claims. None of them cite a source, and none of them should be reused; the standard for anything numeric on the page is `docs/research/rcm-problem-statistics.md`.

## Verification statuses used

- **READ** - the page was fetched and the quoted text was found in the page's HTML.
- **READ (summary)** - the page was fetched and summarised by the fetch tool; the specific wording was not re-checked against raw HTML.
- **NOT LOADED** - the page returned an error and nothing is claimed about it.

Sites reviewed: CureMD, Tebra, AdvancedMD, athenahealth (via the browser pane, since the site returns 403 to automated fetches), Practolytics, Medical Billers and Coders, Outsource Receivables Inc., MedCare MSO, STAT Medical Consulting, DrCatalyst, Neolytix, CloudRCM Solutions.

---

## Summary: what to change

Ordered by value to a 1 to 20 provider visitor. "Honest now" means a startup with no clients can put it on the page without misleading anyone.

| # | Recommendation | Execile section | Competitors that do it | Effort | Honest now |
|---|---|---|---|---|---|
| 1 | Publish the fee range and say "net collections" | FAQ `pricing`, Why Us `Pricing` row | AdvancedMD (https://www.advancedmd.com/revenue-cycle-management/) states "~4–8%"; MBC (https://www.medicalbillersandcoders.com/pricing) tiers by provider count with "$0" setup and "30-day notice" | Small | Yes, it is Execile's own price |
| 2 | Answer "will we lose control?" with the in-EHR model and data ownership | FAQ (new item), Why Us (new row) | Practolytics (https://practolytics.com/), AdvancedMD RCM FAQ, Tebra (https://www.tebra.com/billing-payments), STAT (https://www.statmedical.net/medical-billing-for-small-practices) | Small | Yes |
| 3 | Say what happens to in-flight claims and old AR on day one | How It Works step 3, FAQ (new item), Why Us (new `Switching` row) | MBC "zero billing interruption", Tebra "3–4 weeks, without changing their EHR", AdvancedMD "switch between in-house billing and outsourcing at anytime", ORI (https://outsourcereceivables.com/) "zero billing disruptions" | Small | Yes |
| 4 | Replace the Results "coming soon" with service commitments Execile controls | Results, Hero trust points | ORI publishes four operational commitments; AdvancedMD "90-second average response time"; Practolytics "48hr Claim turnaround"; MBC "24hr Response" | Medium | Yes, they are promises, not outcomes |
| 5 | Say where the team sits and who supervises it, and name the coder certification | Footer, FAQ (new item), Services mid-cycle card | Practolytics "certified by AAPC and AHIMA"; MBC "CPC/CCS-certified coders"; athenahealth "AAPC or AHIMA-certified"; DrCatalyst "3+ levels of supervision" and a San Juan address | Small | Yes, if true |
| 6 | Add a monthly collections band to the assessment form | Assessment form | MBC (bands from "Under $20k" to "$5M+"), MedCare MSO ("Monthly Collection", "Total AR"), Tebra (specialty and provider count) | Small | Yes |
| 7 | Add an in-house comparison, on facts not on an invented percentage | Why Us (third column or a short block), Fit | AdvancedMD dedicated comparison page (https://www.advancedmd.com/revenue-cycle-management/in-house-and-rcm-comparison/); MBC pricing page "12–14% of monthly collections" for in-house (unsourced) | Medium | Yes, if the rows are facts about coverage and scaling rather than a cost claim |
| 8 | Give each specialty pill one sentence of specialty-specific substance | Specialties | CureMD 30+, Practolytics 40+, MBC 40+, DrCatalyst 60+ specialty pages; Tebra 5 | Medium | Yes, if a coder writes them |
| 9 | Make the security answer concrete and make the HIPAA Notice link real | FAQ `hipaa`, Footer legal links | CureMD "HIPAA SOC 2 Type II ONC-certified"; Neolytix ISO 27001; DrCatalyst named controls (MFA, monitoring) and a HIPAA seal; MBC and DrCatalyst have HIPAA pages | Small to medium | Partly. Describe controls, do not claim SOC 2 |
| 10 | Deepen the FAQ from 6 to about 12 | FAQ | Practolytics 15 questions; AdvancedMD 8; STAT 8; Tebra 5 to 6 | Small | Yes |
| 11 | List what the assessment findings document contains | Assessment lead and bullets | MBC "maps every leak in your revenue cycle before you commit"; ORI "Stress Test identifies areas for improvement" | Small | Yes |
| 12 | Prepare the results disclosure now, publish later | Results | athenahealth footnote on every testimonial (https://www.athenahealth.com/solutions/practice-management) | Small | Not yet; write the rule now |

Things not to copy are at the end: unsourced outcome statistics, fake "live" tickers, calculators built on unnamed benchmarks, SMS-consent form clutter, badge walls, and enterprise vocabulary.

---

## Per-site notes

### CureMD

Pages read: https://www.curemd.com/ (READ) and https://www.curemd.com/medical-billing-services (READ; the URL with trailing slash resolves here). https://www.curemd.com/pricing/ returned a 404 shell with a "See All Plans" link to `/price-form.asp` (READ).

1. Trust. Home page carries "HIPAA SOC 2 Type II ONC-certified", award strip ("#1 PM/EMR", "Best in KLAS EHR", "White Coat of Quality Award", "Capterra's Top 20"), counts ("28,000+ Providers", "500M+ Encounters", "50M+ Patients", "29 Years independent"), six named physician video testimonials, and a Trustpilot quote. The billing page adds "40,000+ providers across all 50 states", "99% customer retention rate", four named client testimonials with organisations. None of the counts cite a source.
2. Pricing. Not shown. "Get Pricing" and "Request A Pricing" lead to a form. The model is stated as "You only pay us for the dollars we collect" and "There are no software installation fees."
3. CTAs. "Request Demo" is primary. Sales phone "+1 646 663 8030" and a separate support number in the header, live chat, email. Billing page CTA is "Get Pricing".
4. Numbers. Home: "98% first-pass clean claims with automated denial management". Billing page: "4 to 10% more and 35% faster", "96% of our claims are accepted and paid on the first submission", "5 to 10% increase in collections in the first 3 months". All unsourced marketing numbers; the home page and billing page even disagree with each other (98% vs 96%).
5. Sections Execile lacks. Pricing form, resource centre (webinars, whitepapers, case studies, customer stories, blog, MIPS), 30+ specialty pages, a "Quick Setup" block: "We handle all the system setup, documentation, EDI implementation, process coordination, and training at no additional cost."
6. Small practice. Home page has an explicit tile: "Solo & small practices: Get up and running in days intuitive EHR, built-in billing, and fair pricing that grows with you." Billing page: "whether you are a multispecialty group or a solo practice". Objections pre-empted: cost (pay on collections, no install fees), transition (setup handled free), security (SOC 2 badge). Nothing on contract length.
7. Accessibility and weight. Home HTML is 570 KB with 33 script tags and five `<h1>` elements on one page. All 55 images carry an `alt` attribute.

### Tebra (formerly Kareo)

Pages read: https://www.tebra.com/ (READ), https://www.tebra.com/billing-payments (READ; `/billing/` redirects here), https://www.tebra.com/billing-payments/managed-billing (READ; `/managed-billing/` redirects here), https://www.tebra.com/pricing/ (READ (summary)), https://www.tebra.com/billing-payments/billing-calculator (READ (summary)). `/billing-services/` and `/medical-billing-services/` are 404s. `/billing-company/` is a legal addendum for reseller billing companies, not a marketing page.

1. Trust. "Trusted by 150,000 providers", a wall of G2 badges ("Leader in Medical Practice Management and Billing", "Users Love Us", "Easiest Setup", "High Performer, Revenue Cycle Management, Small Business"), Software Advice "Front-Runners 2026", Capterra Shortlist 2026, named testimonials, case studies, a customer "for over 13 years". The page text says "We safeguard your practice with full security and HIPAA compliance"; the fetch summary also listed HITRUST and PCI, but those strings were not found in the saved HTML, so treat them as unconfirmed.
2. Pricing. Not shown. "Tebra pricing varies depending on the number of providers, the platform features your practice needs, and your implementation requirements." Per prescribing provider, "unlimited non-clinical staff at no extra cost", a lower tier for providers billing "100 claims or less per month", and two named one-off fees (EPCS setup "approximately $75 per provider", PDMP "$500 one-time per facility"). The managed billing page says "transparent fee" without a figure.
3. CTAs. "Get a demo", "Take a quick tour", "Explore for Free". Header: "Call sales (866) 938-3272". The managed billing form asks for full name, practice name, email, phone, specialty, and number of providers ("Please enter a valid number between 0 and 99").
4. Numbers. The home and billing pages make no outcome claims with numbers. The eligibility feature cites "2,700+ payers". The Revenue Recovery calculator says its assumptions "reflect guidance from leading billing experts and sources including MGMA, KFF, HFMA, and internal Tebra data" without naming a report, and uses a "90% benchmark" for upfront patient collection.
5. Sections Execile lacks. Pricing page, calculators (EHR, billing, "Revenue Recovery"), product tour, resource library, case studies, five specialty pages, an explicit "Independent practices" audience page.
6. Small practice. Whole site is framed "Built for private practices". Managed billing FAQ: "Do I need to change my EHR system to use Tebra's outsourced billing service? No." and "Most practices are fully connected and live within 3–4 weeks, without changing their EHR." Billing page: "No EHR switch required", "You stay in your EHR. You keep full visibility over performance and payments", a "Success coach" and "smooth transition". Control and transition are the two objections handled; cost and contract length are not.
7. Accessibility and weight. Home HTML 425 KB with 122 script tags; billing page 423 KB with 137. 47 of 82 home images have empty `alt`, mostly badge and decoration images. One `<h1>`.

### AdvancedMD

Pages read: https://www.advancedmd.com/ (READ), https://www.advancedmd.com/revenue-cycle-management/ (READ; `/medical-billing-services/` redirects here), https://www.advancedmd.com/revenue-cycle-management/in-house-and-rcm-comparison/ (READ (summary)). `/rcm/` is a 404; `/pricing/` returned 403.

1. Trust. "13K practices trust AdvancedMD", "9.5M Claims processed every month", "850 medical billing companies", "650" employees, "HIPAA Supported", "AWS Hosted", "ONC Certified", "MACRA/MIPS Ready". One named testimonial on the home page. No G2 or Capterra badges seen.
2. Pricing. This is the one vendor that puts a range in writing, inside the RCM FAQ: "Typical RCM services are priced as a percent (generally ~4–8%) of monthly collections, with a transparent, no-hidden-fee model that includes software access, reporting, claims handling, payer follow-ups, and more." Also "Low upfront costs, no long-term agreements".
3. CTAs. "Talk to an expert", "Watch demo", "Request a price quote", "Get custom pricing". Header phone "(800) 825-0224", "Chat" link, and a "Free 30-day Trial" of AdvancedMD Now "for small mental health practices".
4. Numbers. No outcome statistics on the RCM page. The home page states a support commitment: "90-second average response time, no ticket queues", unsourced but a service measure rather than a client outcome.
5. Sections Execile lacks. A dedicated in-house versus RCM comparison page with a 20-row table (software, eligibility, charge capture, coding, scrubbing, submission, EDI agreements, status follow-up, denials, appeals, denial trending, posting, patient collections, patient call centre, statements and postage, EOB requests, dedicated account manager, reporting, advanced analytics). A free "Annual Revenue Collection Audit". Eight-item RCM FAQ. "Digital Accessibility" and "HIPAA Privacy" links in the footer.
6. Small practice. "from start to retirement": "Whether you're focusing on building patient volume, recovering declining revenues, repurposing your medical billing staff or easing into retirement". Contract objection: "no long-term agreements and the flexibility to use our services for just a few months". Control: "How does AdvancedMD maintain transparency in RCM if billing is outsourced?" with dashboards as the answer. Security: generic sentence only.
7. Accessibility and weight. Home HTML 313 KB, 50 scripts, two `<h1>`s. RCM page 317 KB, 36 scripts.

### athenahealth

Pages read in the browser pane: https://www.athenahealth.com/solutions/revenue-cycle-services (READ) and https://www.athenahealth.com/solutions/practice-management (READ). The home page and every URL under the domain return 403 to curl and to the fetch tool.

1. Trust. "Our 4th year at #1 Best in KLAS", stated as "#1 Best in KLAS 2026 for Practice Management, 11-75 Physicians, Independent". Four named practice testimonials, each footnoted: "*These customers are part of our Client Advocacy Program and were not compensated for this content. Their results reflect the experience of one particular practice and are not necessarily what every athenahealth customer should expect." Coding service: "expert AAPC or AHIMA-certified coding support".
2. Pricing. None on either page. CTA is "Request a demo" everywhere.
3. CTAs. "Request a demo" / "Request a personalized demo". Footer: "Call us anytime 800.981.5084". The demo form's first step is a qualifier: "Which best describes you? I'm a patient / I'm considering athenaOne for my organization / I'm a current athenaOne customer".
4. Numbers. Neither page states a first-pass rate, days in AR or collection lift. One testimonial says "We've gotten 40 hours a week back". The percentages that search results attribute to athenaCollector (98.4% first-pass, "up to 6%") were seen only in third-party reviews (business.com, businessnewsdaily.com) and are not on the pages read.
5. Sections Execile lacks. Explicit split of the audience into "Medical billing for independent practices" and "Revenue cycle services for complex organizations" on the same page; a services list in revenue-cycle order (registration verification and co-pay collection, insurance verification, authorization management, charge entry and coding, claim scrub, posting, denials resolution, zero pay and credit resolution, patient refunds, performance reporting); a resource centre; "Enhanced Claims Resolution: Let us collect what you're owed without the effort of training new staff."
6. Small practice. "Whether you're a small independent practice or a large, complex healthcare organization". The independent-practice block sells visibility: "complete visibility into your performance". Nothing on contracts, transition or cost.
7. Accessibility and weight. Not measured (blocked to automated tools). A OneTrust cookie banner and "Do Not Sell or Share My Personal Information" link are present.

### Practolytics (independent firm, SC and GA)

Page read: https://practolytics.com/ (READ). https://practolytics.com/faqs/ is a 404; the 15-question FAQ is on the home page.

1. Trust. Header strip "Trusted since 2014 | 28+ Specialties | HIPAA Compliant"; "20+ Years experience"; coders "certified by AAPC and AHIMA"; five testimonials; two street addresses; case studies, eBooks and white papers in the Resources menu.
2. Pricing. FAQ: "Pricing depends on how big your clinic is, your specialty, how many claims you handle, and which services you pick." No range.
3. CTAs. "BOOK MY FREE RCM AUDIT" and "GET A CUSTOM RCM QUOTE IN 24 HOURS". Phone "+1 (803) 414-0103" in header.
4. Numbers. "98% Claims approval | 30% Fewer AR days | 20+ Years experience | 48hr Claim turnaround". Unsourced.
5. Sections Execile lacks. 40+ specialty pages, a partner page for AdvancedMD, case studies, a long FAQ.
6. Small practice. "Whether it's a single clinic or a multi-location healthcare organization"; "Scalable medical billing services for small practices and enterprise groups". FAQ pre-empts control directly: "Will my practice lose control of billing when outsourcing to Practolytics? No, providers maintain full control with simple reports, dedicated support, and tools for smooth teamwork." Onboarding: "Most practices are on board with us in weeks. However, this timeline completely depends on your specialty, insurance requirements, and technology environment." Getting started: "Start with a free billing review."
7. Accessibility and weight. 315 KB, 83 scripts, 85 images, one `<h1>`, one empty `alt`.

### Medical Billers and Coders (independent firm, "Data Care Pro LLC dba Medical Billers and Coders")

Pages read: https://www.medicalbillersandcoders.com/ (READ) and https://www.medicalbillersandcoders.com/pricing (READ (summary)).

1. Trust. "Since 1999", "$2.4B+ Claims Processed", "98.7% True Net Collection Ratio", "24/7 Follow the Sun Model", three case-result tiles, one testimonial attributed only to "Physician Group — Wound Care Practice, Tucson AZ", "CPC/CCS-certified coders". Footer describes it as "a US-based revenue cycle management company".
2. Pricing. The pricing page is the most explicit of the independents: "Medical Billers and Coders does not publish a flat percentage — because your billing complexity, specialty, and payer mix are unique", but tiers by size ("Core Billing" 1-5 providers, "Growth RCM" 6-20 providers marked "Most Common Engagement", "Enterprise RCM" 20+), "Setup fee: $0", "EHR integration: $0", "30-day notice to cancel — no lock-in", "No multi-year contracts, no early termination fees". It compares against in-house billing at "12–14% of monthly collections" with no source.
3. CTAs. "Identify My Revenue Leakage", "Get My Revenue Integrity Audit", "Schedule 15-min Principal Briefing". Header phone "888-357-3226". The audit form asks for full name, phone, email, specialty, and "Monthly Insurance Collection" in bands ("Under $20k", "$20k to $50k", "$50k to $100k", "$100K–$1M", "$1M–$5M", "$5M+"), plus a long SMS consent paragraph. Below the submit button: "HIPAA Secure · No Spam · 24hr Response · No Commitment".
4. Numbers. A "Live Data" panel: "First-Pass Acceptance Rate 98.4% vs 91.2% industry", "Net Collection Rate 98.7% vs 95.1% industry", "Average AR Cycle Time 17 Days vs 34 days industry", "Denial Overturn Rate 78% vs 45% avg", "5.5% Average Hidden Variance Leakage", "73% Of Groups Don't Track True NCR", "$180K Avg. Annual Loss Per Provider", "Most practices discover $25K–$85K in uncaptured revenue". A scrolling ticker: "UHC Arizona tightened E&M documentation — denials up 22%". None of it is sourced; the "industry" comparators do not match any MGMA, HFMA or CAQH figure in `rcm-problem-statistics.md`.
5. Sections Execile lacks. Pricing page, state pages ("We Dominate Over California, Florida..."), 40+ specialty pages, case studies, glossary, eBook, a four-step onboarding: "Step 3 — Seamless Transition: We integrate with your existing EHR/PM system with zero billing interruption. Most transitions complete in under 2 weeks."
6. Small practice. The home page now addresses "Multi-Specialty Groups and Health Systems", "Defend Your EBITDA", "Your CFO sees denial trends". The 1-5 and 6-20 provider tiers survive only on the pricing page. Objections pre-empted: lock-in ("No long-term lock-in. No multi-year contracts, no exit penalties."), audit before commitment ("We show you exactly what's leaking before you commit to a dollar").
7. Accessibility and weight. 125 KB, 13 scripts, 8 images all with `alt`, one `<h1>`. Emoji glyphs are used as icons in the ticker with no text alternative.

### Outsource Receivables Inc. (independent firm, "ORI")

Page read: https://outsourcereceivables.com/ (READ).

1. Trust. "Since 1998, ORI has partnered with specialty clinics—including OBGYN, Foot & Ankle, Surgical, Family Medicine, Therapy, and Mental Health". Two named physician testimonials, one with a figure ("increased revenue of 9.7%, which includes 24% increase in patient payments in less than 2 years"). No badges or certifications.
2. Pricing. None. "15% Cost Savings. More affordable than in-house billing teams." (unsourced).
3. CTAs. "Schedule Your FREE Assessment Today"; "FREE Financial Health Assessment. Our customized Stress Test identifies areas for improvement." Header phone "(866) 585-2800".
4. Numbers. "15% Cost Savings", "48-Hour Processing", "95% Patient Inquiry Response Rate". Unsourced. But separately, and more useful, it publishes four commitments: "Keep aging accounts over 90 days below 10%", "Process all charges and payments within 48 hours", "Deliver accurate financial reports within three business days", "Provide professional, patient-friendly billing services".
5. Sections Execile lacks. A lifecycle block: "Startups, Software Transitions, Growing Practices, Established Clinics". FAQ page in the nav.
6. Small practice. Specialty clinics only. Objections: "We work within your existing systems", "Migrate smoothly with zero billing disruptions", "Stress-free onboarding", "Data security and compliance at every stage".
7. Accessibility and weight. The lightest page in the set: 84 KB, 9 scripts, all 30 images have `alt`.

### MedCare MSO (independent firm)

Page read: https://medcaremso.com/ (READ).

1. Trust. Badge wall: BBB, "NILA", ISO, ONC, "ASRM", HIPAA, AAPC. "Trusted by 150,000 providers", "Serving Healthcare Providers Since 2012", "over 80,000 practitioners" (the two counts disagree). Five named testimonials.
2. Pricing. "MedCare MSO offers a pay-for-paid model to save you thousands of dollars." No figure.
3. CTAs. "Request Demo", "Let's Talk". Header phone "800-640-6409". The form asks for name, practice name, email, phone, "Monthly Collection" (bands "Less than 100K", "Less than 500K", "Less than 1M", "Less than 2M", more), "Total AR", and an SMS opt-in. "A member of our team will get in touch with you in 12 hours." A "free A/R recovery analysis" is offered.
4. Numbers. "98.5% First Pass Clean Claims Rate", "35% Reduction in A/R", "Up to 35% Revenue Increase", "96% Collection Ratio", "90% of our clients experienced improved claim accuracy", "50% or more reduction in overhead costs", "7-14 Days Turnaround Time". Unsourced.
5. Sections Execile lacks. AI product pages, 50+ specialties, staffing service, resources.
6. Small practice. Not addressed specifically. Objections: cost ("pay-for-paid"), transition ("free software installation").
7. Accessibility and weight. Heaviest independent: 630 KB, 75 scripts, 78 images of which 20 have no `alt` attribute at all and 28 have an empty one.

### STAT Medical Consulting (independent firm, CA)

Page read: https://www.statmedical.net/medical-billing-for-small-practices (READ).

1. Trust. "Certified experts", HIPAA, "30+ Specialties". No testimonials, badges, years or case studies on this page.
2. Pricing. FAQ: "Most billing companies charge a percentage of collected revenue, so you only pay for successful claims." No figure.
3. CTAs. "Book Free Consultation", "Get Your Custom Quote" (a `tel:` link). Header phone "(818) 907-7828".
4. Numbers. "20% Increase in Reimbursement Rates", "35% Increase in Cash Flow Within 6 Months", "40% Reduction in Claim Denials", "up to 30%". Unsourced. "We don't just offer medical billing services – we guarantee results" with no guarantee terms.
5. Sections Execile lacks. Eight-item FAQ including patient relationships and "how do I know if I need this".
6. Small practice. The page is titled for small practices. Control: "You'll have full access to your billing information through secure, cloud-based platforms."
7. Accessibility and weight. 175 KB, 33 scripts, 3 images, one `<h1>`.

### DrCatalyst (independent firm, PR)

Page read: https://www.drcatalyst.com/ (READ; the bare domain redirects here, the `www` host fails DNS from the fetch tool but not from curl).

1. Trust. "15+ years of expertise", "500+ clients across 60+ EHR/PM systems", "60+ Specialties", "HIPAA Seal of Compliance, provided by Compliancy Group, LLC", twelve named testimonials, eight affiliated-company logos, address "3100 Carr 199, STE 202, San Juan, PR".
2. Pricing. None.
3. CTAs. "Schedule A Free Consultation". Phone "800-634-1914".
4. Numbers. Only the counts above.
5. Sections Execile lacks. Testimonials page, a security block: "Continuous cybersecurity training, 24/7 risk monitoring, multi-factor authentication", accountability block: "3+ levels of supervision", "Productivity reports, regular meetings, and consistent communication". "Go live within 30 days."
6. Small practice. A testimonial: "We highly recommend DrCatalyst to organizations and independent physicians, particularly those in specialized fields or small practices."
7. Accessibility and weight. 79 KB, 24 scripts, 75 images of which 54 have empty `alt`.

### Neolytix (independent firm, Chicago) and CloudRCM Solutions

Neolytix https://neolytix.com/ (READ): "ISO 27001-certified security practices", a 14-year badge, "Trusted by 270+ healthcare organizations nationwide", "31 Specialties Served", "40 States Served", 20+ client logos, six testimonials, "Talk to Us—No Cost, No Commitment", header phone "+1 224 529 4400", a "Small Practice Services" footer group separate from "Mid-Market Services". No pricing, no FAQ, no outcome numbers. 953 KB, the heaviest page in the set.

CloudRCM https://www.cloudrcmsolutions.com/independent-practice-medical-billing/ (READ (summary)): a blog-style page opening with "Solo and small group practices lose up to $5 million annually due to billing and coding inefficiencies" and "80% of medical bills contain errors", plus eight more unsourced figures. It cites "The CMS defines a small practice as 15 or fewer providers billing under one TIN", which is real (the QPP small-practice definition) and is a useful anchor Execile could cite. No pricing, testimonials, certifications or years. Form asks state and SMS consent.

---

## Recommendations in detail

### 1. Publish the fee range and say "net collections"

What to change. FAQ `pricing` currently reads "A percentage of collections, quoted upfront before any work begins." Add the band the quote will land in and the base it is calculated on: "Between [low]% and [high]% of net collections, depending on specialty and claim volume. Net means what is actually collected, not what is charged. The exact rate is in writing before any work begins." Repeat the base in the Why Us `Pricing` row: "% of net collections, quoted upfront".

Why. Every site reviewed except AdvancedMD hides the number behind a form. AdvancedMD publishes "~4–8%" and MBC publishes "$0" setup, "30-day notice", and provider-count tiers. For a 1 to 20 provider owner, the fee band is the first question, and Execile's hero already promises "you know the price before you sign anything". A page that says that and then withholds the band reads like the vendors it is contrasting itself with. The gross versus net distinction matters because a fee on gross charges can cost more than a higher fee on net collections; making it explicit is a differentiator no reviewed site states plainly.

Honest version. It is Execile's own price list, so publishing a range is honest as long as the quote actually lands inside it. Tie the band to something checkable: specialty and monthly claim count. If the client will not commit to a band, at least publish the base (net) and the two fee-free items (no setup, no termination fee), which MBC already does.

### 2. Answer "will we lose control?"

What to change. Add an FAQ item, id `control`: "Will we lose control of our billing? No. We work inside your EHR under user accounts you control. Every claim, note and payment stays in your system, you can see it any time, and the read-only KPI dashboard shows the same numbers we look at. If you leave, nothing has to be exported back to you." Add a Why Us row `Your data`: typical vendor "Lives in the vendor's system" versus Execile "Stays in your EHR, under your accounts".

Why. Practolytics asks the question verbatim in its FAQ; AdvancedMD asks "How does AdvancedMD maintain transparency in RCM if billing is outsourced?"; Tebra's billing page says "You stay in your EHR. You keep full visibility"; STAT promises "full access to your billing information". Execile's in-EHR model is a stronger answer than any of them, because the practice never gives up its system of record, but the page never states the objection, so the answer is spread across the Systems note and the Services visibility card where a worried reader will not assemble it.

Honest version. Fully honest. The exit point ("nothing to export") is a real structural advantage over platform vendors whose billing service is tied to their EHR.

### 3. Say what happens on switching day

What to change. How It Works step 3 says "14-day onboarding. You keep your existing EHR/PM." Add one sentence on continuity: "Claims already in process keep moving; we take over open AR and your previous biller's queue on day one, so there is no gap in submissions." Add an FAQ item `switching`: "What happens to claims that are already out when we switch?" Add a Why Us row `Switching`: typical vendor "Weeks of parallel running, retraining" versus Execile "14 days, no software change, no gap".

Why. Transition risk is the objection every competitor handles first. MBC: "zero billing interruption. Most transitions complete in under 2 weeks." Tebra: "Most practices are fully connected and live within 3–4 weeks, without changing their EHR." AdvancedMD: "switch between in-house billing and outsourcing at anytime with ease" and "the flexibility to use our services for just a few months while you transition". ORI: "Migrate smoothly with zero billing disruptions". CureMD: "We handle all the system setup, documentation, EDI implementation, process coordination, and training at no additional cost." Execile's 14 days is competitive with all of them, but the page says nothing about the claims in flight, which is what a practice manager is actually afraid of.

Honest version. A process promise, so honest if the process exists. Do not promise a number of days to "full recovery" the way MBC's case tiles do.

### 4. Turn "coming soon" into service commitments

What to change. Keep the Results `comingSoon` paragraph, it is the most honest sentence in the category. Under it, replace or extend `measures` with commitments Execile controls, in the shape ORI uses: claims submitted within one business day of charge receipt; payments posted within two business days of the ERA; every denial worked within N business days of receipt; the monthly KPI report delivered by the Nth business day; a named contact who answers within one business day. Move "24-hour processing" out of the hero trust-point string (where it is jammed together with "US-facing team") into this list where it can be precise.

Why. ORI publishes "Process all charges and payments within 48 hours" and "Deliver accurate financial reports within three business days"; AdvancedMD "90-second average response time, no ticket queues"; Practolytics "48hr Claim turnaround"; MBC "24hr Response" and "Payer policy update lag ≤ 48 hrs". These are the only numbers on any reviewed site that a startup can copy honestly, because they are inputs, not outcomes. They also give the Results section something to show before the first case study exists, and they set the terms of the monthly review the How It Works step 4 promises.

Honest version. Entirely honest as long as each is an operational standard Execile will actually run to. Phrase them as commitments ("we submit within..."), never as averages ("our average is..."), since there is no history to average.

### 5. Say where the team sits and name the certification

What to change. The footer says "EXECIL PVT LTD" and "New York, NY". The hero says "US-facing team". "Pvt Ltd" is a South Asian company suffix and a US practice manager who notices will read "US-facing" as a euphemism. State it: add a FAQ item `team`: "Where is your team? Your account manager is in New York and works US business hours. Coding and AR follow-up are done by our team in [country], all under the BAA, with named supervision and no data leaving your EHR." In the Services mid-cycle card, change "by certified coders" to the credential ("AAPC-certified (CPC) coders") if that is true.

Why. Practolytics: "certified by AAPC and AHIMA". MBC: "CPC/CCS-certified coders". athenahealth: "AAPC or AHIMA-certified coding support". MedCare shows an AAPC badge. DrCatalyst, which is based in Puerto Rico, publishes its street address, "3+ levels of supervision" and "Productivity reports, regular meetings, and consistent communication" precisely to pre-empt the offshore question. MBC calls itself "US-based" and "Follow the Sun". Nobody hides it; they frame it.

Honest version. Only honest if it is true, which is the point: the current copy is the version that risks looking dishonest. Name the certifying body only if the coders hold it, and say the country.

### 6. Add a monthly collections band to the form

What to change. Add a select `collections`: "Monthly collections (approx.)" with bands such as "Under $50k", "$50k to $150k", "$150k to $500k", "$500k to $1M", "Over $1M", "Not sure". Keep it optional or make the last option a safe default.

Why. MBC asks "Monthly Insurance Collection" in bands, MedCare asks "Monthly Collection" and "Total AR", Tebra asks specialty and provider count. Execile already asks providers and primary concern; the collections band is what makes a quoted rate possible in the first reply and lets Execile decline mismatched leads (hospital facility billing, mostly cash-pay) before the BAA. It is not PHI.

Honest version. Fine. Do not copy the SMS-consent paragraph MBC, MedCare and CloudRCM attach to their forms; it is the single biggest source of clutter on those pages and Execile has no SMS programme.

### 7. Add the in-house comparison, on facts

What to change. Either add a third column "In-house biller" to the Why Us table or a short block under Fit. Rows that are facts, not claims: coverage during vacation and turnover (one biller versus a team); specialty coding certification; cost that scales with collections versus a fixed salary; credentialing handled versus a second job for the same person; reporting produced every month versus when there is time.

Why. AdvancedMD has a dedicated page "Comparing In-house Medical Billing & AdvancedMD RCM" with a 20-row table. MBC's pricing page puts in-house at "12–14% of monthly collections". STAT and ORI both say "More affordable than in-house billing teams". For a 1 to 20 provider practice the real alternative is usually one person at the front desk, not another vendor, and Execile's Why Us only argues against a "typical billing vendor". The Fit list already says "Less of a fit if you want to keep a full in-house billing team", so the page knows the segment exists.

Honest version. Do not print MBC's "12–14%" or ORI's "15% Cost Savings"; neither is sourced. If a cost row is wanted, it needs a primary source for a biller's fully loaded cost (BLS wage data for medical records specialists was not checked in this pass) and should be a separate research ticket.

### 8. Give the specialty pills substance

What to change. Under or beside each of the ten pills in Specialties, one sentence naming the billing trap in that specialty that a generalist misses: global surgical periods in Orthopedics, the global OB package split, modifier 25 in Dermatology, routine foot care exclusions in Podiatry, time-based and add-on codes in Behavioral Health, the 8-minute rule in Physical Therapy, S9083 and place-of-service in Urgent Care. Write them once, from a coder, and keep them to a sentence.

Why. CureMD (30+), Practolytics (40+), MBC (40+) and DrCatalyst (60+) all have specialty pages; Tebra has five. Execile's headline is "Coders assigned by specialty, not by queue", and a list of ten nouns does not prove it. One specific sentence per specialty does, and it is the cheapest form of the specialty page that the competitors run.

Honest version. Honest if a certified coder writes the sentences. Do not add specialties to the list to match competitor counts.

### 9. Make the security answer concrete and the HIPAA link real

What to change. FAQ `hipaa` says "A BAA is signed before any data moves, and every workflow is HIPAA compliant." Add the controls: work happens inside the practice's EHR under named user accounts, multi-factor authentication, role-based access, no bulk export of patient data, access removed the day an engagement ends, annual HIPAA training, and a named privacy contact. Make the footer "HIPAA Notice" link go to a page that says the same thing in full, plus the BAA summary. Keep "Privacy Policy" and "Terms" as they are until the legal-links decision.

Why. CureMD: "HIPAA SOC 2 Type II ONC-certified". Neolytix: "ISO 27001-certified security practices". DrCatalyst: "Continuous cybersecurity training, 24/7 risk monitoring, multi-factor authentication" and a third-party HIPAA seal. MBC and DrCatalyst have HIPAA pages in the footer; AdvancedMD has "HIPAA Privacy" and "Digital Accessibility" pages. Execile's footer HIPAA Notice is a dead `#` link on a page whose hero leads with "HIPAA Compliant". A practice manager who clicks it and gets nothing has just learned something.

Honest version. A startup cannot claim SOC 2 Type II or ISO 27001; both need months of operation and an auditor. The Compliancy Group style "HIPAA seal" is a paid attestation of self-assessment, not a certification, and is not worth buying. Listing the actual controls is honest and more informative than any badge. Note that "HIPAA certified" is not a thing; keep "HIPAA compliant".

### 10. Deepen the FAQ to about twelve

Current six: existing EHR, onboarding time, contract, pricing, HIPAA, AR cleanup only. Add: lose control (rec 2), switching day (rec 3), where the team is (rec 5), net versus gross (rec 1), patient statements and patient calls ("Do you talk to our patients?" is in STAT's FAQ and AdvancedMD's comparison table has "Patient Call Center" and "Manage Patient EOB requests"), minimum size ("Do you take solo providers?" since CloudRCM and CureMD both address solo explicitly), and what leaving looks like (month-to-month is stated, but not what handover means). Practolytics runs 15, AdvancedMD 8, STAT 8; six is the low end of the set.

### 11. Say what the assessment findings contain

What to change. The assessment lead says "We'll show you where revenue is leaking and what it would take to fix it." Add the contents of the written findings: denial reasons by payer from the claim sample; AR aging with the amount past 120 days; coding findings from the sample; the quoted rate and scope. Put it in `bullets` next to "Written findings within 5 business days".

Why. MBC: "MBC maps every leak in your revenue cycle before you decide anything" and "Real numbers from your actual billing data". ORI: "Our customized Stress Test identifies areas for improvement". AdvancedMD: "Annual Revenue Collection Audit... an evaluation of software usage and effectiveness". The offer itself is standard across the category, so the differentiator is the deliverable. Execile's five-business-day written finding is already stronger than any reviewed site's stated turnaround; it just needs to say what is in it.

Honest version. Fully honest; it is a description of Execile's own document.

### 12. Write the results disclosure now

What to change. Nothing visible today. Record, in the Results section's eventual copy rules, the athenahealth footnote as the standard: results are one practice's, the practice consented, the practice was not compensated, and they are not what every client should expect.

Why. athenahealth footnotes every testimonial: "*These customers are part of our Client Advocacy Program and were not compensated for this content. Their results reflect the experience of one particular practice and are not necessarily what every athenahealth customer should expect." It is the only reviewed site that does, and it is the version of a case study that survives a sceptical reader. Execile's `comingSoon` text already commits to "once they are measured and the client has approved sharing them"; this is the same rule extended to the day they are published.

### What Execile already does at least as well

For the record, because the question was what to add: a phone number in the header (every reviewed site has one; Execile renders `site.phone` in `SiteHeader.tsx`); a free assessment as the single CTA (Practolytics, MBC, ORI, STAT, MedCare, DrCatalyst all lead with it); "no setup fees" and "no long-term contract" in the hero (MBC and AdvancedMD state them, most sites do not); a sourced Problem section (no reviewed site sources a single statistic); a "less of a fit" list (none of the reviewed sites tells anyone they are not a fit); a light page (Execile's structure is closer to ORI's 84 KB than to Tebra's 425 KB and 122 scripts).

---

## The results disclosure rule

Recommendation 12 said to write this now and publish later. Here it is, so that
the first client outcome is not drafted under launch pressure.

When Results mode flips from the coming-soon notice to real numbers, every
published outcome carries, in the same visual block as the number:

1. The measure, named exactly as the practice's own report names it. "Days in
   AR" and "net collections" are measures. "Revenue increase" is not, because it
   does not say increase over what.
2. The baseline and the comparison window, both as dates. "13.5% to 4.1% denial
   rate, Jan to Jun 2027" is a claim. "60% fewer denials" is not.
3. The practice's specialty and provider count, because a number from a
   twelve-provider orthopedic group does not describe a solo dermatologist.
4. A sentence saying the result is one client's and is not a promise.
5. Written consent from the practice, recorded before publication.

athenahealth footnotes every testimonial on
https://www.athenahealth.com/solutions/practice-management with a line saying the
result is that customer's own and not a guarantee. That is the shape. No other
reviewed site does it, and the ones that do not are exactly the sites whose
numbers cannot be checked.

Anything that cannot meet all five stays out. A result that has to be rounded,
averaged across clients, or stated without a window is not ready to publish.

---

## Things not to copy

**Unsourced outcome statistics.** "98% first-pass" (CureMD, Practolytics, MBC as 98.4%, MedCare as 98.5%), "30% fewer AR days" (Practolytics), "35% increase in revenue" (MedCare), "40% reduction in claim denials" (STAT), "up to $5 million" lost by solo practices (CloudRCM), "$180K Avg. Annual Loss Per Provider" (MBC). None cites a source, several contradict each other on the same site (CureMD 98% vs 96%; MedCare 150,000 vs 80,000 providers), and MBC's "industry" comparators (91.2% first-pass, 34 days AR) match no published benchmark. Execile's rule that every number is cited already excludes all of these.

**Fake live data.** MBC's "Live Data" label on static numbers and a scrolling ticker of payer "alerts" with emoji icons. It is a dark pattern and it is inaccessible.

**Calculators built on unnamed benchmarks.** Tebra's Revenue Recovery calculator says its assumptions come from "MGMA, KFF, HFMA, and internal Tebra data" without naming a report, and uses a "90% benchmark" for upfront collection that cannot be checked. Execile's assessment is the honest version of a calculator: it uses the practice's own claims. Say so in the assessment lead if a calculator is ever proposed.

**Badge walls.** MedCare's seven badges include bodies ("NILA", "ASRM") that have nothing to do with billing. Tebra's G2 strip is real but is an enterprise SaaS signal a startup cannot earn; do not fake the shape with generic "HIPAA compliant" seal images. A paid HIPAA "seal" (DrCatalyst's Compliancy Group seal) is self-attestation and adds nothing a plain list of controls does not.

**SMS consent blocks on the form.** MBC, MedCare and CloudRCM all bolt a paragraph of A2P 10DLC consent text onto the lead form. Execile has no SMS programme; keep the form to the fields it has plus one collections band.

**Enterprise vocabulary.** MBC's "Defend Your EBITDA", "Your CFO sees", "Realized Yield", "RAC Audit Defense Protocol"; athenahealth's "complex organizations" half of the page. A 1 to 20 provider practice has no CFO. Execile's copy is already pitched correctly and should stay that way.

**Guarantees without terms.** STAT's "we guarantee results" with nothing behind it. If Execile ever offers a guarantee, it should be a specific, terminable one (for example, the month-to-month contract is already a form of it).

**"AI-powered" as the headline.** CureMD ("AI-Powered Healthcare"), MedCare ("AI-Powered Medical Billing"), athenahealth ("AI-native"), Tebra ("Built-in AI"). None of it addresses a small practice's actual objections (cost, control, transition, security, lock-in), and it dates fast.

**Five `<h1>` elements on one page** (CureMD home), images with no `alt` attribute at all (MedCare, 20 of them), and 100 or more script tags (Tebra). Execile's single-page structure should keep one `h1`, alt text on every meaningful image, and the current script count.

---

## Not loaded, for the record

- https://www.athenahealth.com/ home page and https://www.athenahealth.com/solutions/revenue-cycle-management: 403 to curl and the fetch tool, DNS failure once. The two athenahealth pages above were read through the browser pane. The home page was not read.
- https://www.tebra.com/billing-services/ and https://www.tebra.com/medical-billing-services/: 404. The billing pages live under `/billing-payments/`.
- https://www.advancedmd.com/rcm/: 404. https://www.advancedmd.com/pricing/: 403. AdvancedMD's fee range was read from the RCM page FAQ, not a pricing page.
- https://www.curemd.com/pricing/: 404 shell. CureMD's plans are behind `/price-form.asp`, which was not submitted.
- https://practolytics.com/faqs/: 404. The FAQ was read from the home page.
- https://www.aiemedical.com/ (named in search results as a small-practice specialist): the domain is parked for sale at GoDaddy. Not a competitor.
- Tebra's HITRUST and PCI claims appeared in the fetch tool's summary of the home page but not in the saved HTML text; unconfirmed.
- Third-party figures for athenaCollector (98.4% first-pass, "up to 6%") appear on business.com and businessnewsdaily.com, not on athenahealth's own pages read here. Not attributed to athenahealth in this document.

## Sources

- CureMD home: https://www.curemd.com/
- CureMD medical billing services: https://www.curemd.com/medical-billing-services
- Tebra home: https://www.tebra.com/
- Tebra billing and payments: https://www.tebra.com/billing-payments
- Tebra managed (outsourced) billing: https://www.tebra.com/billing-payments/managed-billing
- Tebra pricing: https://www.tebra.com/pricing/
- Tebra billing calculator: https://www.tebra.com/billing-payments/billing-calculator
- AdvancedMD home: https://www.advancedmd.com/
- AdvancedMD revenue cycle management: https://www.advancedmd.com/revenue-cycle-management/
- AdvancedMD in-house vs RCM comparison: https://www.advancedmd.com/revenue-cycle-management/in-house-and-rcm-comparison/
- athenahealth revenue cycle services: https://www.athenahealth.com/solutions/revenue-cycle-services
- athenahealth medical billing and practice management: https://www.athenahealth.com/solutions/practice-management
- Practolytics home: https://practolytics.com/
- Medical Billers and Coders home: https://www.medicalbillersandcoders.com/
- Medical Billers and Coders pricing: https://www.medicalbillersandcoders.com/pricing
- Outsource Receivables Inc.: https://outsourcereceivables.com/
- MedCare MSO: https://medcaremso.com/
- STAT Medical Consulting, small practices page: https://www.statmedical.net/medical-billing-for-small-practices
- DrCatalyst: https://www.drcatalyst.com/
- Neolytix: https://neolytix.com/
- CloudRCM Solutions, independent practice billing: https://www.cloudrcmsolutions.com/independent-practice-medical-billing/
- Execile statistics standard: `docs/research/rcm-problem-statistics.md`
