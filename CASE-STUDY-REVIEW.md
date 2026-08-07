# Case-Study Review — Portfolio Pass

**Reviewed:** 2026-08-06 · Frogslayer · AI Journey Agent · ResearchHub · Pop by inline (inline2)
**Method:** 6-point checklist from the internship handover, applied per study
**Status:** Review only. No portfolio files were edited.

---

## The one finding that matters most

**Your best case study is the one recruiters can't read.**

Public portfolio today = Frogslayer + AI Journey Agent + ResearchHub + an NDA gate page.

Ranked by how well they answer the checklist:

| Rank | Study | Public? |
|---|---|---|
| 1 | **Pop by inline** | ❌ unlinked, `noindex` |
| 2 | ResearchHub | ✅ but zero images |
| 3 | AI Journey Agent | ✅ |
| 4 | Frogslayer | ✅ |

Pop is the only study with a professional sponsor, a quantified outcome, four closed test loops, and named tradeoffs on nearly every paragraph. It is also invisible. Meanwhile the two strongest-written studies (Pop, ResearchHub) have **seven placeholder image slots between them and zero real images**, and the two image-rich studies are the two weaker-written ones.

The portfolio is currently inverted on both axes.

**Highest-leverage action, before any copy edit:** get a shareable version of inline. Not necessarily the full inline2 — a version with the product name, screens, and sponsor-specific mechanics stripped would still carry the four-round arc, the priority-distribution diagnostic, the RSVP decision, and the 7/7 shipped stat. That page beats the current gate page by an enormous margin and needs far less consent than the full one. Ask for consent to publish *methodology and outcomes without product identity* — a much easier "yes" than a blanket portfolio release.

---

## Scorecard

Scale: ✅ strong · ⚠️ partial · ❌ missing

| | Frogslayer | AI Journey Agent | ResearchHub | Pop (inline2) |
|---|---|---|---|---|
| 1. Decision visibility | ⚠️ | ⚠️ | ✅ | ✅ |
| 2. Constraint named | ⚠️ | ⚠️ | ✅ | ✅ |
| 3. Your role separable | ⚠️ | ⚠️ | ✅ | ✅ |
| 4. Outcome + what you'd change | ⚠️ / ❌ | ✅ / ❌ | ❌ / ❌ | ✅ / ❌ |
| 5. 30-second read | ⚠️ | ⚠️ | ❌ | ❌ |
| 6. Dual-read (UX + PM) | ⚠️ | ⚠️ | ⚠️ | ✅ |

Note the fully empty column: **no case study says what you'd change.** Details below.

---

## Cross-cutting issues

### A. Nobody says what they'd do differently

Zero of four studies contain a hindsight statement. Grepped for "would change / next time / in hindsight / limitation / if I had" — one hit, and it's ResearchHub using "limitations" in an unrelated sense.

Why this costs you more than it looks: a PM/Producer reviewer reads a case study with no self-critique as either (a) the project had no failures, which they don't believe, or (b) you haven't evaluated your own work. Both are worse than admitting a miss.

This is also the cheapest fix in the whole review — one h3, three sentences, per takeaways section. Suggested copy in each section below.

### B. Pronoun ratio, per study

| Study | we/our | I/my | Read |
|---|---|---|---|
| Frogslayer | 25 | 6 | Team story with you inside it |
| AI Journey Agent | 16 | 25 | Balanced |
| ResearchHub | 3 | 42 | Clearly yours |
| Pop (inline2) | 0 | 8 | Resume voice — subjectless |

**Frogslayer is the problem.** The Researching section runs twelve consecutive "we" statements before a single "I". A reviewer skimming that section learns what a six-person team did and nothing about what you did — and Researching is the longest section on the page. Your role paragraph says you built the base low-fi flow and the testing prototypes; the sections where that happened never say so.

**Pop has the opposite problem.** It's written subjectless — "Delivered a comparable competitive audit," "Built a single competitive-analysis framework." That's resume grammar. It reads efficiently but it's inconsistent with the other three, and in a case study the missing "I" slightly weakens the ownership claim rather than strengthening it. Match the other pages: use "I."

### C. Process-walkthrough shape — fixable without restructuring

All four use Research → Ideate → Verify. Your portfolio handover says don't restructure the skeleton, and that's correct — cross-page consistency is a real recruiter signal and the skeleton isn't the problem.

