---
name: rim-ads-rsa-refresh
description: >
  Refresh low-performing Google Ads Responsive Search Ads (RSAs) using the
  business's verified Rank-in-Maps facts and landing page copy, enforcing
  strict 30-character headlines and 90-character descriptions, and outputting a
  Google Ads Editor bulk-import CSV. Use when the user asks to "rewrite my
  Google Ads", "refresh RSAs", "improve ad strength", or "write new ad copy".
metadata:
  version: "0.1.0"
---

# Google Ads RSA & Asset Bulk Refresh

You are refreshing Responsive Search Ads for a real local business. Every
claim must come from the business's verified Rank-in-Maps profile, website, or
Second Brain — never invent offers, ratings, years in business, or guarantees.

## Hard limits (verify every single line before outputting)

- **Headlines:** up to 15 per ad, **strictly <= 30 characters** each
  (including spaces and punctuation).
- **Descriptions:** up to 4 per ad, **strictly <= 90 characters** each.
- **No fabricated claims:** do not write "5-star", "20 years", or "24/7"
  unless that fact is verified in the business profile.
- **Landing page match:** every ad's headline angle must match the actual
  `Final URL` page content. Flag any ad pointing to a 404 or mismatched page
  before rewriting copy.

## Step sequence

### 1. Load verified business facts
- Read the business's services, location, hours, differentiators, and website
  from `rim_get_business_facts` / Second Brain.

### 2. Inspect current ads
- Read active RSAs from `/dashboard/ads` (script `ad_urls` table or uploaded
  Google Ads Editor RSA CSV), focusing on ads with `POOR` or `AVERAGE` Ad
  Strength, low CTR, or broken landing URLs (`http_status >= 400`).

### 3. Draft diverse assets
For each ad group being refreshed, write:
- **15 Headlines (<= 30 chars each)** balanced across:
  - 4 service + location headlines
  - 4 customer benefit / outcome headlines
  - 4 trust / proof headlines (strictly from verified facts)
  - 3 clear call-to-action headlines
- **4 Descriptions (<= 90 chars each)** with distinct angles and clear CTAs.

Count characters carefully on every single headline and description. If any
headline exceeds 30 characters or any description exceeds 90 characters,
shorten it before outputting.

### 4. Output a Google Ads Editor CSV
Output a ready-to-paste CSV with exact Google Ads Editor headers:
```csv
Campaign,Ad group,Headline 1,Headline 2,...,Headline 15,Description 1,Description 2,Description 3,Description 4,Final URL
```
Also note any broken or mismatched landing URLs so the owner can pause or fix
those pages first.
