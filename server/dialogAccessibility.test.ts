import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = process.cwd();
const clientSourceRoot = join(projectRoot, "client/src");

const readProjectFile = (relativePath: string) =>
  readFileSync(join(projectRoot, relativePath), "utf8");

const collectSourceFiles = (directory: string): string[] => {
  return readdirSync(directory).flatMap((entry) => {
    const absolutePath = join(directory, entry);
    const stats = statSync(absolutePath);

    if (stats.isDirectory()) return collectSourceFiles(absolutePath);
    if (!/\.(tsx|ts)$/.test(entry)) return [];

    return [absolutePath];
  });
};

const extractDialogContentBlocks = (source: string) => {
  const blocks: string[] = [];
  const openTag = "<DialogContent";
  let searchIndex = 0;

  while (true) {
    const start = source.indexOf(openTag, searchIndex);
    if (start === -1) break;

    const end = source.indexOf("</DialogContent>", start);
    expect(end, "DialogContent block must include a closing tag").toBeGreaterThan(start);

    blocks.push(source.slice(start, end + "</DialogContent>".length));
    searchIndex = end + "</DialogContent>".length;
  }

  return blocks;
};

describe("dialog accessibility", () => {
  it("keeps CommandDialog screen-reader title inside DialogContent", () => {
    const source = readProjectFile("client/src/components/ui/command.tsx");
    const dialogContentIndex = source.indexOf("<DialogContent");
    const dialogTitleIndex = source.indexOf("<DialogTitle>{title}</DialogTitle>");
    const dialogContentCloseIndex = source.indexOf("</DialogContent>", dialogContentIndex);

    expect(dialogContentIndex).toBeGreaterThan(-1);
    expect(dialogTitleIndex).toBeGreaterThan(dialogContentIndex);
    expect(dialogTitleIndex).toBeLessThan(dialogContentCloseIndex);
    expect(source).toContain('<DialogHeader className="sr-only">');
  });

  it("keeps ManusDialog accessible even when no visible title is provided", () => {
    const source = readProjectFile("client/src/components/ManusDialog.tsx");

    expect(source).toContain("<DialogTitle");
    expect(source).toContain('title ?? "Login required"');
    expect(source).toContain(': "sr-only"');
  });

  it("requires every local DialogContent usage to contain a DialogTitle descendant", () => {
    const sourceFiles = collectSourceFiles(clientSourceRoot)
      .map((absolutePath) => ({
        absolutePath,
        relativePath: relative(projectRoot, absolutePath),
        source: readFileSync(absolutePath, "utf8"),
      }))
      .filter(({ relativePath }) => relativePath !== "client/src/components/ui/dialog.tsx");

    const dialogBlocks = sourceFiles.flatMap(({ relativePath, source }) =>
      extractDialogContentBlocks(source).map((block) => ({ relativePath, block })),
    );

    expect(dialogBlocks.length).toBeGreaterThan(0);

    const missingTitles = dialogBlocks
      .filter(({ block }) => !block.includes("<DialogTitle"))
      .map(({ relativePath }) => relativePath);

    expect(missingTitles).toEqual([]);
  });
});
