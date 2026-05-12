import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = resolve(__dirname, "..");

function readProjectFile(relativePath: string) {
  return readFileSync(resolve(projectRoot, relativePath), "utf8");
}

describe("Instructions page", () => {
  it("is available from routing and global navigation", () => {
    const app = readProjectFile("client/src/App.tsx");
    const shell = readProjectFile("client/src/components/AppShell.tsx");
    const instructions = readProjectFile("client/src/pages/Instructions.tsx");

    expect(app).toContain("./pages/Instructions");
    expect(app).toContain('path="/instructions"');
    expect(shell).toContain('{ href: "/instructions", label: "Instructions" }');
    expect(instructions).toContain("How to use Skillz Magic AI Studio from idea to sellable asset");
    expect(instructions).toContain("Other / Custom");
    expect(instructions).toContain("Package and checkout guidance");
  });
});
