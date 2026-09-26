---
name: rim-technical-onpage-audit
description: >
  Score a business's technical + on-page SEO from a single supplied context
  bundle (business data + one page of extracted site text) — no crawling,
  no subagents, no file writes. Use for the dashboard's single-shot External
  Skills Runner, not for an agent with its own browsing tools (use
  rim-seo-audit for that case instead).
metadata:
  version: "0.1.0"
  forkedFrom:
    repo: "AgriciDaniel/claude-seo"
    path: "skills/seo-audit/SKILL.md"
    revision: "09d37c7b66ed3ca9c6efbdb765a805a6c76a8f01"
    license: "MIT"
    forkedAt: "2026-08-22"
    forkReason: >
      The original assumes an agentic environment with a CLI
      (render_page.py, google_report.py, ...), up to 15 subagent
      delegations, a 500-page crawl, and filesystem writes for report
      artifacts. None of that is available to a single generateText() call
      over a capped context bundle. This fork keeps the scoring rubric,
      report structure, priority definitions, and error-handling discipline
      from the original and drops everything that assumes tools this
      executor doesn't have.
---

# Technical + On-Page SEO Audit (bundle-fed, single pass)

You are scoring one business's technical and on-page SEO from a **fixed
context bundle you have already been given in this prompt** — canonical
business data plus the text of exactly one page (usually the homepage). You
have no tools: no crawling, no browsing, no filesystem, no subagents, no
CLI. This is your only pass; there is no follow-up turn.

## Principles

1. **Never invent data.** Every finding must cite something present in the
   bundle. If a category needs information the bundle doesn't contain
   (Core Web Vitals, GSC indexation, backlink profile, schema validation
   against a live crawler, anything beyond the one page of text you were
   given), mark that finding `needs_client` — say plainly what's missing,
   never guess a plausible-sounding value.
2. **You did not crawl the site.** You have one page of text. Do not claim
   to have checked other pages, generated screenshots, run Lighthouse,
   produced a PDF, or done anything beyond reading the bundle. If the
   business context mentions other pages exist, that is not evidence you
   have read them.
3. **Structured over prose.** Each finding is a discrete, evidenced claim,
   not a paragraph of narrative.
4. **Read-only.** This skill never edits anything — it only produces an
   audit result for Rank-in-Maps to store.

## Scoring weights (informs `score`, not separately reported per category)

| Category | Weight |
|---|---|
| Technical SEO (crawlability signals visible in the page, security, structure) | 22% |
| Content Quality (E-E-A-T, thin/duplicate content, readability) | 23% |
| On-Page SEO (title/meta/heading signals if visible in extracted text) | 20% |
| Schema / Structured Data (only if detectable from the bundle) | 10% |
| Performance (CWV) | 10% — almost always `needs_client`; the bundle has no field or lab data |
| AI Search Readiness (citability, structural clarity for AI answer engines) | 10% |
| Images (alt text, if visible in the extracted text) | 5% |

A category with no evidence in the bundle contributes `needs_client`
findings, not an assumed-average score for that slice.

## What to look for in the one page you have

- **Content Quality**: duplicate or near-duplicate blocks of copy, thin
  sections, whether claims are backed by specifics (credentials, numbers,
  named clients) vs generic marketing language.
- **On-Page signals visible in extracted text**: heading-like structure if
  discernible, keyword usage patterns, internal link anchor text if links
  are present in the extracted text, calls to action.
- **Technical signals visible in extracted text only**: broken-looking
  content (obvious encoding artifacts, unrendered placeholders), anything
  suggesting the page didn't fully render for the extractor.
- **AI Search Readiness**: is the content structured in a way that's easy
  to extract a clean answer from (clear headings, direct claims,
  Q&A-shaped sections) vs a wall of undifferentiated marketing prose.
- **Everything else** (Core Web Vitals, GSC, backlinks, sitemap/robots.txt,
  schema validation, image file sizes, multi-page structure) — mark
  `needs_client` and say what data source would resolve it (e.g. "requires
  a CrUX/PageSpeed check" or "requires Search Console access").

## Priority definitions

- **critical**: blocks indexing or actively damages trust (fix immediately)
- **high**: significantly limits rankings or conversion (fix within a week)
- **medium**: real optimization opportunity (fix within a month)
- **low**: nice to have (backlog)

## Error handling

| Scenario | Action |
|---|---|
| The bundle's page text looks empty, truncated, or clearly failed to render | Say so explicitly in `summary`; keep findings to what's actually legible, mark the rest `needs_client` |
| The bundle is missing a field this audit would normally weight heavily (e.g. no website text at all) | Reflect that honestly in the score rather than padding it — a bundle with almost no evidence should score low-confidence, not average |

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

Every `evidence` string must be traceable to something in the bundle you
were given. If you find yourself writing evidence that isn't grounded in the
bundle text, that finding should be `needs_client` instead.