**The problem is the h3s inside it.** They're currently methodological, which is what makes the page read as a process walkthrough:

- "Establishing the Evidence Base"
- "Individual Sketching & Feature Selection"
- "Wireframing on the Observed Base Flow"
- "Hi-Fi Prototyping"

Those describe activities. Swap them for decision statements and the identical section skeleton starts reading as judgment:

- "Cutting the brief from four scope areas to a testable one"
- "Choosing upsells over tiers"
- "Merging two sponsor-selected concepts into one"
- "Testing with proxies when real users were off-limits"

Same sections. Same order. Same nav. Nothing restructured. This is the single highest-yield edit across the whole portfolio and it's h3 text only.

### D. Image coverage is inverted

| Study | Real images | Placeholders |
|---|---|---|
| Frogslayer | 12 | 0 |
| AI Journey Agent | 9 | 0 |
| ResearchHub | 0 | 3 |
| Pop (inline2) | 0 | 4 |

The two studies with the best decision-writing have nothing to look at. For a design role, a page of grey `image-slot` boxes reads as unfinished, and unfinished on your *own* portfolio is a worse signal than a thin project. If ResearchHub assets aren't coming soon, consider a screenshot of the shipped platform plus one Figma frame — two images would clear the bar.

### E. Length vs. the 30-second test

Pop is ~2,900 words and Frogslayer ~2,400. Both fail a 30-second scroll on the process sections specifically — the Outcome callouts do their job, then the reader hits a wall of prose.

You don't need to cut. You need **section-opening one-liners**: a single bolded sentence under each `h2` that states the section's conclusion before the evidence. A skimmer reads six bold sentences and has the story; a real reader reads on. Frogslayer's Verifying section already almost does this. None of the others do.

---

## Per-study findings

---

## 1. Frogslayer — Kiosk Interface Design Guidelines

**Overall: strongest research rigor, weakest judgment signal.** This is your most complete UX artifact and your least convincing PM artifact.

### What's working

- The Round 2 A/B test (tier-based vs. upsell-based loyalty) is a **real product decision with a real user-evidence basis**. It is the single best PM moment in your public portfolio.
- Round 2's "reset button untouched in every observed session → replaced with sign-in" is a genuine cut, backed by observation.
- "Prototype as research instrument, not product" in Takeaways is a mature framing and rare in student portfolios.
- Testing at the PMU specifically to simulate arcade noise is a deliberate methodological choice, well explained.

### 1. Decision visibility — ⚠️

The decisions exist but they're **buried inside `InsightCard` components**, which are the lowest-prominence text on the page. The A/B loyalty decision — arguably the best thing in this study — is a two-line card between three other cards. Nothing at h2 or h3 level names a single decision.

**Fix:** promote the A/B decision to the Round 2 focus paragraph as an outcome, not just a question. Currently the focus paragraph asks "Which one actually gets hesitant users to consider joining?" and the answer only appears in a card. State it: *"Upsells won, and we cut tiers entirely — hesitant users engaged with 'spend $20, play with $25' and read tier upgrades as another commitment."*

### 2. Constraint — ⚠️

"Requested problem goal initially arriving vague as 'design kiosk interface guidelines'" is a real constraint, well named. But then the scope narrows to four focus areas and **the page never says what was cut or why.**

A PM reviewer's exact question: kiosks have accessibility requirements, multi-language needs, hardware variation, ADA reach ranges. You picked internal ergonomics, hospitality/entertainment, loyalty, environment. Why those four and not others? What did you tell the sponsor you wouldn't cover?

**Suggested addition** after the focus list:

> Four areas meant three we deliberately didn't take: accessibility compliance, multi-language support, and hardware variation across kiosk manufacturers. Each was defensible on its own, but a 16-week semester validating guidelines across three testing rounds only supports a scope you can actually test in a single venue type. We told Frogslayer that up front rather than delivering thin coverage of everything.

*(Adjust to what actually got cut — the mechanism is what matters: name the alternatives, name the reason, name that you told the sponsor.)*

### 3. Your role — ⚠️

Role paragraph is good and specific. The sections then abandon it — 25 "we" to 6 "I", and Researching is entirely "we."

**Fix, minimal:** three sentences relocated into the sections where your named contributions happened.

