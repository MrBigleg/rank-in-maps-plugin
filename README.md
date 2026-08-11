# Rank-in-Maps Agent Plugin

Connects your AI agent to [Rank-in-Maps](https://rank-in-maps.com) — the
local SEO operations platform. Your agent learns the OKF method and builds
your business a portable **Second Brain**: a structured folder of markdown
files capturing facts, evidence, insights, and actions, in your own
folders, from your own information. The repository implements the portable
Agent Plugins 1.0 layout while retaining its existing Claude Code package.

## Install

### Agent Plugins 1.0 clients

Install this GitHub repository through the client's Agent Plugin flow. The
portable entry points are `plugin.json`, `mcp.json`, and the immediate child
directories under `skills/`. OAuth is discovered and completed by the client;
the package contains no credentials or authorization headers.

### Claude Code

```
/plugin marketplace add MrBigleg/rank-in-maps-plugin
/plugin install rank-in-maps@rank-in-maps
```

Then run `/mcp` and complete the browser sign-in (OAuth — no API keys),
and try `/rank-in-maps:start` or `/rank-in-maps:last30days`.

The standalone skills can also be installed in Codex, Cursor, Antigravity,
Hermes, and other Agent Skills-compatible hosts:

```
npx skills add MrBigleg/rank-in-maps-plugin --skill rank-in-maps-last-30-days
npx skills add MrBigleg/rank-in-maps-plugin --skill rim-build-second-brain
```

Gemini Spark uses its separate `rim-build-second-brain.zip` upload with a
root-level `SKILL.md`; the portable Agent Plugin does not replace that package.

## What you get

- `rank-in-maps-last-30-days`: cited recent-change and competitor evidence.
- `rim-build-second-brain`: the portable OKF Second Brain builder and templates.
- The Rank-in-Maps Streamable HTTP MCP server, with client-managed OAuth.

**Free (any signed-in account): 19 tools.**

| Tool | What it does |
| --- | --- |
| `rim_search_docs` | Search Rank-in-Maps product documentation |
| `rim_read_doc_page` | Read a product-documentation page, including the Second Brain playbook |
| `rim_search_local_seo_knowledge` | Search the source-cited Local SEO / GBP knowledge base |
| `rim_read_local_seo_page` | Read a source-cited Local SEO / GBP knowledge page |
| `rim_get_visibility_scorecard_questions` | Start the free Visibility Scorecard interview |
| `rim_submit_visibility_scorecard` | Submit the completed Visibility Scorecard |
| `rim_search_business_listings` | Search Google Places for a business |
| `rim_connect_business` | Connect the human-confirmed listing |
| `rim_create_second_brain` | Opt in; bootstrap the knowledge vault |
| `rim_record_review_evidence` | Record customer reviews (low stars get SLA action items) |
| `rim_record_audit_result` | Record audit summaries in the history |
| `rim_save_content_draft` | Save content drafts |
| `rim_get_business_facts` | Read structured business facts |
| `rim_list_open_actions` | Read open actions with SLA dates |
| `rim_get_second_brain_status` | Read hosted Second Brain status |
| `rim_export_context_pack` | Export a portable markdown context pack |
| `rim_list_ui_catalogs` | List available Rank-in-Maps UI atom catalogs |
| `rim_get_ui_catalog` | Read atom schemas and field contracts |
| `rim_render_surface` | Validate and render an atom as structured Surface JSON |

**Business MCP members** ([pricing](https://rank-in-maps.com/pricing)) get
up to 8 additional tools scoped to their own business. The three Last 30
Days tools appear only while that production feature is enabled.

*Setup & discovery — your agent can complete first-time setup itself:*

| Tool | What it does |
| --- | --- |
| `rim_get_connected_business` | Your business + the `locationId` other tools need |
| `rim_get_business_discovery_context` | Known facts, schema, coverage, conflicts, and gaps for agent-first onboarding |
| `rim_save_business_discovery_answers` | Save one human-confirmed structured profile with field provenance |

*Last 30 Days evidence:*

| Tool | What it does |
| --- | --- |
| `rim_get_last_30_days_evidence` | Read the latest shared evidence task/artifact; fresh reads are free |
| `rim_start_last_30_days_refresh` | Run a confirmed 50-credit live refresh, idempotently |
| `rim_cancel_last_30_days_refresh` | Cancel a task and refund a pending reservation |

The calling agent—not a Rank-in-Maps model—combines this evidence with its
own private context and native research, decides what is genuinely new, and
writes the final report. Raw conversation and memory are never sent to RIM.

*Hosted UI previews:*

| Tool | What it does |
| --- | --- |
| `rim_create_surface_preview` | Create a display-only preview URL for a validated UI atom |
| `rim_revoke_surface_preview` | Revoke a preview URL before it expires |

## MCP Apps rendering

On hosts that support MCP Apps, Rank-in-Maps can render host-adaptive visual
views for GBP performance, optimisation health, priorities, open actions,
recent activity, and Second Brain status. The server advertises and serves
these resources automatically; the plugin needs no host-specific UI config.

Every enhanced tool keeps its normal text response. Hosts without MCP Apps
support therefore receive the same usable result as before, without an iframe
or visual card.

> Contract 2.0.0 renamed the public tool catalog. Reconnect the server
> (`/mcp`) after upgrading because clients cache `tools/list` at connection time.

## How auth works

The MCP server (`https://app.ctbmarketing.com/mcp`) uses standard
OAuth 2.1 (WorkOS AuthKit). Your MCP client discovers the authorization
server automatically and opens a browser sign-in; no tokens or keys are
ever stored in this repository or your config. The former
`chatty-trout-855.convex.site` endpoint remains an additive compatibility URL.
Version 0.4 uses the branded URL, so complete browser sign-in once after the
plugin update if `/mcp` shows the connection as unauthenticated.

When the A2A release flag is enabled, Rank-in-Maps advertises an A2A 1.0.1
Agent Card at `https://app.ctbmarketing.com/.well-known/agent-card.json`.
Hosts with an A2A client can then delegate the same long-running task through
`/a2a`; when the card is unavailable, use the MCP fallback described by the
skill. Both enabled routes share task IDs, billing, and the canonical
`rim.business-last-30-days.v1` artifact.

## What this repository is not

This repo contains the public routing/orchestration skill, not customer data,
provider credentials, raw evidence payloads, or a server-side report-writing
model. Authenticated business evidence remains behind Rank-in-Maps.

## Maintainer validation

With the `rank-in-maps-ctbmarketing` application checkout beside this repo,
sync the canonical Second Brain skill and validate every package contract:

```bash
node scripts/sync-build-second-brain.mjs
node --experimental-strip-types scripts/validate-contract.mjs
claude plugin validate --strict .
```

Pass the application root to the sync script, or set `RIM_APP_ROOT`, when the
application checkout is elsewhere. The contract validator derives the same
root from the explicit `packages/agent-tool-contract/src/names.ts` path.

## Privacy & support

- [Privacy policy](https://rank-in-maps.com/privacy) — how Rank-in-Maps
  handles account and business data. As noted above, raw conversation and
  memory from your agent are never sent to RIM.
- [Terms of service](https://rank-in-maps.com/terms)
- Support: [craig@ctbmarketing.com](mailto:craig@ctbmarketing.com) or open
  an issue on this repo.

## License

MIT (the plugin manifest only; Rank-in-Maps content and tools are governed
by the [Rank-in-Maps terms](https://rank-in-maps.com/terms)).
