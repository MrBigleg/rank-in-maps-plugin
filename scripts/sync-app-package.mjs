import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = path.resolve(import.meta.dirname, '..');
const app = path.resolve(process.env.RIM_APP_ROOT ?? path.join(root, '..', 'rank-in-maps-ctbmarketing'));
const generated = path.join(app, 'packages/agent-tool-contract/dist/agent-plugin');
const { RIM_MCP_FREE_TOOL_NAMES: free, RIM_MCP_PAID_TOOL_NAMES: paid } = await import(pathToFileURL(path.join(app, 'packages/agent-tool-contract/src/names.ts')));
const { getToolDefinition } = await import(pathToFileURL(path.join(app, 'packages/agent-tool-contract/src/registry.ts')));
// Keep the plugin-owned Last 30 Days workflow. Sync only canonical app files.
for (const name of ['plugin.json', 'mcp.json', '.codex-plugin', 'skills']) {
  await cp(path.join(generated, name), path.join(root, name), { recursive: true });
}
const manifest = JSON.parse(await readFile(path.join(root, 'plugin.json'), 'utf8'));
const claudePath = path.join(root, '.claude-plugin/plugin.json');
const claude = JSON.parse(await readFile(claudePath, 'utf8'));
claude.version = manifest.version;
await writeFile(claudePath, JSON.stringify(claude, null, 2) + '\n');
const starter = await readFile(path.join(root, 'skills/rim-start/SKILL.md'), 'utf8');
await writeFile(path.join(root, 'commands/start.md'), '---\nname: start\ndescription: Start with Rank-in-Maps using live connection and mission state\n---\n' + starter.replace(/^---[\s\S]*?---\s*/, '\n'));
function table(names) {
  return '| Tool | What it does |\n| --- | --- |\n' + names.map(name => {
    const def = getToolDefinition(name);
    if (!def) throw new Error(`Missing contract definition: ${name}`);
    return `| \`${name}\` | ${def.description.replaceAll('|', '\\|').replaceAll('\n', ' ')} |`;
  }).join('\n');
}
const readmePath = path.join(root, 'README.md');
const readme = await readFile(readmePath, 'utf8');
const start = readme.indexOf('**Free (any signed-in account)');
const end = readme.indexOf('## MCP Apps rendering');
if (start < 0 || end < start) throw new Error('Missing README catalog markers');
const catalog = `**Free (any signed-in account)**\n\nGenerated from the application contract. Availability is determined by live account\npermissions, feature flags and quotas; this table is not an entitlement assertion.\n\n${table(free)}\n\n**Business MCP members**\n\nAdditional account-scoped capabilities. A paid plan does not grant permission to\nrun a paid refresh or publish: ask for the user's approval. Last 30 Days remains\nfeature-controlled.\n\n${table(paid)}\n\n`;
await writeFile(readmePath, readme.slice(0, start) + catalog + readme.slice(end));
await mkdir(path.join(root, 'docs'), { recursive: true });
console.log(`Synced ${manifest.version}: ${free.length} free / ${paid.length} paid contract entries. Catalog visibility may differ.`);