- Researching: you ran or co-ran one of the research activities — say which. *"I ran the field observations at the entertainment center and converted each session into a journey map."*
- Ideating: "we imported a base kiosk arcade user flow copied from user observations" → if you built that base flow (your role paragraph says you did), say **"I built the base low-fi flow from the observation journey maps, which the team then wireframed against."**
- Verifying: "the prototype was iterated" → **"I built and iterated the testing prototypes between rounds."**

The claims are already in your role paragraph. They just need to appear where the reader is actually looking.

### 4. Outcome — ⚠️, and there's an internal contradiction

Your **cover subtitle** says: *"Adopted as Frogslayer's guideline reference + collaboration extended."*
Your **outcome callout** says: *"Continued Collaboration Beyond Semester."*

The cover makes the stronger claim (adoption) and the callout — the element specifically designed to carry your strongest fact — makes the weaker one (continued partnership). Continued partnership is nice but reads as "they liked us." Adoption is the actual result.

**Fix:** if adoption is accurate, promote it.

> **Adopted as Frogslayer's internal kiosk guideline reference** — and the partnership with the Purdue UXD Experience Studio extended past our handoff to expand the guideline set.

If adoption *isn't* firmly true, then the cover subtitle is the thing to soften, not the callout to inflate. Don't let the two disagree.

### 5. Length — ⚠️

Longest public page, three carousels, eleven insight cards. The Outcome section does its job in the first screen. Everything after Researching is a wall.

Also: your handover flags 5 unwired iteration images (Card_Loading, Membership_Free, Payment_Button, Reformat, Tier). Those are before/after pairs — the most skimmable content type that exists, and they'd sit exactly where the page currently loses people. Wiring `originalSrc`/`iteratedSrc` into `InsightCard` is probably the highest-value non-copy change on this page.

### 6. Dual-read — ⚠️

- **UX column:** ✅ fully answered. Learned from users, changed design, research rigor is abundant.
- **PM column:** ⚠️ Constraint named but not reckoned with. Nothing was cut on the page. Judgment under scope pressure isn't visible.

The A/B decision + the scope-cut addition above fix roughly 80% of this gap on their own.

### Suggested Takeaways addition

> **What I'd Do Differently**
>
> I'd have pushed the scope conversation harder in week one. We landed on four focus areas after auditing the sponsor's prior prototype, but that audit took most of a sprint — and the scope it produced was the right one, so it should have been the first conversation, not the second. Starting from "here's what we won't cover, tell us if that's wrong" would have bought us a full round of testing.

---

## 2. AI Journey Agent — JourneyTrack

**Overall: the best decision moment in your portfolio lives here, and it's underplayed.**

### What's working

- **"I pitched a rules-based concept direction... it was ultimately not selected... elements of it were integrated into the concepts that were."** This is genuinely excellent. Naming a loss and then naming what survived of it is a maturity signal most senior designers don't put in portfolios. Do not soften this.
- The merge decision (two sponsor-selected concepts → one system, because wireframing revealed heavy overlap) is a real structural call with a stated reason.
- Track 1 / Track 2 parallel-tracks device cleanly separates your work from the partner team's. Best role-separation mechanic on the site.
- "Participated in three of the six one-hour sessions" — precise and honest. Keep this precision everywhere.

### 1. Decision visibility — ⚠️ (close to ✅)

Two strong decisions, both under-framed at the h3 level. Current h3s: "Sketching," "Concept Proposals," "Wireframing & Eventual Merging into One System." The third one is close — it names the decision but as a passive event ("eventual merging") rather than a call someone made.

**Fix:** "Merging Two Sponsor-Selected Concepts Into One" — and add the tension. Right now the merge sounds frictionless. The sponsor picked two directions; you collapsed them into one. Did anyone object? Did you have to re-pitch it? That conversation is the case study.

> Presenting the merge meant telling the sponsor that the two directions they'd selected were, in practice, one product. [What happened next.]

### 2. Constraint — ⚠️, with one constraint that needs owning

"Tight time frame → split into two sub-teams running in parallel across two sprints" is a good structural response to a real constraint. Credit for that.

**But:** the sponsor asked you to test with *UX Design classmates familiar with journey mapping* instead of real platform users, "to avoid setting false expectations." That's stated neutrally and then never addressed. Every PM reviewer will immediately think: *so your usability findings came from proxies, not customers.*

You can't change the constraint, but you should be the one to name its cost — otherwise the reviewer names it for you and concludes you didn't notice.

**Suggested addition** at the end of the Usability Testing subsection:

