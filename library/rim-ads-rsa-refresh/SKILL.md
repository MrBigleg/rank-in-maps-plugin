---
name: rim-ads-rsa-refresh
description: >
  Refresh low-performing Google Ads Responsive Search Ads (RSAs) using the
  business's verified Rank-in-Maps facts and landing page copy, enforcing
  strict 30-character headlines and 90-character descriptions, and outputting a
  Google Ads Editor bulk-import CSV. Use when the user asks to "rewrite my
  Google Ads", "refresh RSAs", "improve ad strength", or "write new ad copy".
metadata:
  version: "0.1.2"
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

### 4. Output two Google Ads Editor CSVs
A Google Ads Editor import of new headlines and descriptions creates a **new**
ad; it does not change the ad it replaces. So every refresh is a replacement
in two steps, delivered as two separate CSVs:

1. **New ads CSV**, to import now:
   ```csv
   Campaign,Ad group,Status,Headline 1,Headline 2,...,Headline 15,Description 1,Description 2,Description 3,Description 4,Final URL
   ```
   One row per new ad, `Status` `Enabled`.
2. **Pause originals CSV**, to import later. Same headers. One row per
   replaced ad that copies the original ad's campaign, ad group, every
   headline, every description and Final URL exactly as they are now, with
   `Status` `Paused`. Editor matches an ad by those identifying values, so
   none of them may be changed, shortened or left empty.

Take the original values from the script's `ad_urls` table (`campaign`,
`ad_group`, `headlines`, `descriptions`, `final_url`) or the uploaded RSA CSV
before writing any copy, splitting `headlines` and `descriptions` back into
their numbered columns in their original order. If you cannot read the original ad's full headlines,
descriptions and Final URL, output the new ads CSV only and tell the owner to
pause the old ad by hand; never guess its values.

Tell the owner, in this order:
- Import and post the new ads CSV, then wait until each new ad shows
  **Eligible** in Google Ads. New ads can stay under review, and a disapproved
  ad never serves; pausing the old ad first could stop the ad group's traffic.
- Only then import and post the pause originals CSV. Pausing (not removing)
  keeps the old ad's history so it can be re-enabled.
- Review both imports in Google Ads Editor before posting.

Also note any broken or mismatched landing URLs so the owner can pause or fix
those pages first.
