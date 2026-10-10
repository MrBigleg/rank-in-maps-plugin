# Platform launch checklist — 2026-10-10

Package 0.6.0 reuses the portable Agent Plugins 1.0 format. Root `plugin.json`,
`mcp.json` and `skills/` are canonical; Claude and Codex compatibility manifests
remain. The current tool catalogue is synced from the app contract, including
41 free and 21 Business MCP entries. Live permissions and flags determine access.

| Route | Prepared here | Still required |
| --- | --- | --- |
| Claude Code | Existing marketplace and MCP configuration, restart/sign-in guidance | Clean plugin install and authenticated starter acceptance |
| Hermes | Portable package, flattened string metadata, approval trust extension, recovery config | Native validation and clean OAuth/starter; resolve portable catalogue format conflict |
| Codex local | `.agents/plugins/marketplace.json` pointing at root; OpenAI onboarding skill | Actual local discovery/install/sign-in/setup |
| ChatGPT / Codex public | Portable package and existing submission packet | OpenAI portal/domain/OAuth/reviewer/tool-metadata acceptance and approval |
| Other Agent Skills hosts | Starter and canonical skills | Separate MCP auth and host-specific acceptance |

The package calls the hosted RIM MCP at `https://app.ctbmarketing.com/mcp`.
No plugin-owned shell hooks, Python runtime, local credential reads, updater,
telemetry or background service is added. Hosts manage authentication and
authorization. Tool calls may read account data, store drafts, spend credits
or request external changes according to the server's permissions and user
approval. Hermes requests `trust: untrusted`; missing read-only annotations may
cause read calls to prompt too. Existing config entries can override that request.

Maintainer checks:

```sh
node --experimental-strip-types scripts/sync-app-package.mjs
node --experimental-strip-types scripts/validate-contract.mjs
claude plugin validate --strict .
claude plugin validate --strict .claude-plugin/plugin.json
```

Set `RIM_APP_ROOT` to the reviewed app checkout before syncing. Native Hermes
validation is not recorded yet. Passing package validation is not an OAuth,
client runtime or public catalogue acceptance result.

Hermes catalogue docs require native YAML, but current discovery prioritizes it
over portable JSON and the native loader then requires `__init__.py`. This package
deliberately omits YAML so portable skills and MCP load. Resolve portable catalogue
admission with Hermes maintainers or a separately tested distribution before
running catalogue validate/Doctor and submitting. See the
[discovery source](https://github.com/NousResearch/hermes-agent/blob/main/hermes_cli/plugins_discovery.py)
and [loader](https://github.com/NousResearch/hermes-agent/blob/main/hermes_cli/plugins_loader.py).

Before publication, pin the released 40-character SHA and matching version in
accepted Hermes catalogue material; retain the risk disclosures above. OpenAI public
publication uses one universal listing; a local marketplace does not publish it.
See [OpenAI readiness](openai-submission.md),
[Hermes catalogue rules](https://hermes-agent.nousresearch.com/docs/developer-guide/plugins/catalog-submission),
[Claude plugin guide](https://code.claude.com/docs/en/plugins/create) and
[OpenAI packaging](https://developers.openai.com/plugins/build/plugins).