> Testing with informed proxies rather than platform users is a real limitation, and I flagged it in the handoff. It gave us reliable signal on comprehension and flow — whether someone who understands journey mapping can find and use the agent — but nothing on whether an actual CX strategist would trust it against their real data. Those are different questions, and only the first one was answerable inside the sponsor's constraint.

That single paragraph converts a weakness into evidence of judgment.

### 3. Your role — ⚠️

"Leading concept ideation and exploration" is asserted in the role paragraph, then the Ideating section shows your concept wasn't selected. That's not a contradiction, but a reviewer skimming might read it as one.

**Fix:** make the role claim about the *activity you owned*, not the outcome. If you ran the Crazy 8's sprint and the walkthrough structure, say that — it's true regardless of which concept won, and it makes the not-selected story read as confident rather than compensating.

### 4. Outcome — ✅ (strongest callout on the site), with one caution

"~30 days after handoff, the sponsor announced the AI agent going live in beta — with designs and features that closely mirror the concept our team delivered."

This is your best fact. But "closely mirror" is doing heavy lifting, and a skeptical reviewer will wonder whether the team's work caused the beta or ran parallel to it. Pre-empting that skepticism is stronger than hoping it doesn't occur.

**Optional strengthening** — one clause in the body paragraph, not the callout:

> We weren't in the room for the build, so I can't claim the deliverable caused the release — but [specific feature] appeared in beta in a form we'd prototyped, and that's the closest a semester concept project gets to shipping.

You lose an inch of claim and gain a mile of credibility. Your call whether that trade is worth it — it's a defensible choice either way.

### 5. Length — ⚠️, and the weight is inverted

Researching: 6 figures, longest section. Ideating: 2 figures. Verifying: 1 figure. Iterations: **two sentences.**

The Iterations subsection currently reads in full: *"we then categorized the insights to determine iteration focuses. The resulting iterations focused on agent access, information organization, and user flow simplification."*

That's three nouns. It's the part of the project where design decisions actually got made in response to evidence, and it's the shortest thing on the page. Even under NDA you can describe the *shape* of a change without showing the screen: *"Testers couldn't find the agent from the map view, so we moved its entry point from [X] to [Y]"* names a decision without naming a product surface.

Rebalancing effort from Researching (which is over-covered) to Iterations (under-covered) improves both the 30-second read and the decision score.

### 6. Dual-read — ⚠️

- **UX:** ✅ strong.
- **PM:** ⚠️ but the closest of the three public studies. The not-selected concept and the merge do most of the work. Adding the proxy-testing limitation and fleshing out Iterations would push this to ✅.

### Suggested Takeaways addition

> **What I'd Do Differently**
>
> I'd have pushed back on the testing-participant constraint instead of accepting it as fixed. The sponsor's reason was legitimate — they didn't want customers anticipating features that might not ship. But there were middle options I didn't propose: unbranded concept testing, or a small internal-CX-team round. I took the constraint as a boundary when it was a starting position, and the findings are narrower than they had to be.

---

## 3. ResearchHub — Purdue Stack

**Overall: your best writing, your worst page.** Every decision-quality metric on this study is strong and the page is unpublishable-quality as a visual artifact.

### What's working — genuinely, this is the best prose on the site

- *"Building a complex design system completely from scratch was not realistic — every week I spent on foundations was a week developers built without guidance."* A named tradeoff with an explicit cost. Textbook.
- *"The practical test of the system wasn't beauty; it was whether a developer could build a screen I hadn't explicitly mocked up and have it land on-brand."* This is how a senior designer talks.
- *"Every design decision I made had to survive a feasibility conversation before it was worth pixels."*
- *"The platform surfaced logistics well but not fit"* — a real research insight that clearly drove downstream decisions, and you say so explicitly ("the north star for every decision after").
- The Takeaways "Jeez, who is the designer who designed all these details — and the designer was me" is the most human line in the portfolio. Keep it.

### 1. Decision visibility — ✅

Best of the four. Multiple named tradeoffs with stated costs.

### 2. Constraint — ✅

Best of the four, by a distance. "1.5 weeks to build a plan," "developers ready to build from week two," "teammates unable to meet consistent progression." Specific, uncomfortable, honest, and each one visibly shapes a decision.

The teammate line is handled with unusual grace — it names a real team problem without blaming anyone and shows what you did about it. Don't soften it.

