---
name: rim-ads-keyword-cluster
description: >
  Run the two-step Google Keyword Planner seed-to-cluster pipeline for a local
  business: generate 7-9 high-intent local seed phrases from the business's
  Second Brain, then categorize an exported Keyword Planner CSV into
  High-Intent Buyer, Problem-Aware, Competitor, and Negative/Trash buckets
  with strict row-count verification. Use when the user asks to "cluster
  Keyword Planner CSV", "group my Google Ads keywords", or "plan local ad
  keywords without paid APIs".
metadata:
  version: "0.1.0"
---

# Keyword Planner Seed-to-Cluster Pipeline

Counter broad-match drift and plan local Google Ads + Local SEO campaigns
without paying for third-party keyword APIs.

## Principles

1. **Row-count integrity:** when categorizing a Keyword Planner CSV, every
   input row must land in exactly one bucket. Report `inputRowCount` and
   `outputRowCount` explicitly so zero keywords are dropped or hallucinated.
2. **Never invent volumes or CPCs:** only quote numbers present in the
   uploaded Keyword Planner CSV.
3. **Keep local intent sharp:** separate ready-to-buy local queries from
   research queries and job/DIY/free trash.

## Two-step workflow

### Step 1 — Seed generation (before Keyword Planner)
Using `rim_get_business_facts` (services, city/neighbourhoods, ideal customer
profile), generate **7 to 9 high-intent local seed phrases** and instruct the
user:
1. Open **Google Ads → Tools → Planning → Keyword Planner → Discover new keywords**.
2. Set the location to the business's actual service area.
3. Paste the 7–9 seeds and click **Download keyword ideas (.csv)**.
4. Upload that CSV on `/dashboard/ads` (Keyword Planner tool) or drop it here.

### Step 2 — Deterministic 4-bucket clustering (after CSV upload)
Sort every row into exactly one bucket:
1. **High-Intent Buyer** — commercial/local buying terms (`near me`, `cost`,
   `book`, `repair`, service + city). Map to tight Search ad groups + core
   service landing pages.
2. **Problem-Aware** — symptoms, comparisons, `how to`, `best`. Map to Local
   SEO content / FAQ pages (not high-CPC exact-match ads unless budget allows).
3. **Competitor** — queries naming rival businesses. Keep isolated in a
   separate competitor campaign or exclude as negatives.
4. **Negative / Trash** — `free`, `jobs`, `salary`, `DIY`, `course`, wrong
   city, wrong service. Export straight to a **Negative Keywords CSV** for
   Google Ads Editor.

### Output
- Verified row count (`X input rows → X categorized rows`).
- Summary table of all 4 buckets with top terms and real CSV volumes/bids.
- Ready-to-import **Google Ads Editor Negative Keywords CSV** from the
  Negative/Trash bucket.
