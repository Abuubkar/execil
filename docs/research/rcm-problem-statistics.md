# Statistics for the four "The problem" cards

Ticket: none — direct request. Researched 2026-09-05 against MGMA, HFMA, CAQH, KFF, CMS, Experian Health and peer-reviewed literature. Every number below carries its source and a verification status; anything I could not open myself is marked and collected at the end.

**Audience constraint that governs everything here.** The page speaks to independent US practices with 1–20 providers. Most published RCM statistics measure hospitals and health systems. A hospital's denial rate or aged-AR percentage is a different number about a different business, and putting one in front of a five-provider practice is a factual misstatement, not a rounding error. Population is called out for every figure.

**Framing constraint.** Execil has no clients and no track record. Every number below is an industry figure attributable to a named third party. None of them may appear on the page without a visible citation, because without one the reader will read them as Execil's own results.

## Verification statuses used

- **VERIFIED** — I fetched the primary document and read the number in it.
- **VERIFIED (abstract)** — the paper's full text is paywalled; the number is in the publisher's own abstract.
- **SECONDHAND** — the number appears only in trade press or search summaries quoting the source; the source itself was not reachable from this environment.
- **UNTRACEABLE** — recycled across blogs with no original study behind it. Never publish.

---

## Summary: what to put on each card

| Card | Recommended number | Source | Population fit |
|---|---|---|---|
| Rising denials | **41%** — of providers say more than 10% of their claims are denied, up from 30% in 2022 | Experian Health, *State of Claims 2025* | Weak — respondent mix undisclosed |
| Rising denials (alternative) | **60%** — of medical group leaders reported denial rates rising year over year | MGMA Stat, 5 Mar 2024 | Strong — medical groups |
| Aged AR nobody works | **13.54%** — median share of AR past **120 days** in multispecialty practices | MGMA DataDive Cost and Revenue, 2021 | Moderate — multispecialty groups, 2020 data |
| No revenue visibility | **25 minutes** — provider time to check one claim's status by phone, the most time-consuming task in the revenue cycle | CAQH Index 2024 | Strong — provider sample weighted 49.7% to 1–4 physician practices |
| Providers not enrolled | **13 wks** — before a new hire is billable with one commercial payer | BCBS of Texas; Ohio Rev. Code 3963.06; La. R.S. 22:1009 | Strong — payer-side, and delegated credentialing is unavailable at this size |

