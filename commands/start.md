---
name: start
description: Get oriented with Rank-in-Maps — check your access tier and load the Second Brain playbook
---

Orient yourself with the Rank-in-Maps MCP connection, then report to the user.

1. Call the `searchDocs` tool with query "second brain" to confirm the
   connection works. If the call fails with an authentication error, tell
   the user to run `/mcp` and complete the browser sign-in for
   `rank-in-maps`, then stop.
2. Call `readDocsPage` with path `second-brain/agent-built-brain.md`. This
   is the agent playbook: it explains the OKF method, the folder structure,
   and the exact next steps for building a business Second Brain in the
   user's own folders.
3. Check which tools this connection exposes. If you only see `searchDocs`
   and `readDocsPage`, the user is on the free knowledge tier — the seven
   business tools (`getMyBusiness`, `createSecondBrain`, `writeEvidence`,
   `appendAuditResult`, `storeGeneratedContent`, `readEntities`,
   `readRecentActions`) require a Business MCP pass from
   https://rank-in-maps.com/pricing. Note: after upgrading, the user must
   reconnect (`/mcp`) before the new tools appear.
4. Summarize for the user: their current tier, what they can do with it,
   and — if they have paid access — offer to start building their Second
   Brain by following the playbook from step 2.

Never invent business data: everything you write into a Second Brain must
come from the Rank-in-Maps tools, the user's own files, or the user's
answers.
