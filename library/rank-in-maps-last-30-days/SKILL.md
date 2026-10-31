---
name: rank-in-maps-last-30-days
description: This skill should be used when the user asks "what changed with my business," "what am I missing," "research my last 30 days," or asks about recent competitor moves, customer or review changes, or local visibility changes. It routes through Rank-in-Maps A2A when the host supports it and otherwise uses the Rank-in-Maps MCP tools to produce a cited action report.
metadata:
  version: "0.3.0"
---

# Rank-in-Maps Last 30 Days

Produce the surprise layer: external business evidence the host agent probably did not already know. Rank-in-Maps gathers paid/authenticated evidence; the host agent keeps private context, performs any native public research, compares novelty, and writes the final report.

## Privacy boundary

- Privately inventory relevant facts already present in the conversation, host memory, and user-provided files.
- Never send raw chat, memory, files, hidden reasoning, or this inventory to Rank-in-Maps.
- Send only the accepted structured task fields. Never save agent-derived claims until the human confirms one structured proposal.

## Route and collect

1. Resolve the connected business. Use known context before asking questions, but confirm the exact Google listing when it is unresolved.
2. Use an available A2A client first. Discover `/.well-known/agent-card.json` and invoke the `business-last-30-days` skill. If discovery returns unavailable or not found, use the MCP flow below without presenting the missing A2A route as an error.
3. MCP fallback:
   - Confirm that `rim_get_last_30_days_evidence`, `rim_start_last_30_days_refresh`, and `rim_cancel_last_30_days_refresh` are exposed. If they are absent, explain that Last 30 Days is not enabled on this connection and stop; do not substitute a different paid audit or claim coverage.
   - Call `rim_get_connected_business` for `locationId` if needed.
   - Call `rim_get_last_30_days_evidence({ locationId })` first.
   - Reuse a completed artifact when `isFresh` is true; reading it is free.
   - If missing or stale, tell the human: "A live Rank-in-Maps evidence refresh costs 50 credits." Obtain explicit confirmation.
   - Call `rim_start_last_30_days_refresh` with a stable idempotency key and `acknowledgedCreditCost: 50`.
   - Poll `rim_get_last_30_days_evidence` with the returned task id until terminal. Do not create a new idempotency key while polling.
4. Respect `input-required`. Ask only for the exact missing listing/business identity or 50-credit acknowledgement.
5. Do not trigger a geo-grid scan. If the artifact reports no recent grid, state the gap and separately offer the existing 75-credit scan.

## Research in parallel

While RIM is working, use host-native search tools when available across these four lanes:

- the business itself;
- up to three confirmed nearby competitors;
- customer and review signals;
- local demand and market changes.

Record exactly which lanes and sources were searched. If the host has no search, say so; do not imply coverage. Social posts and broader mentions belong to host research in v1.

## Compare locally

For every material signal, compare it with the private inventory and classify it locally as:

- likely new to the conversation;
- contradicts existing knowledge;
- materially changes a known fact;
- confirms what was already known.

Lead with contradictions, risks, and genuinely new findings. Suppress already-known facts unless they materially changed. Treat `currentSnapshot: true` as current state, never as proof of a 30-day change. Treat unavailable/failed coverage as a limitation, never as "nothing happened."

Read [references/artifact-and-output-contract.md](references/artifact-and-output-contract.md) before writing the report.

## Confirm before save

End with a single structured proposal containing any profile updates, claims, and action items worth saving. Show field values and provenance. Save only after explicit human confirmation, using `rim_save_business_discovery_answers` with `confirmedByUser: true` and `confirmedClaims`. Never persist raw context or research notes.
