---
name: start
description: Get oriented with Rank-in-Maps — verify the connection and load the right playbook
---

Orient yourself with the Rank-in-Maps MCP connection, then report to the user.

1. Call the `rim_search_docs` tool with query "second brain" to confirm the
   connection works. If the call fails with an authentication error, tell
   the user to run `/mcp` and complete the browser sign-in for
   `rank-in-maps`, then stop.
2. Summarize the capability groups exposed by this connection. The dynamic
   free launch set currently contains 19 tools, including source-cited Local
   SEO knowledge and the three UI catalog/render tools. Do not infer the
   user's paid entitlement from tool visibility alone: some hosts may cache or
   publish a static catalog.
3. Offer the portable, local-files Second Brain path on every tier. If the
   user explicitly wants the hosted workspace path and
   `rim_get_connected_business` is available, read
   `second-brain/hosted-tools.md` via `rim_read_doc_page`, then call
   `rim_get_connected_business`.
   - `setup_required`: offer to complete first-time setup right here —
     `rim_search_business_listings` (search by name + city, confirm the exact match with
     the user, never guess), `rim_connect_business` with the confirmed
     `placeId`, then call `rim_get_business_discovery_context`. Use what you already know,
     ask only about conflicts or gaps, show one structured confirmation, and
     save with `rim_save_business_discovery_answers`. Never send raw conversation or memory.
   - `ready`: note the business name and `locationId` for later tool calls.
4. Read `second-brain/agent-built-brain.md` — the free, local-files
   playbook for building a portable Second Brain in the user's own folders.
   It complements the hosted tools on every tier.
5. Summarize for the user: the connection status, the capabilities available,
   their business if they chose the hosted path, and what they can do next.
   Do not claim a paid tier unless an explicit account response establishes it.
6. For "what changed" or "what am I missing," invoke the
   `rank-in-maps-last-30-days` skill (or `/rank-in-maps:last30days`).

Never invent business data: everything you write into a Second Brain must
come from the Rank-in-Maps tools, the user's own files, or the user's
answers.
