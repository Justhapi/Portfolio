# AI Journey Map Maintenance Agent

> Archived 2026-09-23, before the copy-tightening pass.
>
> Full original text of `/projects/ai-journey-agent` as published — kept for interview
> prep, where the detail cut from the page is exactly what you want to hand.
> **Bold** marks what was highlighted on the page at the time. 1465 words.

---

**NDA** — This case study covers sponsor work protected by a non-disclosure agreement, specifically the **sponsor company's identity, product name, and prototype featurea are anonymized or generalized.**

## Outcome

The concept was selected by the sponsor and developed into a high-fidelity prototype that was **handed off to their product team.** Shortly after, the **sponsor shared that an AI maintenance agent was moving into development,** validating the direction the team had explored.

Spring 2026 · Sponsor platform → Concept · Development

We delivered a **concept expressed through a high-fidelity interactive prototype and design-principle documentation** to the sponsor’s leadership. The deliverables defined **an AI maintenance agent** that could keep customer journey maps accurate and trustworthy over time.

*Figure — Demo of Agent features responding to user requests.*

*Figure — Demo of Agent features surfacing issues to the user.*

## Overview

The sponsor operates a customer journey management platform that teams use to close the gap in understanding their customers’ experience across a product. Our team was asked to explore how **an AI maintenance agent** could be implemented into the platform to help teams keep their journey maps accurate.

### The Problem

The platform’s users (CX strategists, designers, and product teams) are often tasked with **managing, updating, and analyzing data within customer journey maps**.

However, without a system for flagging data staleness, teams currently rely on manual and potentially inaccurate review cadences. As a result, the journey maps’ value inevitably degrades over time as the scale and difficulty of maintenance grow alongside the volume of content.

### My Role

I worked as a UX Designer & Researcher on this project, **leading concept ideation and exploration** and contributing to research synthesis, wireframing, high-fidelity prototyping, and usability testing.

In addition to leading ideation, I also **managed communication between the team, sponsor leads, and platform users** to ensure alignment on project progression, sponsor goals, and user needs through organizing update meetings, update emails, and interviews. I also mentored the junior designers regarding onboarding on Figma and studio deliverable expectations.

## Researching

### Understanding What Makes an AI Maintenance Agent Effective in Existing Platform

To efficiently conceptualize an AI maintenance agent, we explored four research focuses: the platform’s current state, the agent’s required components, the current industry, and the current user needs.

To cover each focus within a tight time frame, we **split into two sub-teams running in parallel across two sprints**, reconvening after each sprint to share findings with the other team.

### Current State of Platform

I audited the platform as a user, exploring **its features across functionality and placement** to better ideate aspects of the agent such as its **placement within the existing UI and integration with related features.**

*Figure — My platform audit board containing sticky notes on blurred platform screenshots, color-coded by category.*

### Current State of Agent Components

The partner team surveyed the AI components that a maintenance agent would require: **the types of AI, categories of monitoring, and user trust of AI**.

*Figure — The agent-components synthesis the partner team authored categorized into five focuses.*

### Industry & Interaction Patterns

We then conducted competitive analysis across **direct journey-management competitors and analogous AI-driven SaaS platforms** to understand the current state of the AI agent industry.

### 4 Direct Journey-management Competitors

I audited one of the four direct competitors hands-on, focusing on three aspects of the platform's AI: **user interactions, reach within the platform, and user flow pain points.**

*Figure — My direct-competitor analysis on one of the four direct competitors.*

### 3 Analogous AI-driven SaaS Platforms

The partner team focused on auditing products that utilize AI to analyze customer data for feedback and insights.

*Figure — The partner team’s indirect-competitor analysis of analogous AI-driven SaaS platforms.*

After the competitive analysis, we then moved onto examining interaction patterns within knowledge-verification platforms to surface the structural moves every modern verification flow currently shares.

*Figure — My interaction-pattern synthesis through a Nielsen 10-heuristic evaluation, going over the general platform and user flows of the instances of the platform’s AI features.*

