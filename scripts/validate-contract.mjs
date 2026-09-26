import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";

const pluginRoot = path.resolve(import.meta.dirname, "..");
const defaultAppRoot = path.resolve(pluginRoot, "..", "rank-in-maps-ctbmarketing");
const configuredAppRoot = path.resolve(process.env.RIM_APP_ROOT ?? defaultAppRoot);
const defaultContractSource = path.join(
  configuredAppRoot,
  "packages",
  "agent-tool-contract",
  "src",
  "names.ts",
);
const contractSource = path.resolve(
  process.env.RIM_CONTRACT_SOURCE ?? process.argv[2] ?? defaultContractSource,
);
const applicationRoot = process.env.RIM_APP_ROOT
  ? configuredAppRoot
  : path.resolve(path.dirname(contractSource), "..", "..", "..");

const failures = [];

function check(condition, message) {
  if (!condition) failures.push(message);
}

function sameMembers(actual, expected) {
  return actual.length === expected.length
    && actual.every((value, index) => value === expected[index]);
}

function extractToolTableNames(markdown) {
  return [...markdown.matchAll(/^\|\s*`(rim_[a-z0-9_]+)`\s*\|/gm)]
    .map((match) => match[1])
    .sort();
}

function parseSkillFrontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) return null;
  const topKeys = new Set();
  const values = new Map();
  const metadata = new Map();
  let section = null;
  for (const line of match[1].split(/\r?\n/)) {
    if (!line.trim() || line.trimStart().startsWith("#")) continue;
    const parsed = line.trim().match(/^([A-Za-z0-9_-]+):(?:\s*(.*))?$/);
    if (!parsed) continue;
    const [, key, rawValue = ""] = parsed;
    const value = rawValue.trim().replace(/^(?:"(.*)"|'(.*)')$/, "$1$2");
    const indented = /^\s/.test(line);
    if (indented) {
      if (section === "metadata" && value) metadata.set(key, value);
      continue;
    }
    topKeys.add(key);
    if (value && ![">", ">-", "|", "|-"].includes(value)) values.set(key, value);
    section = value ? null : key;
  }
  return { topKeys, values, metadata };
}

async function collectRelativeFiles(root, relative = "") {
  const entries = await readdir(path.join(root, relative), { withFileTypes: true });
  const files = [];
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const child = path.join(relative, entry.name);
    check(!entry.isSymbolicLink(), `Skill package contains a symbolic link: ${child}`);
    if (entry.isDirectory()) files.push(...await collectRelativeFiles(root, child));
    else if (entry.isFile()) files.push(child);
  }
  return files;
}

function validateSkill(directory, text) {
  const parsed = parseSkillFrontmatter(text);
  check(Boolean(parsed), `${directory}/SKILL.md has malformed frontmatter.`);
  if (!parsed) return;
  const allowedKeys = new Set([
    "name",
    "description",
    "license",
    "compatibility",
    "metadata",
    "allowed-tools",
  ]);
  const name = parsed.values.get("name");
  check(name === directory, `${directory}/SKILL.md name must match its parent directory.`);
  check(
    typeof name === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name) && name.length <= 64,
    `${directory}/SKILL.md name does not meet Agent Skills naming constraints.`,
  );
  check(parsed.topKeys.has("description"), `${directory}/SKILL.md requires a description.`);
  check(
    [...parsed.topKeys].every((key) => allowedKeys.has(key)),
    `${directory}/SKILL.md contains unsupported top-level frontmatter keys.`,
  );
  check(!parsed.topKeys.has("version"), `${directory}/SKILL.md version must be under metadata.version.`);
  check(Boolean(parsed.metadata.get("version")), `${directory}/SKILL.md requires metadata.version.`);
}

const contract = await import(pathToFileURL(contractSource).href);
const freeTools = [...contract.RIM_MCP_FREE_TOOL_NAMES];
const paidTools = [...contract.RIM_MCP_PAID_TOOL_NAMES];
const expectedLaunchTools = [...new Set([...freeTools, ...paidTools])].sort();

