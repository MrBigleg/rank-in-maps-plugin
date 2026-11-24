# Claude Directory submission pack (0.9.0)

Two listings, submitted at **claude.ai/directory/manage** by the account owner:

1. **Connector** (remote MCP server with interactive views): `https://app.ctbmarketing.com/mcp`
2. **Plugin** (this repository, which bundles the connector, the `rim-start` skill and five commands)

Submit the connector first; the plugin listing points at it.

## What only the owner can do

- [ ] Merge the app PR (interactive views + `rim_get_geo_grid`) and run `npx convex deploy`.
- [ ] In Claude (web or desktop): Settings → Connectors → Add custom connector →
      `https://app.ctbmarketing.com/mcp`, sign in, and ask "Show my profile audit" and
      "Show where I rank on Google Maps" on a connected business. Confirm the views render.
- [ ] Create a reviewer test account with a connected business that has a saved audit,
      a geo-grid scan, and at least one pending draft (see "Test account" below).
- [ ] Merge this PR and publish the v0.9.0 GitHub release (the README links to it).
- [ ] Fill in the two forms with the copy below and upload the screenshots.

## Listing copy

**Name:** Rank-in-Maps

**One-liner (≤200 chars):**
Local SEO for your Google Business Profile inside Claude: audits, Google Maps rank grids, and review and post drafts you approve before anything goes live.

**Description (≤2000 chars):**

Rank-in-Maps brings local SEO for Google Business Profiles into Claude. Connect your business once, then ask in plain words.

- **See where you rank on Google Maps.** An interactive grid shows your position across your area for each search term. Tap any square to see who ranks there, and see which competitors beat you most.
- **Audit your profile.** Get a score, the fixes that matter most, and every finding by section. Ask Claude to fix one in a click.
- **Approve before anything changes.** Claude drafts review replies, posts, descriptions and category changes. Each one waits in your Rank-in-Maps action queue with a before/after preview. Nothing is published until you press OK, and Claude cannot approve its own drafts.
- **Keep a Second Brain of your business.** Confirmed facts, evidence and findings are saved so Claude picks up where you left off.
- **Start with a mission.** A step tracker walks a new user from finding their business on Google to its free first audit.

Reading audits, rank grids and drafts is free on a free Rank-in-Maps account. Paid actions (fresh scans, Last 30 Days research) always ask first. Sign-in is OAuth; you never paste an API key into chat.

**Categories:** Marketing; Productivity (or Business & Operations where offered).

**URLs**

| Field | Value |
| --- | --- |
| Server URL | `https://app.ctbmarketing.com/mcp` (Streamable HTTP, OAuth 2.1 via WorkOS AuthKit) |
| Website | https://www.rank-in-maps.com |
| Documentation | https://github.com/MrBigleg/rank-in-maps-plugin#readme and https://www.rank-in-maps.com/connect.md |
| Privacy policy | https://www.rank-in-maps.com/privacy |
| Terms | https://www.rank-in-maps.com/terms |
| Support | craig@ctbmarketing.com, or issues on this repository |
| Allowed link URIs | `https://www.rank-in-maps.com`, `https://rank-in-maps.com` |
| Sandbox domain (`_meta.ui.domain`) | `f230e69dc228c6a1916e9d719d367fd1.claudemcpcontent.com` |

The views declare an empty CSP (`connectDomains` and `resourceDomains` are empty): they
load nothing from outside the server and open links only through the host.

## Screenshots

In `assets/screenshots/`, all PNG and at least 1000px wide (rendered at 2x with
`pnpm mcp-app:preview` in the app repo, from fictional fixture data):

1. `01-geo-grid-rank-map.png`: "Show where Harbour Street Coffee ranks for coffee shop on Google Maps"
2. `02-gbp-audit.png`: "Show my Google Business Profile audit"
3. `03-approvals.png`: "What drafts are waiting for my OK?"
4. `04-mission.png`: "Start with Rank-in-Maps"
5. `05-visibility-scorecard-dark.png`: "Score my Google visibility"

The prompt under each screenshot is the example prompt for the listing.

## Tool annotations

Every tool has a `title` and `readOnlyHint` / `destructiveHint` /
`idempotentHint` / `openWorldHint` annotations from the shared contract
(`packages/agent-tool-contract`, enforced by its policy tests). Read tools are
read-only. Tools that replace, delete, cancel or revoke something, or that
store contact details (for example `rim_withdraw_staged_action`,
`rim_delete_view`, `rim_submit_visibility_scorecard`, `rim_create_second_brain`),
are marked destructive. Staging a draft for approval publishes nothing.

## Test account

Give the reviewer a free Rank-in-Maps account (not an admin) with:

- one connected business with a saved audit (`rim_get_gbp_audit`),
- a completed geo-grid scan (`rim_get_geo_grid`),
- one or two pending drafts (`rim_list_pending_approvals`),
- Visibility Scorecard questions (available to every account).

Do not grant credits the reviewer could spend on paid scans. Paid tools ask for
confirmation before running.

## Reviewer test prompts

1. "Start with Rank-in-Maps." → mission view; no new research is started.
2. "Show my Google Business Profile audit." → audit view; "See all findings" opens fullscreen.
3. "Where do I rank on Google Maps for <term>?" → rank map; tapping a square shows the top 3 there.
4. "What drafts are waiting for my OK?" → approvals view; "Review and approve" opens Rank-in-Maps, and nothing is approved from Claude.
5. "Score my Google visibility." → scorecard; answering all questions enables "Score my profile".

## Validation run for this release

```bash
node --experimental-strip-types scripts/sync-app-package.mjs
node scripts/validate-contract.mjs
claude plugin validate --strict --profile directory .
```

All three pass on 0.9.0. The directory also runs a safety scan and a policy review
that the local validator does not.
