import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const exportSource = readFileSync(resolve(process.cwd(), "client/src/lib/export.ts"), "utf8");
const generatorSource = readFileSync(resolve(process.cwd(), "client/src/pages/Generator.tsx"), "utf8");

describe("export quality safeguards", () => {
  it("keeps Markdown, PDF, and ZIP exports branded, platform-aware, and package-complete", () => {
    expect(exportSource).toContain("Generated with Skillz Magic AI Studio for multi-platform AI operating systems");
    expect(exportSource).toContain("targetPlatform = \"Multi-platform AI\"");
    expect(exportSource).toContain("${targetPlatform} asset generated for copy, PDF archive, buyer delivery, and marketplace packaging.");
    expect(exportSource).toContain("MASTER-OPERATING-SYSTEM.md");
    expect(exportSource).toContain("SKILL.md");
    expect(exportSource).toContain("PROMPTS.md");
    expect(exportSource).toContain("WORKFLOWS.md");
    expect(exportSource).toContain("PLATFORM-ADAPTATION-GUIDE.md");
    expect(exportSource).toContain("manifest.json");
    expect(exportSource).toContain("USAGE-GUIDE.md");
    expect(exportSource).toContain("generatedBy: \"Skillz Magic AI Studio\"");
    expect(exportSource).toContain("platformInstallGuide(targetPlatform)");
  });

  it("disables export and packaging actions until a generated result exists and shows loading/error feedback", () => {
    expect(generatorSource).toContain("disabled={!result}");
    expect(generatorSource).toContain("disabled={!result || saveProduct.isPending}");
    expect(generatorSource).toContain("createAsset.isPending");
    expect(generatorSource).toContain("Generation failed. Please try again.");
    expect(generatorSource).toContain("Asset generated and ready to export.");
    expect(generatorSource).toContain("Marketplace listing saved.");
  });
});