> **Correction (state-statute verification pass).** An earlier draft of this card cited **California AB 1041**. Its 90-day duty is **not yet operative** — the chaptered text reads *"within one year of the operative date of this section"* and never fixes that date, which practically lands around January 2027. Replaced with **Ohio Rev. Code § 3963.06** (90 days, in force since 23 Sep 2008, carrying either $500/day payable to the provider or retroactive reimbursement from day 91 at the payer's election) and **La. R.S. 22:1009** (90 days, in force). Two related traps: **Texas has no statutory credentialing deadline at all** — Tex. Ins. Code ch. 1452 grants expedited *payment* for group-joiners instead, so "BCBS of Texas" is a payer's published ceiling, not state law; and **Colorado's deemed-participating provision is triggered by a missed 7-day receipt, not a missed 60-day decision**, which most vendor blogs state incorrectly.

Two of the four cards need copy changes, not just numbers:

- **Card 2 must say 120 days, not 90.** Every physician-practice primary source — MGMA's own DataDive aging buckets, AAFP's published guidance — treats 120 days as the aged-AR threshold. The 90-day bucket exists in HFMA MAP Keys, whose only physician-practice data is award winners with n=3–7, and HFMA stopped reporting it for physician practices in 2026.
- **Card 3 cannot carry a percentage.** No one has measured "share of practices lacking revenue visibility." Details and reframes in [card 3](#card-3--no-revenue-visibility).

---

## Card 1 — Rising denials

Body copy: *"Denial rates keep climbing while appeal windows quietly close."*

### Recommended

> **41%** of providers say more than 10% of their claims are denied — up from 30% in 2022.

**Source.** Experian Health, *State of Claims 2025*, published 23 September 2025. https://www.experian.com/blogs/healthcare/state-of-claims-2025/ — **VERIFIED**.

> "In 2022, 30% reported that at least 10% of their claims were denied. By 2024, the figure had grown to 38%. Now, in 2025, 41% of providers say their claims are denied over 10% of the time."

Survey fielded June–July 2025, n=250 healthcare professionals responsible for financial, billing or claims decisions.

**Population.** This is the weak point. The respondent composition is **not disclosed** in any publicly fetchable Experian document — not the blog post, not the 2024 report PDF, whose entire methodology statement is: *"This report is based on a survey of 210 healthcare staff responsible for administration in finance, billing, registration, reimbursements, claims and collections. Participants include chief officers, presidents, vice presidents, directors and administrators."* No hospital/practice split, no organisation size, no specialty. The listed titles skew institutional. You cannot claim this describes 1–20 provider practices.

**Currency.** Most current provider-side trend series available. Nothing supersedes it.

**Caveats that must accompany it.**
- It is **self-reported perception**, not measured claims data. Phrase as "providers report," never "denial rates are."
- Cite it visibly as Experian Health, *State of Claims 2025*.

### Alternative with a better population fit

> **60%** of medical group leaders reported their claim denial rates rising year over year.

**Source.** MGMA Stat poll, 5 March 2024, n=235 applicable responses, published 6 March 2024. https://www.mgma.com/mgma-stat/strategic-improvements-in-your-rcm-to-reduce-your-practices-claim-denials — **VERIFIED**.

> "A March 5, 2024, MGMA *Stat* poll found that 60% of medical group leaders reported an increase in their practices' claim denial rates for the current year compared to the same period in 2023. About 29% of respondents said denials are about the same as they saw this time last year, while only 11% said their practices have decreased their claim denials relative to early 2023. The poll had 235 applicable responses."

**Population.** US medical group practices — the correct audience. MGMA does not publish per-poll size or role breakdowns, so "medical groups" is as granular as it gets.

**Currency.** Two and a half years old. It is the most recent free MGMA figure on denial direction I could find; the denial-rate benchmark itself sits inside paid DataDive.

**Best use.** Pair it with the Experian number: Experian gives the trend line, MGMA establishes that practices — not just hospitals — report the same thing.

### The measured benchmark, for the honest version

MGMA's own measured first-pass denial rate is **8%**, single-specialty aggregate, from 2023 MGMA DataDive Practice Operations — and the same page notes it is unchanged from 2019 (**VERIFIED** on the MGMA Stat page above).

The peer-reviewed number, for physician ("professional") claims:

**Source.** Weinreb, Gabe G., and Bruce E. Landon. "Variation in medical claim denials: safety-net providers are hardest hit." *Health Affairs Scholar* 4(8), August 2026, qxag206. DOI 10.1093/haschl/qxag206. Open access. https://academic.oup.com/healthaffairsscholar/article/4/8/qxag206/8753776 — **VERIFIED**.

Initial denial rates, professional (physician) claims:

| Payer | Initial denial rate |
|---|---|
| Commercial | 7.8% |
| Medicare Advantage | 10.5% |
| Medicaid managed care | 15.1% |

Non-safety-net providers, professional claims: **9.2% initial, 4.5% final**. Safety-net: 13.6% initial, 7.3% final. Overturn rates on professional claims: commercial 46.4%, MA 60.8%, Medicaid 51.1%.

Underlying data: 234.2 million claims, 150+ health plans, 95M+ enrollees — but **calendar year 2019**. Seven-year-old claims, published 2026. It is the most rigorous physician-practice denial rate in existence and it is a single cross-section, so it cannot support "climbing."

**If the page needs a defensible physician-practice denial percentage rather than a trend, this is it: ~9% of physician claims denied on first submission.**

### Numbers to avoid on this card

**19–20% (KFF).** KFF, "Claims Denials and Appeals in ACA Marketplace Plans in 2024," published 24 March 2026. https://www.kff.org/patient-consumer-protections/claims-denials-and-appeals-in-aca-marketplace-plans-in-2024/ — **VERIFIED**. Insurers on HealthCare.gov denied 19% of in-network and 37% of out-of-network claims, 20% combined. Three reasons not to use it:

1. It measures HealthCare.gov qualified health plans only — it excludes state-based marketplaces, all group coverage, Medicare and Medicaid. That is a slice of a practice's payer mix, not its denial rate.
2. It is post-service claims only; prior-authorisation denials are not in the dataset.
3. It **contradicts** the card's own headline: KFF describes 2024 as "similar to 2023." This source shows flat, not rising.

The KFF appeal figures (fewer than 1% of denied claims appealed, 66% of appeals upheld) are **consumer** appeals. They are not provider rework and must not be repurposed as such.

**11.8% (Kodiak Solutions).** Kodiak's Revenue Cycle Analytics reported an 11.81% initial denial rate for 2024 across "more than 2,100 hospitals and 300,000 physicians" — **SECONDHAND** (businesswire returned 403; read via press-release mirrors). Physicians on a platform sold alongside 2,100 hospitals are overwhelmingly health-system-employed, so the blended rate is hospital-weighted. Separately, vendor blogs misattribute this exact number to an "MGMA 2024 Cost and Revenue Report." **It is not MGMA's.** MGMA's published figure is 8%.

**"65% of denied claims are never resubmitted."** **UNTRACEABLE — do not publish.** It appears verbatim in HFMA's "Success in Proactive Denials Management and Prevention" (https://www.hfma.org/revenue-cycle/denials-management/61778/): *"Up to 65 percent of denied claims are never resubmitted."* HFMA's own footnote for that sentence points to a **vendor blog post** — M. Callahan, "Strategic Denials Management," RevSpring, 13 June 2018 — and the trail ends there. Elsewhere the same number is attributed variously to MGMA, Change Healthcare and Advisory Board, none of which publish it. Contradictory attribution is the signature of a laundered figure.

The honest replacement, if the "denials go unfought" angle is wanted, is Weinreb and Landon's own sentence: *"Appealing denials is costly: 1 study found that appeal costs equaled roughly half the denied revenue. As a result, many denied claims are never appealed."* Peer-reviewed, and deliberately without a percentage.

**AMA National Health Insurer Report Card.** **Defunct.** Launched 2008, last edition 2013. No successor. Its denial rates are thirteen years stale and measured differently. Remove it from the source shortlist.

**Change Healthcare Revenue Cycle Denials Index.** Last edition 2020, hospital-oriented, no longer published since the Optum acquisition. Beyond staleness, the 2024 Change Healthcare breach makes the brand a liability to cite on a medical billing company's own marketing page.

### On "appeal windows quietly close"

There is **no statistic** showing appeal windows shortening, or measuring how often practices miss them. Nothing in MGMA, KFF, HFMA, Health Affairs or Experian speaks to it. As written, that half-sentence is the most exposed claim on the card.

What *is* citable is that the windows are short and fixed. Medicare's level-one appeal:

> A request for redetermination must be filed within **120 calendar days** from the date the party receives the notice of initial determination (receipt presumed 5 days after the notice date).

42 CFR 405.942; CMS *Medicare Claims Processing Manual*, chapter 29. https://www.cms.gov/Regulations-and-Guidance/Guidance/Manuals/Downloads/clm104c29pdf.pdf — **SECONDHAND** (ecfr.gov redirects to an interstitial from this environment; the rule text was confirmed through the eCFR and govinfo listings, not opened directly).

That fact ties cards 1 and 2 together and is worth using: **a claim that has been sitting in AR past 120 days has already burned the entire Medicare level-one appeal window.** That is the real mechanism behind "sit untouched until they time out," and it is a regulation, not a survey.

Recommended copy fix: change "appeal windows quietly close" to something the citation actually supports — the window is fixed and short, and aged AR runs it out.

---

## Card 2 — Aged AR nobody works

Body copy: *"Claims past 90 days sit untouched until they time out."*

### Recommended

> **13.54%** of accounts receivable sits past 120 days — the median for multispecialty practices.

**Source.** MGMA Stat, "Not-so-graceful aging: Half of practices saw days in A/R increase in 2021," published 11 November 2021, citing 2021 MGMA DataDive Cost and Revenue. https://www.mgma.com/mgma-stats/not-so-graceful-aging-half-of-practices-saw-days-in-a-r-increase-in-2021 — **VERIFIED**.

> "the median for total A/R over 120 days in multispecialty practices is 13.54%"

The same poll (9 November 2021, n=587): 49% said days in AR increased that year, 15% decreased, 37% stayed the same.

**Population.** Multispecialty practices. Ownership and practice size are not stated, so this is not specifically independent 1–20 provider practices — but it is physician-practice data, which is what matters against the hospital alternative.

**Currency.** 2020 performance year, published 2021. **Five years old.** MGMA publishes annually and the 2025 and 2026 editions exist, but they are behind DataDive membership. Every free route to a current MGMA aged-AR figure is closed.

**Caveats.**
- **The card must say 120 days, not 90.** MGMA's aging buckets and AAFP's guidance both use 120 days as the aged-AR threshold for physician practices. There is no credible physician-practice 90-day median.
- Cite it as an industry benchmark, not as a description of the reader's practice.
- Show the year in the citation. A five-year-old number presented undated is the kind of thing a prospect catches.

### A pairing that looks tempting and is not safe

MGMA, "Data Mine: Measuring success," published 14 December 2021, citing the *same* 2021 DataDive Cost and Revenue survey. https://www.mgma.com/articles/data-mine-measuring-success-finding-the-right-metrics-to-optimize-the-revenue-cycle — **VERIFIED**.

> Better Performers keep "more than 70% of their A/R in the less-than-30-days category and only 8.1% of A/R in the more-than-120-days category" — "53% less than the median."

The 8.1%-vs-median contrast is exactly the "nobody works it" story. But **MGMA's own two pages disagree.** If 8.1% is 53% below the median, the median is about 17.2% — not the 13.54% the November page gives for the same metric, same survey, same population, published one month earlier. 8.1/13.54 is a 40% reduction, not 53%.

**Do not print the two numbers side by side as a contrast.** One of MGMA's pages is wrong and there is no way to tell which. Use 13.54% alone, or use the Better Performers figures alone, never as a pair.

### Days in AR

No verifiable current figure exists for independent practices.

**"MGMA 2024 Cost and Revenue Survey: median 47 days in A/R, better performers 36 days"** recurs verbatim across at least four billing-vendor blogs, none of which links to an MGMA source. It may well be genuine — DataDive is paywalled — but it is **SECONDHAND** with no traceable citation, which makes it unusable on a page whose whole premise is checkable claims.

What *is* verified, and useful as a floor:

**Source.** HFMA, "2024 MAP Award Statistical Data." https://www.hfma.org/wp-content/uploads/2024/07/MAP_230608_Winner-Resources_Stats-2024.pdf — **VERIFIED** (text extracted from the PDF).

MAP Award for High Performance in Revenue Cycle, **Physician Practice Winners**:

| Award year | n | Net days in AR (median) | Aged AR ≥90 days (median) | Claim denial rate (median) |
|---|---|---|---|---|
| 2024 | 3 | 21.9 | 10.8% | 3.2% |
| 2023 | 5 | 23.3 | 12.3% | 3.7% |
| 2022 | 7 | 27.7 | 14.2% | 4.7% |

Percentile spreads on aged AR, for scale: 2024 — 7.9% / 10.8% / 14.8% (75th / 50th / 25th); 2023 — 11.5% / 12.3% / 12.6%; 2022 — 6.8% / 14.2% / 15.5%.

**Population.** HFMA MAP Award *winners* — self-selected, best-in-class applicants, almost certainly large groups and health-system-affiliated physician enterprises, with n between 3 and 7. **This is not an industry average and must never be shown as one.**

The defensible inference is a conservative one: even among award-winning physician practices, the median has **11–14% of AR past 90 days**. A typical independent practice is worse than that. If the page wants a 90-day number at all, this is the only physician-practice source for it, and it has to be labelled as award winners.

For contrast, the same PDF's hospital sections (n=14 in 2024) show a median of **29.8%** of AR past 90 days and 38.3 net days in AR. That gap is exactly why hospital benchmarks cannot be shown to a five-provider practice.

**HFMA dropped this metric.** https://www.hfma.org/wp-content/uploads/2026/07/MAP_2026_MAP-Award-Stat-Sheet.pdf — **VERIFIED**. The 2026 sheet's physician-practice columns are Net Days in A/R, Charge Lag, POS Cash Collection, Cash Collection as % of NPSR and **Denial Write-Off**. "Aged A/R 90 Days and Greater" is gone. 2026 physician practice (n=5) medians: net days in AR **18.5**, charge lag 3.1 days, denial write-off **1.0%**.

So the 2024 sheet is the most recent HFMA physician-practice 90-day figure that will ever exist, and nothing supersedes it.

### Targets, not benchmarks

AAFP, Practice Finances and Revenue Cycle Management. https://www.aafp.org/practice-operations/practice-finances — **VERIFIED**:

> "Days in A/R should stay below 50 days at minimum; however, 30 to 40 days is preferable."

AAFP also notes that a good overall days-in-AR figure "can also mask elevated amounts in older receivables," and steers practices to the **"A/R greater than 120 days"** benchmark — independent confirmation that 120 days, not 90, is the physician-practice threshold.

This is guidance with no survey behind it. Usable as "the specialty society's target," never as "the industry average."

### Patient AR — different metric, same story

MGMA Stat, "A structured approach to collecting patient A/R," poll 6 December 2022, n=519, published 7 December 2022. https://www.mgma.com/mgma-stats/a-structured-approach-to-collecting-patient-a-r — **VERIFIED**: 42% wait 91–120 days before sending to collections, 32% wait 120+ days, and **10% never send accounts to collections**.

This is **patient** balances, not payer claims. Using it requires rewording the card body from "claims" to "patient balances." Flagged because the 10%-never figure is genuinely on-message and easy to misuse.

### Most current MGMA data point

MGMA Stat, "Detecting and fixing leaks across the revenue cycle," poll 6 January 2026, n=288, published 7 January 2026. https://www.mgma.com/mgma-stat/detecting-and-fixing-leaks-across-the-revenue-cycle — **VERIFIED**.

> "Our Jan. 6, 2026, MGMA Stat poll found the biggest revenue cycle leaks for practices today are denials and appeals (48%), followed by front end issues (23%), billing/collections (14%), coding (13%), and charge posting (2%)."

Eight months old rather than five years. It supports a "claims get stuck and stay stuck" headline but is not an AR-aging percentage.

---

## Card 3 — No revenue visibility

Body copy: *"You learn about collection problems weeks after they happen."*

### There is no statistic for this. Do not invent one.

Nobody has measured the share of practices lacking revenue visibility, financial dashboards, or timely KPI reporting. Searched: MGMA Stat archive, CAQH Index, Experian Health *State of Claims* (2024 and 2025), HFMA, AMA, and the peer-reviewed literature.

**The number that looks perfect is fake.** "Only 15% can detect and respond to revenue cycle issues within 1–2 days" traces to an RCM vendor's product page (encoda.com) with no sample size, no fielding date, no named survey and no methodology. It is the closest-fitting claim to the card's copy, which is exactly what makes it dangerous. **UNTRACEABLE — do not publish.**

**Experian has never asked the question.** The nearest items in *State of Claims* are cause attribution (50% cite missing or inaccurate data) and 48% who "review denials manually then assign to a manual work queue." Neither is a visibility or lag measurement.

**The hospital surveys don't transfer.** The Smarter Technologies / MedCity News 2025 RCM survey (n=125) sizes respondents by *annual patient discharges* — roughly 76% are hospitals. A 1–20 provider practice has no discharges. It contains no visibility statistic in any case.

### Recommended reframe — keep the meaning, change the proof

> **25 minutes.** Checking where a single claim stands still means a 25-minute phone call — the most time-consuming task in the entire revenue cycle.

**Source.** CAQH, *2024 CAQH Index Report*, published 2024, covering calendar year 2023. https://www.caqh.org/hubfs/Index/2024%20Index%20Report/CAQH_IndexReport_2024_FINAL.pdf — **VERIFIED** (text extracted from the PDF).

> "The drop in manual volume is impactful as the time it took medical providers and staff to conduct an inquiry by phone was the highest among all the administrative tasks reported — 25 minutes per inquiry."

Supporting figures from the same report's methodology tables:

| Claim status inquiry, medical | Manual (phone/mail/fax/email) | Partial (portal/IVR) | Fully electronic |
|---|---|---|---|
| Provider time per inquiry | **25 min** (min 1, max 60) | 10 min | 7 min |
| Provider cost per inquiry | **$13.80** | $5.24 | $3.64 |

By comparison, prior authorisation takes providers 24 minutes manually and 16 minutes through a plan portal. Claim status is the worst of the ten transactions measured.

**Population — this is the reason to prefer CAQH over everything else.** The Index weights its provider results to the AMA Physician Practice Benchmark Survey. The published weighting table gives the medical provider population as:

| Specialty | Practice size | Share |
|---|---|---|
| Generalist | 1–4 | 26.9% |
| Generalist | 5–50+ | 19.8% |
| Specialist | 1–4 | 19.6% |
| Specialist | 5–50+ | 18.1% |
| Behavioralist | 1–4 | 3.2% |
| Behavioralist | 5–50+ | 2.4% |
| Hospitalist (hospital-based) | Hospital | 9.7% |

**49.7% of the weighted provider population is practices of 1–4 physicians; only 9.7% is hospital-based.** That is the closest population match to this page's audience found anywhere in this research.

**Why it earns the card's argument.** Nobody makes 25-minute phone calls often enough to catch a collection problem early. The statistic is about effort, and the conclusion — you find out weeks late — follows from it honestly, without asserting anything unmeasured.

### Second option — automation

> **62%** of medical groups have automated 40% or less of their revenue cycle.

**Source.** MGMA Stat, poll 27 February 2024, n=226 applicable responses, published 28 February 2024. https://www.mgma.com/mgma-stat/steps-toward-revenue-cycle-automation-vary-across-medical-groups — **VERIFIED**. Breakdown: under 20% automated — 36%; 21–40% — 25%; 41–60% — 20%; over 60% — 17%; other — 1%. MGMA's own summary sentence states 62%.

Unambiguous population (medical groups), no interpretive stretch, and it is a percentage, which is what the card's layout wants. It is a weaker fit for "you find out too late" than the 25-minute figure, but it is honest.

### Third option — benchmarking cadence

> **15%** of medical groups never benchmark their data against external sources; another **41%** do it only once a year.

**Source.** MGMA Stat, poll 12 December 2023, n=332, published 13 December 2023. https://www.mgma.com/mgma-stat/from-data-to-action-the-crucial-role-of-healthcare-benchmarking — **VERIFIED**. Annually 41%, at least monthly 24%, quarterly 15%, never 15%, other 4%.

**Caveat.** This measures *external* benchmarking, not internal reporting cadence. It does not literally say practices lack visibility into their own revenue. It is the closest real cadence number that exists, and the gap between what it measures and what the card claims has to be respected in the copy.

### Fourth option — drop the number

The other three cards carry hard statistics. One card making a qualitative claim reads as honest, not weak. It is unambiguously better than publishing the Encoda figure, which would not survive a prospect asking where it came from.

### A number to avoid

**"81% claim status inquiry adoption, 2025 CAQH Index."** **SECONDHAND** — seen only in a search summary. The 2025 Index (released 19 February 2026) is gated: a free account gets the executive summary, the full Index Pro dashboard is paid. The 2025 press release confirms $258 billion in administrative cost avoided in 2024, a remaining $21 billion opportunity, more than 600 participating organisations representing 63% of insured lives, and that more than 50% of health plans and 25% of provider organisations use AI in administrative workflows — but **not** the 81%. Use the verified 2024 figures instead.

### Two things to know before citing CAQH at all

1. **The adoption percentages are shares of transaction volume, not shares of practices.** The report states adoption rates are "calculated using only medical and dental plan reported volumes." 2024 medical claim status: 80% fully electronic, 18% partially electronic, 2% fully manual. Writing "20% of practices still check claims manually" would be wrong. The provider *time and cost* figures are the ones drawn from the practice-weighted provider survey — those are the ones to quote.
2. **CAQH is now DataSpring, and it is payer-owned.** CAQH converted from nonprofit to for-profit in January 2026 and rebranded as DataSpring on 8 June 2026; ownership sits with twelve shareholders affiliated with health plans including UnitedHealth Group, Centene, Aetna, Elevance, Cigna and Humana ([Fierce Healthcare](https://www.fiercehealthcare.com/health-tech/ahip-2026-caqh-rebrands-dataspring-it-charts-course-future) — **SECONDHAND**). I observed `caqh.org` URLs 301-redirecting to `dataspring.com` directly during this research. Two consequences: **caqh.org citation links will rot**, so link the PDF on hubfs and record the report title and year in the citation text; and a page arguing that payers make practices' lives difficult is citing a body the payers now own, which a sharp reader may notice.

---

## Card 4 — Providers not enrolled

Body copy: *"New hires see patients before payers will pay for them."*

### Recommended

> **13 wks** before a new hire is billable with a single commercial payer.
>
> Alternative, single-source and more aggressive: **15 wks** — UnitedHealthcare's own published sequence.

No one publishes an industry-average enrolment timeline, so this is built from named payers' own published statements and one state statute rather than from a survey. The range is defensible because both ends are quoted, not estimated:

| Source | Credentialing | System loading / contracting | Total |
|---|---|---|---|
| Cigna (own site) | 45–60 days | +10 business days to directories and claim systems | ~8–10 wks |
| UnitedHealthcare ([provider site](https://www.uhcprovider.com/en/resource-library/Join-Our-Network/Medical-Provider.html), Credentialing Plan 2025–2027) | *"up to 45 calendar days or more"* | *"up to 60 days for your contract to be loaded"* | ~15 wks |
| Arizona SB1291 (statutory ceiling, eff. Apr 2026) | 60 calendar days | 30 days to load into billing system | ~13 wks |

**Population.** Payer-side timelines apply to any non-delegated practice, which is essentially all independent 1–20 provider practices. Large groups and health systems can hold **delegated credentialing** agreements that let them credential their own providers and shortcut this entirely — so this is a number that describes small practices specifically and *understates* nothing for them. Worth saying so on the page: the delegation escape hatch is not available at this size.

**Currency.** Cigna's page is undated; UnitedHealthcare's FAQ is dated 31 July 2024; the Arizona statute takes effect 1 April 2026. All current.

**Caveats.**
- Cite the payers by name. There is no industry average to point at, and inventing one is exactly the trap.
- The clock only *starts* on a complete application. CAQH attestation lapses, missing primary-source verification responses and unsigned contracts all sit outside these published windows.
- This is **per payer**. A practice contracting with eight payers runs eight of these clocks, and the card can say so without needing another number.

### Addendum — deeper verification pass

A follow-up pass corrected and extended this card. **The UnitedHealthcare figure above was previously recorded as 14 days; the page was re-fetched twice including raw HTML and publishes "up to 45 calendar days or more."** The table is corrected.

**Why 13 wks (90 days) is the recommended number.** It converges from three independent source types, which is what makes it defensible rather than merely quotable:

- a payer's own published ceiling (BCBS of Texas, *"may take up to 90 days"*),
- state statute (California AB 1041, chaptered Oct 2025, 90 days; Louisiana R.S. 22:1009, 90 days),
- and roughly CMS's own 100%-completion standard for PECOS enrolments requiring development (85–100 days, Medicare Program Integrity Manual ch. 10, Rev. 13717, issued 08 Jul 2026).

**The single best quote for this card's message.** BCBS of Montana, verbatim: *"The effective date of the agreement is the credentialing approval date. **Effective dates are not backdated.**"* A payer stating outright that work done before approval is never paid.

**CMS's own worked example** (Program Integrity Manual ch. 10) reads as though written for this card: a physician starting 1 March, application filed 1 May, approved 1 June, gets an effective date of 1 May and a retrospective billing date of 1 April — *"claims submitted for services provided before April 1 will not be paid."* Two months of patient care, permanently unbillable. 42 CFR 424.521(a)(1) caps retrospective billing at 30 days; the same rule applies to reassignments under §424.522, i.e. to a new hire joining an existing practice.

**A backdating contrast worth using:** Medicaid provider agreements may be retroactive up to a year (42 CFR 431.108); Medicare backdates 30 days; commercial payers typically do not backdate at all.

**Delegated credentialing threshold.** Delegation requires roughly 100–150+ providers (SECONDHAND — consistent across independent vendor sources, no primary standard located). A 1–20 provider practice will essentially never qualify, so these payer timelines apply to this page's audience in full.

**Four clocks, and most sources blur them.** (1) CAQH profile re-attestation, every 120 days. (2) Primary-source-verification freshness, 120–180 days. (3) The credentialing committee decision — what nearly every published "60/90 days" measures. (4) **Contracting and loading into the claims system — the leg that actually gates billing, and the one almost nobody quotes.** UHC's "up to 60 days" is the best primary source found for leg 4. A card implying "can't bill" needs legs 3 *and* 4.

### The revenue-impact figure — traced to origin, and unusable

The "$7,500–$30,000 lost per provider" family collapses cleanly under tracing.

MGMA published it and named its source ([MGMA Stat, 24 Aug 2021, n=425](https://www.mgma.com/mgma-stat/more-than-half-of-practices-report-credentialing-related-denials-on-the-rise-in-2021)): *"According to a 2019 Merritt Hawkins survey on physician inpatient/outpatient revenue, a one-day delay in provider onboarding can cost a medical group $10,122."*

The Merritt Hawkins figure is verified at its own press release: *"Physicians generate an average $2,378,727 per year in net revenue on behalf of their affiliated hospitals"* — methodology: *"The survey asked hospital chief financial officers to quantify how much revenue physicians in 18 specialties generated for their hospitals."* The arithmetic closes exactly: $2,378,727 ÷ 235 working days = $10,122.24. The rival "$9,000/day" variant is the same number ÷ 260 days.

So the whole family descends from a **2019 survey of hospital CFOs about hospital net revenue**. It is seven years old, measures hospital inpatient/outpatient revenue rather than independent-practice collections, is a modelled opportunity cost rather than a credentialing study, and is inflated by hospital-affiliated specialists. **UNUSABLE for a 1–20 provider independent practice.**

### Clean negatives — so nobody cites these wrongly

- **The CAQH Index does not cover credentialing.** Full-text search of the 2023 report returns zero hits for "credential"; it measures HIPAA transactions. Its "$21 billion" is administrative-transaction waste — do not repurpose it for this card.
- **NCQA sets no maximum time for a credentialing decision.** Its numbers are data-*freshness* caps; the popular "180 days across the board" claim is wrong. Recredentialing is every three years, which contradicts MGMA's uncited "2 years."
- **No peer-reviewed study** (Health Affairs, JAMA) measures credentialing turnaround or time-to-first-claim.
- **Aetna, Anthem and Molina timelines are UNVERIFIED** — all three block automated fetching, and the widely quoted figures come only from vendor blogs. Do not cite.
- **AMA's "up to 180 days"** covers credentialing + privileging + payer enrolment together, is hospital/resident-framed, and has no methodology. The AMA's model Timely Physician Credentialing Act is advocacy — what the AMA thinks payers *should* do, not a measurement.

### The distinction the card depends on

"Credentialing" and "can bill for this provider" are not the same clock, and payers publish only the first one. A new hire is unbillable until **credentialing, contracting, and system loading** are all complete. Payers' own documents are the best citation available here — they are primary, public, and unarguable.

**UnitedHealthcare**, *Credentialing and recredentialing for health care professionals: Frequently asked questions*, document PCA-1-24-02320-UHN-FAQ_07312024, dated 31 July 2024. https://www.uhcprovider.com/content/dam/provider/docs/public/resources/join-network/Credentialing-FAQs.pdf — **VERIFIED** (text extracted from the PDF).

> "The entire credentialing process generally takes up to 14 calendar days to complete once we have a completed application and all required information."

> "You're required to complete both the credentialing and contracting processes to begin seeing UnitedHealthcare members as an in-network provider"

> "Please allow up to 60 days for your contract to be loaded into our systems once credentialing is approved and a signed contract has been received. This will prevent your claim from being denied or paid at an out-of-network level."

That last sentence is the whole card, written by the payer: **up to 60 days of system loading after credentialing is already approved**, during which claims are denied or paid out of network. And the 14-day credentialing clock only starts once the application is complete — CAQH attestation current, primary source verification responses in.

Note that search engines still surface an older "up to 45 calendar days" version of UnitedHealthcare's credentialing answer. The current document says 14. Quote the current PDF.

**Cigna**, Health Care Provider Credentialing. https://www.cigna.com/health-care-providers/credentialing — **VERIFIED**.

> "This typically takes 45 to 60 days to complete"

measured from receipt of the application packet, plus: approved providers' information is uploaded "into our directories and claim systems which typically happens within 10 business days."

**How to use these.** Two named national payers, published on their own sites, give **45–60 days** (Cigna, credentialing) and **up to 60 days** (UnitedHealthcare, contract loading *after* credentialing approval). A card reading **"60+ wks"** would not be supportable from these; **"8–12 wks"** for a single commercial payer is, and multiplies by the number of payers a practice contracts with. State the payer names in the citation rather than implying an industry average — no one publishes one.

### State law, as an independent measure of "how long is too long"

A handful of states now put payers on a statutory credentialing clock. These are excellent citations — legislatures, not vendors — and they establish the ceiling the industry itself considers reasonable.

**Arizona SB1291**, "health insurers; provider credentialing; claims," effective 1 April 2026. https://www.azleg.gov/legtext/57leg/1R/summary/S.1291HHS_ASPASSEDCOW.DOCX.htm — **VERIFIED** (Senate fact sheet, as passed Committee of the Whole).

> "conclude the provider credentialing process within 60 calendar days"

> "load the applicant's information into the billing system within 30 days"

Both keyed to receipt of a complete credentialing application. The bill also requires

> "a provider to receive payment from a health insurer for services provided from the date included on the notice of complete credentialing application to the date the provider's network participation contract is executed"

— which is a legislature stating, in law, that the gap between "seeing patients" and "getting paid for them" is a real and unacceptable problem. That third quote is arguably better copy support than any timeline number.

**Caveat.** This is the Senate fact sheet for a bill as passed COW, not the enrolled statute. The relationship between the 60-day and 30-day clocks (sequential or concurrent) is not unambiguous in the summary. Before quoting a combined "90 days," someone should read the enrolled bill text. Other states reported to have similar statutes — Colorado SB21-126, Illinois, Indiana, Virginia — were seen only in vendor blogs here and are **UNVERIFIED**.

### The hard regulatory anchor

Whatever timeline number goes on the card, this is the fact that gives it teeth, and it is a federal regulation rather than a survey:

> Medicare permits retrospective billing for **at most 30 days** before a provider's enrolment effective date (90 days only where a presidentially-declared disaster precluded enrolment).

42 CFR 424.521. https://www.law.cornell.edu/cfr/text/42/424.521 — **VERIFIED** via Cornell LII (ecfr.gov redirects to an interstitial from this environment). Applies to physicians, non-physician practitioners and fourteen other supplier categories.

Thirty days is a ceiling, not a cushion. A practice that starts a new hire seeing Medicare patients while enrolment is pending has an unbillable gap for every day beyond 30, and no retroactive rule recovers it. That is the mechanism the card's body copy describes, stated exactly.

**CMS does not publish a headline enrolment turnaround time.** I read MLN9658742, *Medicare Provider Enrollment* (December 2025), which is CMS's own provider-facing booklet: it states no processing timeframe at all. Its only day counts are obligations on the *provider* — respond to MAC information requests within 30 days, decide on participating status within 90 days of the approval letter, report ownership changes within 30 days. Any "Medicare takes N days" figure therefore comes from an individual MAC's published service standard, not from CMS centrally, and MAC pages were unreachable from this environment. **Do not put a Medicare processing time on the card without opening a specific MAC's page and citing that MAC by name.**

### The revenue-impact numbers are all fake

There is a family of figures in circulation — "$6,000–$8,000 per provider per month," "$12,500 per month per payer," "$7,500 per day," "$30,000 per month" — purporting to quantify revenue lost to credentialing delay. **UNTRACEABLE — do not publish any of them.** Every appearance is on a credentialing vendor's own blog. They are mutually inconsistent by more than an order of magnitude, and none names an original study, a sample, or a method. The inconsistency is the tell: these are marketing numbers, not measurements.

A January 2026 "survey of 214 US healthcare organizations" reporting that four in ten lose up to $50,000 monthly is published by a vendor (Intelliworx) with no methodology statement available; treat as **UNTRACEABLE** unless a methodology surfaces.

If the card needs to convey financial impact, the honest route is the mechanism rather than a dollar figure: a provider seeing patients outside the 30-day Medicare retrospective window is generating unbillable visits, and UnitedHealthcare's own FAQ says claims during contract loading are "denied or paid at an out-of-network level."

---

## Cards where no defensible statistic exists

**Card 3, "No revenue visibility" — confirmed gap.** No credible measurement exists of practices lacking revenue visibility or timely financial reporting. The best-fitting number in circulation is vendor marketing with no study behind it. Recommended: replace the percentage with the CAQH 25-minute figure, or use the MGMA automation figure (62%), or drop the number and let the card carry qualitative copy.

**Card 1's "appeal windows quietly close" — confirmed gap.** No statistic shows appeal windows shortening or measures missed deadlines. Replace with the fixed-window fact: Medicare's level-one appeal closes 120 days after the initial determination (42 CFR 405.942), which is the same threshold at which MGMA and AAFP consider AR "aged."

**Card 2's "90 days" — wrong threshold.** No credible physician-practice 90-day AR median exists outside HFMA's award-winner data (n=3–7). Change the card to 120 days, where MGMA and AAFP both have published benchmarks.

**Card 4's revenue impact — confirmed gap.** No credible figure exists for revenue lost per provider during enrolment. Every circulating number is vendor marketing. The timeline itself (8–13 weeks) is well sourced from payers' own documents, so the card works without a dollar figure.

**Card 4's Medicare timeline — no central figure.** CMS publishes no enrolment processing time in its own provider booklet. Any Medicare number must come from a named MAC's published service standard.

---

## Publishing rules for whatever ships

1. **Every number gets a visible citation** — organisation, report name, year — next to or beneath the figure. Without it, a reader on a billing company's homepage reads any percentage as that company's own result. Execil has no results.
2. **Date the older figures in the visible citation.** The MGMA aged-AR number is 2020 data. Shown undated it looks like a current claim about the reader.
3. **Name the population where it is not the reader's.** "Multispecialty practices," "award-winning physician practices," "providers surveyed."
4. **Never present survey perception as measured rate.** "41% of providers say" — not "41% of claims."
5. **Never use these:** the 65%-never-resubmitted figure, the Encoda 15% visibility figure, the "MGMA 47 days in AR" figure, the 11.8% attributed to MGMA, the AMA National Health Insurer Report Card, the KFF 19–20% as a practice denial rate, and every dollar-per-provider-per-month credentialing-delay figure.

## Untraceable figures encountered, for the record

Four separate numbers that fit these cards perfectly turned out to have no source. All four are in wide circulation and any of them could plausibly have ended up on the page.

| Figure | Where it fails |
|---|---|
| "Up to 65% of denied claims are never resubmitted" | HFMA's footnote points to a 2018 vendor blog; attributed elsewhere to MGMA, Change Healthcare and Advisory Board, none of which publish it |
| "Only 15% can detect and respond to revenue cycle issues within 1–2 days" | An RCM vendor product page; no sample, date, or method |
| "MGMA 2024 Cost and Revenue: median 47 days in AR" | Four vendor blogs, none linking to MGMA; MGMA page confirming it does not exist publicly |
| "$6,000–$30,000 lost per provider per month to credentialing delay" | Credentialing-vendor blogs only; figures inconsistent by more than 10x |

Also misattributed rather than invented: **11.81%** is Kodiak Solutions' hospital-weighted initial denial rate, not MGMA's. MGMA's published number is 8%.

---

## Not confirmed from a primary source

- **Experian Health respondent composition.** Undisclosed in every fetchable Experian document. `experianplc.com` and `businesswire.com` were unreachable from this environment; the gated full report may disclose it. Worth downloading the gated PDF before publishing the 41% figure.
- **AMA sources generally.** `ama-assn.org` returns HTTP 403 to this environment for both HTML and PDF. The 2025 AMA Prior Authorization Physician Survey (n=1,000 practising physicians, an excellent population match) is real and citable by a human, but nothing from it was verified here.
- **Vabson B, Hicks AL, Chernew ME, "Medicare Advantage Denies 17 Percent Of Initial Claims,"** *Health Affairs* 44(6):702–706, June 2025, DOI 10.1377/hlthaff.2024.01485. Headline figures (17% initial denial rate, 57% of denials overturned, 7% net reduction in provider MA revenue, 2019 data covering 30% of the MA market) are **VERIFIED (abstract)**; healthaffairs.org returns 403. The widely quoted **14.6% physician-claims sub-figure is UNVERIFIED** — it appears only in trade press. Note this paper uses the same 2019 Inovalon data as Weinreb and Landon, so the two are not independent corroboration.
- **MGMA DataDive** in all editions after 2021 is member-paywalled. Every current MGMA denial rate, days-in-AR and AR-aging figure sits behind it. **If the aged-AR card is a central proof point, buying DataDive access is the only route to a current figure with the right population cut** — physician-owned, practice size, specialty. Every free path is closed.
- **CMS *Medicare Claims Processing Manual* chapter 29** and **42 CFR 405.942** were confirmed through eCFR and govinfo search listings rather than opened directly; ecfr.gov redirects to an interstitial from this environment.
- **Kodiak Solutions** figures were read from press-release mirrors, not the Businesswire original (403).
- **The 2025 CAQH Index full report** is gated. Only the executive summary and press release were accessible.
- **Medicare Administrative Contractor processing standards.** The MAC service standards commonly quoted (95% of PECOS web applications within 15 days, paper within 30, paper with site visit within 65) appeared only in search summaries; `medicare.fcso.com` refused the connection. **SECONDHAND.** Open a specific MAC's page before citing any Medicare processing time.
- **Arizona SB1291** was read as the Senate fact sheet, not the enrolled statute. Other states' credentialing statutes (Colorado SB21-126, Illinois, Indiana, Virginia) were seen only in vendor blogs and are **UNVERIFIED**.
- **Cigna's credentialing page carries no date.** Fine to cite, but the timeline could change without notice; re-check before publishing.

## Sources

- MGMA Stat, denial rates poll (Mar 2024): https://www.mgma.com/mgma-stat/strategic-improvements-in-your-rcm-to-reduce-your-practices-claim-denials
- MGMA Stat, days in A/R (Nov 2021): https://www.mgma.com/mgma-stats/not-so-graceful-aging-half-of-practices-saw-days-in-a-r-increase-in-2021
- MGMA, Data Mine: Measuring success (Dec 2021): https://www.mgma.com/articles/data-mine-measuring-success-finding-the-right-metrics-to-optimize-the-revenue-cycle
- MGMA Stat, patient A/R collections (Dec 2022): https://www.mgma.com/mgma-stats/a-structured-approach-to-collecting-patient-a-r
- MGMA Stat, revenue cycle automation (Feb 2024): https://www.mgma.com/mgma-stat/steps-toward-revenue-cycle-automation-vary-across-medical-groups
- MGMA Stat, benchmarking frequency (Dec 2023): https://www.mgma.com/mgma-stat/from-data-to-action-the-crucial-role-of-healthcare-benchmarking
- MGMA Stat, revenue cycle leaks (Jan 2026): https://www.mgma.com/mgma-stat/detecting-and-fixing-leaks-across-the-revenue-cycle
- HFMA, 2024 MAP Award Statistical Data: https://www.hfma.org/wp-content/uploads/2024/07/MAP_230608_Winner-Resources_Stats-2024.pdf
- HFMA, 2026 MAP Award Stat Sheet: https://www.hfma.org/wp-content/uploads/2026/07/MAP_2026_MAP-Award-Stat-Sheet.pdf
- HFMA, MAP Award and Revenue Cycle Score Calculator: https://www.hfma.org/data-and-insights/map-initiative/map-award/
- HFMA, Success in Proactive Denials Management and Prevention: https://www.hfma.org/revenue-cycle/denials-management/61778/
- CAQH, 2024 CAQH Index Report: https://www.caqh.org/hubfs/Index/2024%20Index%20Report/CAQH_IndexReport_2024_FINAL.pdf
- CAQH / DataSpring, Index Report landing page: https://www.dataspring.com/advisory-services/index-report
- KFF, Claims Denials and Appeals in ACA Marketplace Plans in 2024: https://www.kff.org/patient-consumer-protections/claims-denials-and-appeals-in-aca-marketplace-plans-in-2024/
- Experian Health, State of Claims 2025: https://www.experian.com/blogs/healthcare/state-of-claims-2025/
- Weinreb GG, Landon BE, Health Affairs Scholar 4(8) qxag206 (2026): https://academic.oup.com/healthaffairsscholar/article/4/8/qxag206/8753776
- Vabson B, Hicks AL, Chernew ME, Health Affairs 44(6):702–706 (2025): https://www.healthaffairs.org/doi/abs/10.1377/hlthaff.2024.01485
- AAFP, Practice Finances and Revenue Cycle Management: https://www.aafp.org/practice-operations/practice-finances
- UnitedHealthcare, Credentialing and recredentialing FAQs (31 Jul 2024): https://www.uhcprovider.com/content/dam/provider/docs/public/resources/join-network/Credentialing-FAQs.pdf
- Cigna, Health Care Provider Credentialing: https://www.cigna.com/health-care-providers/credentialing
- Arizona SB1291, Senate fact sheet as passed COW: https://www.azleg.gov/legtext/57leg/1R/summary/S.1291HHS_ASPASSEDCOW.DOCX.htm
- 42 CFR 424.521 (Medicare retrospective billing): https://www.law.cornell.edu/cfr/text/42/424.521
- 42 CFR 405.942 (redetermination filing window): https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-B/part-405/subpart-I/subject-group-ECFR3ec6343ada14c59/section-405.942
- CMS, Medicare Claims Processing Manual chapter 29: https://www.cms.gov/Regulations-and-Guidance/Guidance/Manuals/Downloads/clm104c29pdf.pdf
- CMS, MLN9658742 Medicare Provider Enrollment (Dec 2025): https://www.cms.gov/Outreach-and-Education/Medicare-Learning-Network-MLN/MLNProducts/EnrollmentResources/provider-resources/provider-enrolment/Med-Prov-Enroll-MLN9658742.html
- Fierce Healthcare, CAQH rebrands as DataSpring: https://www.fiercehealthcare.com/health-tech/ahip-2026-caqh-rebrands-dataspring-it-charts-course-future
