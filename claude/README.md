# Rank-in-Maps for Claude

The local SEO layer for your AI. Rank-in-Maps connects Claude to your Google
Business Profile and gives your business a memory you own.

- **A Second Brain of your business.** Confirmed facts, evidence, findings and
  actions are kept in a structured folder in your own Google Drive, in the open
  OKF format, so Claude picks up where you left off.
- **An open, source-linked local SEO knowledge base.** Claude answers from
  published local SEO and Google Business Profile guidance, with sources.
- **Live data.** Live Google search and Maps data, Gemini grounded in Google
  Search and Maps, Search Console, Google Analytics, and your profile's reviews
  and posts.
- **Interactive views in the chat.** Audits, action plans, competitors,
  profile health, scorecards and approvals render inside Claude.
- **Drafts you approve.** Review replies, posts, descriptions and category
  changes wait in your Rank-in-Maps action queue. Nothing reaches Google until
  you press OK, and Claude cannot approve its own drafts.

## What's in the plugin

- The Rank-in-Maps remote MCP server, `https://app.ctbmarketing.com/mcp`
  (Streamable HTTP, OAuth sign-in; no API keys).
- The `rim-start` skill, which routes plain-language requests to the right tools.
- Commands: `/rank-in-maps:start`, `/rank-in-maps:audit`,
  `/rank-in-maps:approvals`, `/rank-in-maps:rank-map`,
  `/rank-in-maps:last30days`.

Nothing runs on your computer. The plugin contains only Markdown instructions,
a manifest and an icon.

## Getting started

1. Install the plugin:

   ```
   /plugin install rank-in-maps --marketplace MrBigleg/rank-in-maps-plugin
   ```

   Then sign in to Rank-in-Maps when Claude asks (a free
   account works).
2. Ask **Start with Rank-in-Maps**. Claude finds your business on Google,
   connects it and walks you through its free first audit.

## Data it sends

Your requests go to the Rank-in-Maps server, which reads your Google Business
Profile (and, if you connect them, Search Console, Google Analytics and Google
Drive) with your OAuth consent. Changes to Google are staged as drafts and
published only after you approve them in the Rank-in-Maps dashboard. Paid
actions always ask first.

- Privacy policy: https://www.rank-in-maps.com/privacy
- Terms: https://www.rank-in-maps.com/terms
- Support: craig@ctbmarketing.com or this repository's issues

## Licence

MIT. See [LICENSE](LICENSE).
