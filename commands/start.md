---
name: start
description: Get oriented with Rank-in-Maps — check your access tier and load the right playbook
---

Orient yourself with the Rank-in-Maps MCP connection, then report to the user.

1. Call the `searchDocs` tool with query "second brain" to confirm the
   connection works. If the call fails with an authentication error, tell
   the user to run `/mcp` and complete the browser sign-in for
   `rank-in-maps`, then stop.
2. Check which tools this connection exposes.
   - **Only `searchDocs` and `readDocsPage`:** the user is on the free
     knowledge tier. The eleven business tools (setup & discovery plus the
     Second Brain workflow) require a Business MCP pass from
     https://rank-in-maps.com/pricing. Note: after upgrading, the user
     must reconnect (`/mcp`) before the new tools appear.
   - **`getMyBusiness` present:** the account is paid. Read
     `second-brain/hosted-tools.md` via `readDocsPage` — that is your
     playbook for the hosted tools.
3. If the account is paid, call `getMyBusiness`.
   - `setup_required`: offer to complete first-time setup right here —
     `findMyBusiness` (search by name + city, confirm the exact match with
     the user, never guess), `connectMyBusiness` with the confirmed
     `placeId`, then walk the discovery interview conversationally with
     `getDiscoveryInterview` / `saveDiscoveryAnswers`. Finishing the
     interview (`markComplete: true`) triggers the business's first
     automated audit.
   - `ready`: note the business name and `locationId` for later tool calls.
4. Read `second-brain/agent-built-brain.md` — the free, local-files
   playbook for building a portable Second Brain in the user's own folders.
   It complements the hosted tools on every tier.
5. Summarize for the user: their current tier, their business (if
   connected), what they can do next, and — if setup is incomplete —
   offer to run it now.

Never invent business data: everything you write into a Second Brain must
come from the Rank-in-Maps tools, the user's own files, or the user's
answers.
