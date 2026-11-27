---
name: rim-ads-rsa-refresh
description: >
  Refresh low-performing Google Ads Responsive Search Ads (RSAs) using the
  business's verified Rank-in-Maps facts and landing page copy, enforcing
  strict 30-character headlines and 90-character descriptions, and outputting a
  Google Ads Editor bulk-import CSV. Use when the user asks to "rewrite my
  Google Ads", "refresh RSAs", "improve ad strength", or "write new ad copy".
metadata:
  version: "0.1.1"
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
A Google Ads Editor import of new headlines and descriptions creates a **new**
ad; it does not change the ad it replaces. So every refresh is a replacement:
one row that adds the new ad, and one row that pauses the ad it replaces, so
the low performer stops serving once the new ad is live.

For each refreshed ad, record the original ad's `Ad ID`, campaign and ad group
from the script's `ad_urls` table (`ad_id`, `campaign`, `ad_group`) or the
uploaded RSA CSV before writing any copy. If you cannot identify the original
ad, say so and output the new ad only, marked for the owner to pause the old
one by hand; never guess an ID.

Output a ready-to-paste CSV with exact Google Ads Editor headers:
```csv
Campaign,Ad group,Ad ID,Status,Headline 1,Headline 2,...,Headline 15,Description 1,Description 2,Description 3,Description 4,Final URL
```
- **New ad row:** `Ad ID` empty, `Status` `Enabled`, the new headlines,
  descriptions and Final URL.
- **Original ad row:** the original `Ad ID`, its campaign and ad group,
  `Status` `Paused`, and the asset and URL columns left empty so nothing else
  about it changes.

Tell the owner to review both rows in Google Ads Editor before posting, and
that pausing (not removing) keeps the old ad's history so it can be re-enabled.
Also note any broken or mismatched landing URLs so the owner can pause or fix
those pages first.