### 3. Your role — ✅

Unambiguous. Sole designer → design engineer, 42 "I" to 3 "we."

### 4. Outcome — ❌ **highest-priority fix in the portfolio**

> "Planned to ship summer 2026 — the redesign + new features go live for the next semester's cohort."

**It is August 2026.** Summer is over. A recruiter reading this in September through January 2027 — which is your entire application window — reads "planned to ship [last summer]" and concludes it didn't. A stale future-tense claim is worse than no claim, because it reads as either abandoned or not-updated.

This also directly undercuts the thing you now say you care most about: **shipping.** This is your only project where design *and* code you wrote go live to real users. That's the strongest single fact in your portfolio for the goal you just stated, and it's currently phrased as a maybe.

**Fix — pick whichever is true:**

*If it shipped:*
> **Shipped summer 2026** — the redesign and new features are live for Purdue students and faculty, including [N] screens I designed and implemented in React myself.

*If it partially shipped:*
> **Live since [month] 2026** — [what's live], with [what's pending] scheduled for [when]. The components I designed and built in React are in production.

*If it slipped:*
> **Built and handed off summer 2026** — [current status]. [Specific things you designed + built] are in the codebase.

Any of the three beats the current line. And add the number: screens designed, components shipped, PRs merged — whatever you have. "I designed it and then I built it and users are using it" is your differentiator and there is currently not one number attached to it.

Also: **update the cover subtitle** — it repeats "planned to ship summer 2026."

### 5. Length / 30-second read — ❌

209 lines, three grey `image-slot` boxes, zero real images. A design recruiter scrolling this page for 30 seconds sees text and placeholders.

Three images would fix it, and you probably already have all three:

1. **A screenshot of the live/built platform** — proof it exists. Most important.
2. **The Purdue-palette design system board** from Figma.
3. **The spec-vs-shipped side-by-side** you already wrote a figcaption for. This one is the money shot: it's literal visual proof of the design-engineering crossover, and the caption is already written.

The affinity-diagram slot matters least — if you only produce two, drop that one.

### 6. Dual-read — ⚠️

- **PM column:** ✅ fully answered — constraint, cut, judgment under pressure, feasibility.
- **UX column:** ⚠️ The research is described well but there's no visible evidence of it, and "how did that change the design" is answered in prose with nothing to look at. UX reviewers evaluate visual judgment partly *from the artifacts you choose to show.* Zero artifacts = zero read.

### Suggested Takeaways addition

> **What I'd Do Differently**
>
> I'd have found a second professor. I had one client and an entire campus of students, so I optimized for the access I had — but a single professor is a sample of one, and I built professor-side features on it. Even two 30-minute conversations with faculty outside the project would have told me whether Professor Reese's coordination pain was the general case or his case. I assumed it generalized because checking was inconvenient.