const read = async (relativePath) => readFile(path.join(pluginRoot, relativePath), "utf8");
const [
  readme,
  startCommand,
  legacyMcpText,
  claudeManifestText,
  marketplaceText,
  portablePluginText,
  portableMcpText,
  skillText,
  secondBrainSkillText,
  openAiText,
  evalsText,
] = await Promise.all([
  read("README.md"),
  read("commands/start.md"),
  read(".mcp.json"),
  read(".claude-plugin/plugin.json"),
  read(".claude-plugin/marketplace.json"),
  read("plugin.json"),
  read("mcp.json"),
  read("skills/rank-in-maps-last-30-days/SKILL.md"),
  read("skills/rim-build-second-brain/SKILL.md"),
  read("skills/rank-in-maps-last-30-days/agents/openai.yaml"),
  read("skills/rank-in-maps-last-30-days/evals/evals.json"),
]);

for (const [name, text] of [
  [".mcp.json", legacyMcpText],
  [".claude-plugin/plugin.json", claudeManifestText],
  [".claude-plugin/marketplace.json", marketplaceText],
  ["plugin.json", portablePluginText],
  ["mcp.json", portableMcpText],
  ["skills/rank-in-maps-last-30-days/evals/evals.json", evalsText],
]) {
  try {
    JSON.parse(text);
  } catch (error) {
    failures.push(`${name} is not valid JSON: ${error.message}`);
  }
}

const freeSectionStart = readme.indexOf("**Free (any signed-in account)");
const paidSectionStart = readme.indexOf("**Business MCP members**");
const appsSectionStart = readme.indexOf("## MCP Apps rendering");
check(freeSectionStart >= 0 && paidSectionStart > freeSectionStart, "README free tool section is missing or out of order.");
check(appsSectionStart > paidSectionStart, "README paid tool section is missing or out of order.");

const documentedFreeTools = extractToolTableNames(
  readme.slice(freeSectionStart, paidSectionStart),
);
const documentedPaidTools = extractToolTableNames(
  readme.slice(paidSectionStart, appsSectionStart),
);
const documentedLaunchTools = [...new Set([
  ...documentedFreeTools,
  ...documentedPaidTools,
])].sort();

check(
  sameMembers(documentedFreeTools, [...freeTools].sort()),
  `README free table differs from the registry.\nExpected: ${[...freeTools].sort().join(", ")}\nActual:   ${documentedFreeTools.join(", ")}`,
);
check(
  sameMembers(documentedPaidTools, [...paidTools].sort()),
  `README paid tables differ from the registry.\nExpected: ${[...paidTools].sort().join(", ")}\nActual:   ${documentedPaidTools.join(", ")}`,
);
check(
  sameMembers(documentedLaunchTools, expectedLaunchTools),
  `README launch tables differ from the registry.\nExpected: ${expectedLaunchTools.join(", ")}\nActual:   ${documentedLaunchTools.join(", ")}`,
);

check(startCommand.includes("rim_start_here"), "Start command must use the first-mission entry tool.");
check(!/free launch set currently contains \d+/.test(startCommand), "Start command must not hard-code catalog counts.");
const starter = await read("skills/rim-start/SKILL.md");
validateSkill("rim-start", starter);
check(starter.includes("rim_browser_get_mission"), "Starter must distinguish browser site tools from remote MCP.");
const codexManifest = JSON.parse(await read(".codex-plugin/plugin.json"));
const rootManifest = JSON.parse(portablePluginText);
check(codexManifest.version === rootManifest.version, "Codex overlay version drifted.");
check(JSON.stringify(codexManifest.interface) === JSON.stringify(rootManifest.extensions?.["com.openai"]?.interface), "OpenAI interface metadata drifted.");

const canonicalMcpUrl = "https://app.ctbmarketing.com/mcp";
const portablePlugin = JSON.parse(portablePluginText);
const portableMcp = JSON.parse(portableMcpText);
const claudeManifest = JSON.parse(claudeManifestText);
const legacyMcp = JSON.parse(legacyMcpText);
const portableServer = portableMcp.mcpServers?.["rank-in-maps"];
const pluginSchema = "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json";
const mcpSchema = "https://agent-plugins.org/schemas/1.0.0/mcp.schema.json";
const pluginKeys = new Set([
  "$schema",
  "name",
  "version",
  "description",
  "author",
  "homepage",
  "repository",
  "license",
  "keywords",
  "extensions",
]);

