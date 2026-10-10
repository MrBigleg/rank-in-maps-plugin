---
name: rim-local-keyword-assessment
description: >
  Assess local keyword coverage and opportunity from a single supplied context bundle (business
  services/area + one page of site text, plus any real search-performance data RIM supplies,
  including measured local keyword research when the business has a run). No live keyword-volume
  tools; unverifiable volume/difficulty numbers are flagged, not invented. Use for the dashboard's
  single-shot External Skills Runner.
metadata:
  version: 0.2.0
  forkedFrom.repo: garrettjsmith/localseoskills
  forkedFrom.path: skills/local-keyword-research.md
  forkedFrom.revision: 5568713ea22636a561143ae290107e7b894af7e5
  forkedFrom.license: MIT
  forkedFrom.forkedAt: '2026-08-22'
  forkedFrom.forkReason: >
    Medium fork — the conceptual framework (local keyword categories, implicit-vs-explicit intent,
    SERP-layout table, intent classification, page-mapping rules) is genuinely portable and needs no
    live tools. The tool-dependent process steps (pulling live volume/difficulty from
    Semrush/Ahrefs/DataForSEO, scraping competitor SERPs) are removed — this fork assesses coverage
    and opportunity conceptually from the bundle rather than producing a numeric keyword map. NOTE:
    RIM already has real Search Console performance data (gscPerformanceCache) that this skill's own
    "Volume Data is Unreliable for Local" section names as the correct ground truth over tool
    estimates. As of v0.2.0 (2026-09-30) the bundle can also carry measured local keyword research
    (volume in the business's own area, national difficulty, intent and a Map Pack verdict), and
    this skill uses it directly. Flagged in the eval findings doc as a bundle-extension opportunity;
    done in v0.2.0.
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
   mark volume-dependent claims `needs_client`. A number is allowed only if
   it appears in the bundle, and it keeps the scope the bundle gives it.
2. **If the bundle does include real search-performance data** (tracked
   keyword positions, Search Console queries/clicks/impressions, or a
   "Measured keyword research" section), treat that as ground truth and prefer
   it over any qualitative guess — this mirrors the original skill's own
   guidance that Search Console data beats tool-estimated volume.
3. **Structured over prose.**
4. **Read-only.**

## Reading the "Measured keyword research" section

When the bundle has this section, RIM ran keyword research for the business and
the figures are provider data, not estimates. Read it carefully:

- **Volume is for the place named on each line** (usually the business's own
  city), and "country volume" is the same keyword country-wide. Never present a
  country figure as local, or the reverse.
- **Difficulty is country-wide.** `not measured` means the provider had no data;
  it never means easy. Do not rank or recommend a keyword as easy because its
  difficulty is missing.
- **Small local volumes are coarse.** A `0` or `10` is "low or unmeasured", not
  "no demand".
- **`map pack yes`** means Google showed a Map Pack for that search, so the
  keyword is a Maps opportunity. **`no`** means it did not; **`unchecked`** means
  unknown. It says nothing about whether the business ranks.
- **Navigational intent** is someone looking for a specific site or brand. A large
  navigational volume is not an opportunity unless the brand is the business's own.
- If the bundle has **no** such section, the business has no measured research:
  say so, stay qualitative, and mark volume-dependent claims `needs_client`. Do
  not suggest figures.

Use it to check the site text against real demand: which high-volume, Map Pack,
buying-intent keywords does the page fail to cover, and which of the business's
own proven terms (Search Console impressions) does it cover well?

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
- **Measured keyword research, if present**: for the top keywords in the
  "Measured keyword research" section, say whether the page's text covers them,
  citing the keyword and its figures with their scope. A Map Pack, buying-intent
  keyword the text doesn't cover is a `high` finding; one the text covers well
  is a `pass`.

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
  poor coverage or poor position; or a measured Map Pack, buying-intent keyword
  the page text doesn't cover
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
