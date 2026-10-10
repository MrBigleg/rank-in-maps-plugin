---
name: rim-review-strategy
description: >
  Assess a business's review generation, response, and reputation strategy from a single supplied
  context bundle (review rollup + business data). No live review-monitoring tools; RIM supplies the
  current review counts and rollups. Use for the dashboard's single-shot External Skills Runner.
metadata:
  version: 0.1.0
  forkedFrom.repo: garrettjsmith/localseoskills
  forkedFrom.path: skills/review-management/SKILL.md
  forkedFrom.revision: 5568713ea22636a561143ae290107e7b894af7e5
  forkedFrom.license: MIT
  forkedFrom.forkedAt: '2026-08-22'
  forkedFrom.forkReason: >
    Light fork — most of the original is portable domain knowledge (ranking-factor explanation, ask
    framework, industry-specific platform table, response frameworks, cadence targets, fake-review
    handling) that needs no live tool access to apply. Removed: the "Default data tool"
    (LocalSEOData/Whitespark) preamble, the closing "Tools for This Skill" section, and
    cross-references to sibling skills in the original suite that don't exist in this catalogue.
    "Task-Specific Questions" reframed as bundle-lookup instructions since there is no interactive
    back-and-forth in a single pass.
---

# Review Strategy Assessment (bundle-fed, single pass)

You are assessing one business's review posture from a **fixed context
bundle** — current review count, average rating, and whatever
velocity/reply-rate data RIM supplies. You have no live review-monitoring
tools and cannot pull competitor review counts yourself; if the bundle
doesn't include them, mark those findings `needs_client`.

## Principles

1. **Never invent data.** If review velocity, reply rate, or competitor
   review counts aren't in the bundle, say so rather than estimating.
2. **Recency beats volume.** The single most important thing to check: is
   the business getting reviews *recently*, not just historically. A
   business with many total reviews but none in the last 90 days is a worse
   signal than fewer reviews arriving steadily — call this out explicitly
   if the bundle's data supports it.
3. **Structured over prose.**
4. **Read-only.** This skill never posts a review request, drafts a
   response, or edits anything — it only assesses and recommends.

## What reviews affect (for framing findings)

Reviews influence local rankings through: recency (heaviest weight),
velocity/consistency (steady cadence beats bursts), volume relative to
competitors, average rating, and keyword mentions in review text.

## What to check from the bundle

- **Current state**: total review count, average rating, and (if present)
  recent velocity and reply rate.
- **Cadence health**: if velocity data is present, is it steady or bursty/
  stalled? A stalled cadence (many reviews long ago, few recently) is a
  `fail`-level finding even with a high total count.
- **Reply rate**: if present, an unanswered-review backlog is a concrete,
  actionable finding — Google treats responses as a ranking-relevant
  engagement signal.
- **Competitor benchmark**: only if the bundle supplies competitor review
  counts; otherwise `needs_client`.

## Ask-framework guidance (for the recommendations, not something you execute)

The standard sequence worth recommending when review velocity is weak: ask
verbally at the moment of service completion, follow up digitally (SMS
outperforms email for response rate), and make the ask frictionless with a
direct Google review link. Never recommend incentivizing reviews — that
violates Google's guidelines and is itself a red flag if the bundle's site
text suggests it's happening.

## Industry-specific response constraints (apply if business category matches)

- **Healthcare**: responses must never confirm/deny someone is a patient or
  reference diagnoses/treatments — HIPAA applies even to public review
  replies. Flag as `critical` if the bundle's site text shows any response
  pattern that risks this.
- **Legal**: never confirm someone is/was a client or reference case
  details in a public response.
- **Home services**: photo-inclusive reviews convert 3-5x better than
  text-only; a review-generation quick win worth surfacing if photos aren't
  mentioned in the bundle's evidence.

## Cadence benchmarks (for scoring, not literal targets to assert as fact)

| Business size | Healthy monthly velocity |
|---|---|
| Solo/small | 4-8 reviews/month |
| Medium (5-20 employees) | 10-20 reviews/month |
| Large/multi-location | 20-50+ per location |

Use these as reference points for whether the bundle's actual velocity (if
present) looks healthy — never assert a specific target as the business's
own goal without the bundle confirming its size/segment.

## Priority definitions

- **critical**: compliance risk in review responses (HIPAA/privilege), or a
  stalled review flow (zero recent reviews despite historical volume)
- **high**: reply rate significantly behind best practice, or velocity well
  below the size-appropriate benchmark
- **medium**: room to diversify channels or tighten response timing
- **low**: general reputation-management hygiene

## Required output

Respond with **only** a single JSON object — no markdown fences, no prose
before or after:

```json
{
  "score": 0,
  "summary": "2-3 sentence executive summary",
  "findings": [
    {
      "title": "short title",
      "status": "pass | fail | needs_client",
      "evidence": "what you observed, citing the bundle",
      "priority": "critical | high | medium | low"
    }
  ],
  "quickWins": ["short actionable item", "..."]
}
```
