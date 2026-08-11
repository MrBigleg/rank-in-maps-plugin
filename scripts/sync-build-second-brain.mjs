import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const pluginRoot = path.resolve(import.meta.dirname, "..");
const defaultAppRoot = path.resolve(pluginRoot, "..", "rank-in-maps-ctbmarketing");
const appRoot = path.resolve(
  process.env.RIM_APP_ROOT ?? process.argv[2] ?? defaultAppRoot,
);
const sourceRoot = path.join(appRoot, "skills", "build-second-brain");
const targetRoot = path.join(pluginRoot, "skills", "rim-build-second-brain");

async function collectFiles(root, relative = "") {
  let entries;
  try {
    entries = await readdir(path.join(root, relative), { withFileTypes: true });
  } catch (error) {
    if (error?.code === "ENOENT" && relative === "") return [];
    throw error;
  }
  const files = [];
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const child = path.join(relative, entry.name);
    if (entry.isSymbolicLink()) {
      throw new Error(`Refusing to sync symbolic link: ${child}`);
    }
    if (entry.isDirectory()) files.push(...await collectFiles(root, child));
    else if (entry.isFile()) files.push(child);
  }
  return files;
}

const sourceFiles = await collectFiles(sourceRoot);
if (!sourceFiles.includes("SKILL.md")) {
  throw new Error(`Canonical skill is missing: ${path.join(sourceRoot, "SKILL.md")}`);
}
const skillText = await readFile(path.join(sourceRoot, "SKILL.md"), "utf8");
if (!/^name:\s*rim-build-second-brain\s*$/m.test(skillText)) {
  throw new Error("Canonical SKILL.md name must be rim-build-second-brain.");
}

const targetFiles = await collectFiles(targetRoot);
const unexpected = targetFiles.filter((relative) => !sourceFiles.includes(relative));
if (unexpected.length > 0) {
  throw new Error(
    `Refusing to remove unexpected packaged files: ${unexpected.join(", ")}`,
  );
}

for (const relative of sourceFiles) {
  const target = path.join(targetRoot, relative);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, await readFile(path.join(sourceRoot, relative)));
}

console.log(
  `Synced ${sourceFiles.length} files from ${sourceRoot} to ${targetRoot}.`,
);
