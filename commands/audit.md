---
name: audit
description: Show your Google Business Profile audit and the fixes that matter most
---

Show the user their latest Google Business Profile audit. Pick the business
with `rim_list_businesses` when more than one is connected, then call
`rim_get_gbp_audit`. In hosts that support MCP Apps this renders an
interactive audit with the score and top fixes; otherwise list the score and
the three most important open findings in plain words.

Offer to fix the top finding. Fixes that change Google (description,
categories, posts, review replies) are staged as drafts with the `rim_draft_*`
or `rim_stage_*` tools and wait for the owner's OK in Rank-in-Maps; say that,
never that a change is live. Reading the audit is free; do not start a fresh
paid audit without the user's explicit yes.
