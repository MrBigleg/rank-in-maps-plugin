import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";

const pluginRoot = path.resolve(import.meta.dirname, "..");
const defaultContractSource = path.resolve(
  pluginRoot,
  "..",
  "rank-in-maps-ctbmarketing",
  "packages",
  "agent-tool-contract",
  "src",
  "names.ts",
);
const contractSource = path.resolve(
  process.env.RIM_CONTRACT_SOURCE ?? process.argv[2] ?? defaultContractSource,
);

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

const contract = await import(pathToFileURL(contractSource).href);
const freeTools = [...contract.RIM_MCP_FREE_TOOL_NAMES];
const paidTools = [...contract.RIM_MCP_PAID_TOOL_NAMES];
const expectedLaunchTools = [...new Set([...freeTools, ...paidTools])].sort();

const read = async (relativePath) => readFile(path.join(pluginRoot, relativePath), "utf8");
const [readme, startCommand, mcpConfigText, pluginManifestText, marketplaceText, skillText, openAiText, evalsText] = await Promise.all([
  read("README.md"),
  read("commands/start.md"),
  read(".mcp.json"),
  read(".claude-plugin/plugin.json"),
  read(".claude-plugin/marketplace.json"),
  read("skills/rank-in-maps-last-30-days/SKILL.md"),
  read("skills/rank-in-maps-last-30-days/agents/openai.yaml"),
  read("skills/rank-in-maps-last-30-days/evals/evals.json"),
]);

for (const [name, text] of [
  [".mcp.json", mcpConfigText],
  [".claude-plugin/plugin.json", pluginManifestText],
  [".claude-plugin/marketplace.json", marketplaceText],
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

const documentedFreeCount = Number(
  readme.match(/Free \(any signed-in account\): (\d+) tools/)?.[1],
);
check(
  documentedFreeCount === freeTools.length,
  `README free count is ${documentedFreeCount}; registry count is ${freeTools.length}.`,
);
check(
  startCommand.includes(`free launch set currently contains ${freeTools.length} tools`),
  `commands/start.md must derive its stated free count from the registry (${freeTools.length}).`,
);

const canonicalMcpUrl = "https://app.ctbmarketing.com/mcp";
check(JSON.parse(mcpConfigText).mcpServers?.["rank-in-maps"]?.url === canonicalMcpUrl, ".mcp.json does not use the canonical production MCP URL.");
check(openAiText.includes(`url: "${canonicalMcpUrl}"`), "agents/openai.yaml does not use the canonical production MCP URL.");

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
const currentInstructions = [readme, startCommand, skillText, openAiText, evalsText].join("\n");
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

if (failures.length > 0) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(
    `Plugin contract validation passed: ${freeTools.length} free + ${paidTools.length} paid tools (${expectedLaunchTools.length} unique).`,
  );
}
