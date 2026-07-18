# Rank-in-Maps plugin for Claude Code

Connects your AI agent to [Rank-in-Maps](https://rank-in-maps.com) — the
local SEO operations platform. Your agent learns the OKF method and builds
your business a portable **Second Brain**: a structured folder of markdown
files capturing facts, evidence, insights, and actions, in your own
folders, from your own information.

## Install

```
/plugin marketplace add MrBigleg/rank-in-maps-plugin
/plugin install rank-in-maps@rank-in-maps
```

Then run `/mcp` and complete the browser sign-in (OAuth — no API keys),
and try `/rank-in-maps:start`.

## What you get

**Free (any signed-in account):**

| Tool | What it does |
| --- | --- |
| `searchDocs` | Search the local SEO / Maps Intelligence knowledge base |
| `readDocsPage` | Read any knowledge page, including the Second Brain playbook |

**Business MCP members** ([pricing](https://rank-in-maps.com/pricing)) get
eleven additional tools scoped to their own business.

*Setup & discovery — your agent can complete first-time setup itself:*

| Tool | What it does |
| --- | --- |
| `getMyBusiness` | Your business + the `locationId` other tools need |
| `findMyBusiness` | Search Google Places for your business by name + area |
| `connectMyBusiness` | Connect the confirmed match to your account |
| `getDiscoveryInterview` | The nine-section discovery interview script |
| `saveDiscoveryAnswers` | Save answers; finishing triggers your first audit |

*Second Brain workflow:*

| Tool | What it does |
| --- | --- |
| `createSecondBrain` | Opt in; bootstrap the knowledge vault |
| `writeEvidence` | Record customer reviews (low stars get SLA action items) |
| `appendAuditResult` | Append audit summaries to the history |
| `storeGeneratedContent` | Save content drafts |
| `readEntities` | Read structured business facts |
| `readRecentActions` | Read open action items with SLA due dates |

> After upgrading, reconnect the server (`/mcp`) — tool lists are fixed at
> connection time, so new tools appear only on a fresh connection.

## How auth works

The MCP server (`https://chatty-trout-855.convex.site/mcp`) uses standard
OAuth 2.1 (WorkOS AuthKit). Your MCP client discovers the authorization
server automatically and opens a browser sign-in; no tokens or keys are
ever stored in this repository or your config.

## What this repository is not

This repo deliberately contains no knowledge content and no Second Brain
skill files — those are served through the MCP connection to signed-in
accounts. The plugin is just the connector.

## License

MIT (the plugin manifest only; Rank-in-Maps content and tools are governed
by the [Rank-in-Maps terms](https://rank-in-maps.com/terms)).