*(This is genuinely your sharpest available self-critique — the current "Working Well With Uneven User-Group Access" takeaway names the gap but frames it as handled. Naming what you'd actually do about it is stronger than defending the workaround.)*

---

## 4. Pop by inline — inline2 (private route)

**Overall: the best case study you have. Currently unreadable by anyone.**

### What's working

- Highest decision density on the site. The binary-vs-three-state RSVP resolution — *initial interest is binary, finalized RSVP keeps Maybe, because that's where real-world tradeoffs actually live* — is a sophisticated product argument with user evidence on both sides.
- "Priority distribution as diagnostic" (red-heavy → zero reds) is an unusually rigorous way to evidence that iterations worked, and you generalize it into a reusable principle in Takeaways. Very strong.
- The transit-aware venue component: a market-specific research finding became a shipped design change, and you say so explicitly — *"became a shipped design change, not a backlog item."*
- The two-artifact split (Figma Make for stakeholders, AI Studio for testing) with a stated guardrails contract is a real production decision, not a student one.
- *"Content I didn't author shouldn't appear in work attributed to me"* — a clean ethical stance on AI tooling, stated without preaching.
- "Research output has a quality ceiling set by energy, not skill" is the best takeaway in the portfolio.

### 1–4. Decision, constraint, role, outcome — ✅ ✅ ✅ ✅

All four clear. 7/7 feedback items shipped is the most concrete outcome you have anywhere.

### 5. Length / 30-second read — ❌

~2,900 words, four placeholder image slots, zero images. The Testing and Iterating sections together are essay-length dense prose. The writing is good enough that it's painful to cut, but a recruiter reading their fifteenth portfolio of the day will not read it.

**Fix without cutting:** every h3 currently states a topic. Convert each to a claim, and bold a one-line conclusion under each h2.

| Current h3 | Suggested |
|---|---|
| "Round 1 — Validating the Core Design Bet" | keep — already a claim |
| "Round 2 — Priority Distribution Shifts" | "Round 2 — Reds Became Yellows" |
| "Rounds 3 & 4 — Zero Reds, Mostly Blues" | keep — already a claim |
| "Working with AI Prototyping Tools" | "AI Generates Polish, Not Intent" |
| "Round 1 → Iteration" | "Round 1 → Three Shipped Changes" |

A skimmer who reads only the h3s gets the entire arc. That's the goal.

### 6. Dual-read — ✅

Best of the four. Both columns answered throughout.

### Voice inconsistency

Zero "we," only 8 "I" — the page is written subjectless in resume grammar: *"Delivered a comparable competitive audit," "Built a single competitive-analysis framework," "Served as lead facilitator."*

Efficient, but inconsistent with the other three pages, and in a case study the dropped subject slightly *weakens* ownership rather than strengthening it — "Built a framework" is a bullet point; "I built a framework" is a claim. Convert to first person and match the site.

### Suggested Takeaways addition

> **What I'd Do Differently**
>
> I'd have run the competitive audit with the testing plan already in mind. The audit framework was thorough and reusable, but I built it to answer "what do these products do," then later needed it to answer "what should we test" — and those needed different columns. Two weeks of research produced a document I partly rebuilt at testing time. Knowing what the evidence has to *support* before choosing what to collect is the habit I'm taking forward.

### On the NDA path

The gate page at `/projects/inline` currently contains four scope-category bullets and no decisions, constraints, or outcomes. It correctly protects the sponsor and gives a recruiter nothing.

**A middle version is very likely obtainable and worth asking for.** Consent to publish *methodology and process outcomes without product identity or artifacts* is a much narrower ask than a portfolio release, and it's the version most companies say yes to. That version could still carry:

- Four rounds of usability testing as lead facilitator, three sessions in a two-hour window
- Insight → Reasoning → Proposed Iteration synthesis format with priority coding
- The red-heavy → zero-reds priority arc across four rounds
- All 7 interim-review feedback items shipped before final review
- The bilingual participant guide and the five-iteration interview plan
- The AI-as-shears / manual-as-scissors working model
- The energy-ceiling and priority-distribution-as-diagnostic takeaways

What it drops: the product name, the category, the RSVP mechanics, the transit component, the two-artifact split, all screens.

That's still, comfortably, the strongest page on your site — and it's a request a sponsor can approve without a legal review.

---

## Recommended order of work

1. **ResearchHub outcome line** — 10 minutes, fixes a claim that actively reads as failure during your entire application window. Also the cover subtitle.
2. **Request the narrowed inline consent** — long lead time, start now, unblocks the biggest gain.
3. **Three ResearchHub images** — turns your best-written page from unpublishable to strong.
4. **Frogslayer outcome callout** — resolve the cover/callout contradiction, promote adoption if true.
5. **"What I'd Do Differently" h3 × 4** — ~30 minutes total, fixes the one fully-empty row on the scorecard.
6. **h3 rewrites to decision statements** across all four — the process-walkthrough fix, no restructuring.
7. **Frogslayer "I" statements** in Researching / Ideating / Verifying — three sentences.
8. **JT proxy-testing limitation paragraph** + expand the Iterations section.
9. **Pop: convert to first person**, bold section-opening one-liners.
10. **Wire the 5 Frogslayer before/after iteration images** into `InsightCard`.

Items 1, 4, 5, 6, 7 are copy-only and could all be done in one sitting.

---

## Checklist item 6 — where the split actually stands

The handover's premise was: one portfolio, two resumes, case studies written so both reviewers get what they need.

Current state of the public site:

- **UX reviewer** gets what they need from Frogslayer and JT. Research rigor is abundant and well-evidenced.
- **PM/Producer reviewer** gets what they need from ResearchHub and Pop — and Pop is hidden, and ResearchHub looks unfinished.

So the split isn't broken; it's **unevenly published.** The PM-legible half of your portfolio is the half a recruiter can't properly read. Everything in the recommended order above is, in effect, publishing the PM half.
