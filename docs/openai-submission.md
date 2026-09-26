# OpenAI submission readiness — September 25, 2026

Version 0.5.0 reconciles the first-mission entry skill, canonical app skills,
portable manifest and OpenAI interface metadata. It is not a public directory
approval or a production OAuth acceptance result.

Use **With MCP → Universal** and `https://app.ctbmarketing.com/mcp` in the
[OpenAI submission portal](https://platform.openai.com/plugins). Upload the
reviewed skills package; Claude commands have been converted into `rim-start`.
Do not submit an existing integration ID in place of the server.

The [application's submission packet](https://github.com/MrBigleg/rank-in-maps-ctbmarketing/blob/codex/browser-agent-experience/docs/connections/openai-plugin-submission.md)
contains listing copy, five positive and three negative test specifications,
observed public endpoint checks and detailed remaining gates. Refer to the
[official submission instructions](https://developers.openai.com/plugins/deploy/submission)
when completing the current portal.

Still required: per-tool safety annotations, live OpenAI OAuth and UserInfo
claim verification, a designated reviewer account, domain challenge token,
publisher identity/role, support/country choices, final assets, authenticated
acceptance and portal scanning. The read-only public checks cannot close these.

Local validation:

```sh
RIM_APP_ROOT=/path/to/rank-in-maps-ctbmarketing node --experimental-strip-types scripts/sync-app-package.mjs
RIM_APP_ROOT=/path/to/rank-in-maps-ctbmarketing node --experimental-strip-types scripts/validate-contract.mjs
```

Regenerate the application package with `pnpm agent-plugin:emit` before syncing.
The sync retains the plugin-owned Last 30 Days skill. Keep installation,
authorization, paid entitlement and publication as distinct states.
