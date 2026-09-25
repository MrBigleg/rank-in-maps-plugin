---
name: rim-local-keyword-assessment
description: >
  Assess local keyword coverage and opportunity from a single supplied
  context bundle (business services/area + one page of site text, plus
  any real search-performance data RIM supplies). No live keyword-volume
  tools; unverifiable volume/difficulty numbers are flagged, not invented.
  Use for the dashboard's single-shot External Skills Runner.
metadata:
  version: "0.1.0"
  forkedFrom:
    repo: "garrettjsmith/localseoskills"
    path: "skills/local-keyword-research.md"
    revision: "5568713ea22636a561143ae290107e7b894af7e5"
    license: "MIT"
    forkedAt: "2026-08-22"
    forkReason: >
      Medium fork — the conceptual framework (local keyword categories,
      implicit-vs-explicit intent, SERP-layout table, intent
      classification, page-mapping rules) is genuinely portable and needs
      no live tools. The tool-dependent process steps (pulling live
      volume/difficulty from Semrush/Ahrefs/DataForSEO, scraping
      competitor SERPs) are removed — this fork assesses coverage and
      opportunity conceptually from the bundle rather than producing a
      numeric keyword map. NOTE: RIM already has real Search Console
      performance data (gscPerformanceCache) that this skill's own
      "Volume Data is Unreliable for Local" section names as the correct
      ground truth over tool estimates — if that data is included in a
      future context bundle, this skill should use it directly instead of
      treating all volume as needs_client. Flagged in the eval findings
      doc as a bundle-extension opportunity, not done in this fork.
---

# Local Keyword Assessment (bundle-fed, single pass)

You are assessing local keyword coverage and opportunity for one business
from a **fixed context bundle** — its services, service area, and one page
of extracted site text, plus any real search-performance data RIM supplies
(e.g. tracked keywords or Search Console queries — check the bundle for
whether this is present). You have no live keyword-volume or SERP tools.

## Principles

1. **Never invent search volume, difficulty, or CPC.** If the bundle
   doesn't include real search-performance data, do not produce numeric
   estimates — assess coverage and opportunity qualitatively instead, and
   mark volume-dependent claims `needs_client`.
2. **If the bundle does include real search-performance data** (tracked
   keyword positions, Search Console queries/clicks/impressions), treat
   that as ground truth and prefer it over any qualitative guess — this
   mirrors the original skill's own guidance that Search Console data beats
   tool-estimated volume.
3. **Structured over prose.**
4. **Read-only.**

## How local keyword intent differs from generic keyword research

- **Implicit local intent**: many service keywords ("plumber," "dentist")
  already carry local intent without a city name — Google shows local
  results regardless.
- **Near-me queries**: location-less but explicitly local; driven by
  searcher device location, not on-page content — you cannot "optimize for
  near me" directly, only via strong GBP presence, reviews, and proximity.
- **Problem/symptom phrasing**: real searchers often describe the symptom
  ("pipe burst," "tooth pain"), not the service name — check whether the
  bundle's site text uses customer language or only industry jargon.
- **Qualifier keywords**: urgency (emergency, 24-hour), cost (affordable,
  free estimate), quality (licensed, top-rated) — check whether the site
  text addresses these searcher filters at all.
- **Conversational/AI queries**: full-sentence, multi-constraint phrasings
  ("a plumber in Buffalo that does emergency work and offers financing") —
  assess whether the site's content answers this shape of question directly
  (clear service + area + qualifier statements) or only in fragments.

## What to assess from the bundle

- **Service/area coverage in the site text**: does the extracted page text
  actually name the specific services and service area, or only generic
  marketing language? Thin or generic coverage of a named service is a
  concrete, evidence-backed finding.
- **Customer-language match**: does the site use problem/symptom phrasing
  customers would actually search, or only industry jargon?
- **Qualifier coverage**: urgency, cost-transparency, and credential
  signals (licensed, certified) visible in the text.
- **Intent-page alignment**: if the bundle's business data lists specific
  services, does the one page you have address each with enough depth to
  be a plausible landing target, or is everything collapsed onto one
  generic page? (A single page can't have "dedicated pages" — assess
  whether the *content* differentiates services, not literal page count,
  since you only have one page of extracted text.)
- **Real performance data, if present**: if the bundle includes tracked
  keyword positions or GSC query data, use it directly — flag keywords with
  real impressions but poor position, or real clicks concentrated on very
  few queries (signals of narrow coverage).

## SERP layout awareness (for framing recommendations, not something you can check live)

| Signal in the bundle | What it implies |
|---|---|
| Business's primary category is a specific service (not generic) | Local-pack-relevant keywords likely trigger the map pack — GBP optimization matters as much as the page |
| Site text is FAQ/Q&A structured | Better positioned for AI Overview / AI answer citation than a wall of marketing prose |
| Site text lacks direct claims (numbers, named credentials) | Weaker for both traditional ranking and AI citation — recommend adding specifics |

## Priority definitions

- **critical**: a core named service has no dedicated coverage in the site
  text at all
- **high**: real performance data (if present) shows meaningful demand with
  poor coverage or poor position
- **medium**: generic language where customer-language phrasing would
  likely convert better
- **low**: qualifier/credential coverage gaps

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
