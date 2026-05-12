import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const root = "/home/ubuntu/claude-skill-studio";
const ignoredDirectories = new Set(["node_modules", "dist", ".git", ".manus-logs", "drizzle/migrations"]);
const ignoredExtensions = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".ico", ".pdf", ".zip", ".woff", ".woff2", ".ttf"]);
const ignoredFiles = new Set(["pnpm-lock.yaml", "package-lock.json", "yarn.lock"]);

const replacements = [
  [/Skillz Magic AI Studio/g, "Skillz Magic AI Studio"],
  [/Skillz Magic AI Studio/g, "Skillz Magic AI Studio"],
  [/skillz-magic-ai-studio/g, "skillz-magic-ai-studio"],
  [/skillz-magic-ai-studio/g, "skillz-magic-ai-studio"],
];

function shouldSkip(path) {
  const rel = relative(root, path);
  if (!rel) return false;
  if (ignoredFiles.has(rel)) return true;
  if ([...ignoredDirectories].some(dir => rel === dir || rel.startsWith(`${dir}/`))) return true;
  return [...ignoredExtensions].some(ext => rel.toLowerCase().endsWith(ext));
}

function walk(directory) {
  for (const entry of readdirSync(directory)) {
    const path = join(directory, entry);
    if (shouldSkip(path)) continue;
    const stat = statSync(path);
    if (stat.isDirectory()) {
      walk(path);
      continue;
    }
    if (!stat.isFile()) continue;

    let content;
    try {
      content = readFileSync(path, "utf8");
    } catch {
      continue;
    }

    if (content.includes("\u0000")) continue;

    let next = content;
    for (const [pattern, replacement] of replacements) {
      next = next.replace(pattern, replacement);
    }

    if (next !== content) {
      writeFileSync(path, next);
      console.log(`updated ${relative(root, path)}`);
    }
  }
}

walk(root);