check(portablePlugin.$schema === pluginSchema, "plugin.json must pin Agent Plugins schema 1.0.0.");
check(portablePlugin.name === "rank-in-maps", "plugin.json name must be rank-in-maps.");
check(/^\d+\.\d+\.\d+$/.test(portablePlugin.version), "plugin.json version must be SemVer.");
check(
  portablePlugin.version === claudeManifest.version,
  "Portable and Claude plugin manifest versions must match.",
);
check(
  Object.keys(portablePlugin).every((key) => pluginKeys.has(key)),
  "plugin.json contains unsupported top-level keys.",
);
check(
  Object.keys(portablePlugin.author ?? {}).every((key) => ["name", "email", "url"].includes(key)),
  "plugin.json author contains unsupported keys.",
);
check(portableMcp.$schema === mcpSchema, "mcp.json must pin Agent Plugins MCP schema 1.0.0.");
check(
  Object.keys(portableMcp).every((key) => ["$schema", "mcpServers"].includes(key)),
  "mcp.json contains unsupported top-level keys.",
);
check(portableServer?.type === "streamable-http", "mcp.json must use streamable-http.");
check(portableServer?.url === canonicalMcpUrl, "mcp.json does not use the canonical production MCP URL.");
check(!Object.hasOwn(portableServer ?? {}, "headers"), "mcp.json must not embed authentication headers.");
check(
  Object.keys(portableServer ?? {}).every((key) => ["type", "url"].includes(key)),
  "mcp.json server contains unsupported keys.",
);
check(legacyMcp.mcpServers?.["rank-in-maps"]?.url === canonicalMcpUrl, ".mcp.json does not use the canonical production MCP URL.");
check(openAiText.includes(`url: "${canonicalMcpUrl}"`), "agents/openai.yaml does not use the canonical production MCP URL.");
check(!/authorization|bearer\s+|api[_-]?key/i.test(portableMcpText), "Portable MCP config must not contain credentials.");

const retiredNames = [
  "searchDocs",
  "readDocsPage",
  "getMyBusiness",
  "findMyBusiness",
  "connectMyBusiness",
  "getDiscoveryInterview",
  "saveDiscoveryAnswers",
  "createSecondBrain",
  "writeEvidence",
  "appendAuditResult",
  "storeGeneratedContent",
  "readEntities",
  "readRecentActions",
];
const currentInstructions = [
  readme,
  startCommand,
  skillText,
  secondBrainSkillText,
  openAiText,
  evalsText,
].join("\n");
for (const retiredName of retiredNames) {
  check(!currentInstructions.includes(retiredName), `Retired tool name remains: ${retiredName}`);
}

check(
  /^description: This skill should be used when /m.test(skillText),
  "The Last 30 Days skill description must use third-person trigger phrasing.",
);
check(
  readme.includes("## MCP Apps rendering") && readme.includes("normal text response"),
  "README must document MCP Apps rendering and its text fallback.",
);
check(
  readme.includes("When the A2A release flag is enabled")
    && skillText.includes("If discovery returns unavailable or not found"),
  "A2A documentation must remain conditional and include the MCP fallback.",
);

validateSkill("rank-in-maps-last-30-days", skillText);
validateSkill("rim-build-second-brain", secondBrainSkillText);

const canonicalSkillRoot = path.join(applicationRoot, "skills", "build-second-brain");
const packagedSkillRoot = path.join(pluginRoot, "skills", "rim-build-second-brain");
const [canonicalFiles, packagedFiles] = await Promise.all([
  collectRelativeFiles(canonicalSkillRoot),
  collectRelativeFiles(packagedSkillRoot),
]);
check(
  sameMembers(canonicalFiles, packagedFiles),
  `Second Brain package file list differs from canonical source.\nExpected: ${canonicalFiles.join(", ")}\nActual:   ${packagedFiles.join(", ")}`,
);
for (const relative of canonicalFiles.filter((file) => packagedFiles.includes(file))) {
  const [canonicalContent, packagedContent] = await Promise.all([
    readFile(path.join(canonicalSkillRoot, relative)),
    readFile(path.join(packagedSkillRoot, relative)),
  ]);
  check(
    canonicalContent.equals(packagedContent),
    `Packaged Second Brain file differs from canonical source: ${relative}`,
  );
}

if (failures.length > 0) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(
    `Plugin contract validation passed: Agent Plugins 1.0.0, canonical skills + Last 30 Days, ${freeTools.length} free + ${paidTools.length} paid tools (${expectedLaunchTools.length} unique).`,
  );
}