### User Interviews

To verify that the direction the desk research pointed toward matched what platform users needed from an AI agent focused on journey-map maintenance, the team ran **six interviews with current users of the sponsor’s platform**.

I **participated in three of the six one-hour sessions**, rotating between interviewer and note-taker with my partner during each session. After all six interviews were completed, we categorized the insights to determine the platform-relevant user needs the AI agent had to address.

*Figure — My session notes from the three interviews I participated in.*

*Figure — Team affinity synthesis across all six interviews clustered into themes.*

## Ideating

### From Individual Sketching to a Sponsor-Selected Direction

We developed the AI agent concept direction through three stages: **sketching, proposing, and wireframing concepts**.

### Sketching Ideas

Each designer ideated during the Crazy 8’s sprint before walking through everyone’s ideas together and combining the most supported features through group whiteboarding.

*Figure — My Crazy 8’s sketches of my AI agent concept features.*

During the idea walkthroughs, I pitched a concept direction focusing on our recurring themes of user inputs, resulting in me **leading a rules-based approach to the agent concept**.

*Figure — A whiteboarding session I led on a rules-based direction that was not selected as the final concept. Elements of the human-in-the-loop rule editing informed the direction the sponsor did select.*

Although it was ultimately not selected as a final concept during the sponsor’s assessment, elements of it were integrated into the concepts that were.

### Proposing Concepts

We presented **six concept proposals** to the sponsor — including the rules-based whiteboarded direction I led (shown above) — each paired with the research evidence behind it. The sponsor selected two complementary directions to move forward with.

### Dual Feature Wireframing

Due to having two feature concepts approved for the AI agent, we split the team evenly to develop both concepts concurrently.

### Concept A · My team

To translate the concept into interactive features, I **led the team, sketching variations of what concept A would look while maintaining the sponsor platform’s UI patterns and providing access to concept B’s features.** The sketches were made to begin refinements through feedback from the partner team and sponsor on the wireframes for more compressed and decision-focused UI.

*Figure — Timeline of Concept A’s gradual refinement into its finalized version (not shown due to NDA)*

### Concept B · Partner team

As my team focused on Concept A, the partner team focused on constructing the wireframes for Concept B. Due to not contributing to the ideation and construction of wireframes for Concept B, images are not shown.

### Eventual Merging of Wireframes into One System

From wireframing, the two concepts revealed heavy overlap in utilizing the same context and evidence. Due to this fact, we decided to **merge them into a single agentic system**.

Because the wireframes are built on the sponsor’s platform UI, they aren’t shown here to comply with the NDA.

## Verifying

### Prototyping and Testing the Unified Concept

We took the combined concept into **high-fidelity prototyping, usability testing, and iteration**. The process below describes how the work was structured.

### Hi-Fi Prototyping

We built an interactive Figma prototype that expressed the unified concept end-to-end through user flows, applying the **insights the research had surfaced**.

Because the prototype was constructed directly on the sponsor’s platform surface, the screens themselves aren’t shown here.

### Usability Testing

To avoid setting false expectations about feature directions that might not be implemented, the sponsor asked us **to each recruit a UX Design major classmate familiar with journey mapping as substitute testers**.

During each usability test, we had participants complete three tasks that probed navigating and using the concept prototype’s features, followed by a reflection round.

*Figure — Notes from the usability test I conducted.*

### Iterations

After the round of usability tests, we then categorized the insights to determine iteration focuses. The resulting iterations focused on agent access, information organization, and user flow simplification.

## Takeaways

### Design Decision-Making Related to Platform

This project was my first time **designing within an existing product context and design system.** The first half was exploratory and general regarding takeaways, but the second half focused heavily on the platform’s own needs, making it natural to narrow down findings to apply to the final product later on.

**Narrowing down scope was a challenge subjective from project to project that I had previously addressed early** on when constructing the first set of guidelines for Frogslayer. I now understand that **specific factors, like a project’s theme of expansion, hints at its expected window for scope narrowing.**
