import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const exportSource = readFileSync(resolve(process.cwd(), "client/src/lib/export.ts"), "utf8");
const generatorSource = readFileSync(resolve(process.cwd(), "client/src/pages/Generator.tsx"), "utf8");
const projectScopeSource = readFileSync(resolve(process.cwd(), "PROJECT_SCOPE.md"), "utf8");

describe("export quality safeguards", () => {
  it("keeps Markdown, PDF, and ZIP exports branded, platform-aware, installation-ready, and package-complete", () => {
    expect(exportSource).toContain('const DOWNLOAD_BRAND = "Freedom One Academy"');
    expect(exportSource).toContain('const DOWNLOAD_CONTACT = "freedom1.digital.@gmail.com"');
    expect(exportSource).toContain("Generated with Skillz Magic AI Studio for multi-platform AI operating systems");
    expect(exportSource).toContain('targetPlatform = "Multi-platform AI"');
    expect(exportSource).toContain("${targetPlatform} asset generated for copy, PDF archive, buyer delivery, marketplace packaging, and AI platform installation.");
    expect(exportSource).toContain("Usage Guide");
    expect(exportSource).toContain("Platform Installation Guide");
    expect(exportSource).toContain("usageGuideMarkdown(title, targetPlatform)");
    expect(exportSource).toContain("platformAdaptationGuideMarkdown(targetPlatform)");
    expect(exportSource).toContain("MASTER-OPERATING-SYSTEM.md");
    expect(exportSource).toContain("SKILL.md");
    expect(exportSource).toContain("PROMPTS.md");
    expect(exportSource).toContain("WORKFLOWS.md");
    expect(exportSource).toContain("PLATFORM-ADAPTATION-GUIDE.md");
    expect(exportSource).toContain("manifest.json");
    expect(exportSource).toContain("USAGE-GUIDE.md");
    expect(exportSource).toContain('generatedBy: "Skillz Magic AI Studio"');
    expect(exportSource).toContain("preparedBy: DOWNLOAD_BRAND");
    expect(exportSource).toContain("contact: DOWNLOAD_CONTACT");
    expect(exportSource).toContain("platformInstallGuide(targetPlatform)");
  });

  it("shows inline generated-asset guidance and mobile-friendly Builder export controls", () => {
    expect(generatorSource).toContain("What this asset does");
    expect(generatorSource).toContain("How to add it to your AI");
    expect(generatorSource).toContain("Freedom One Academy");
    expect(generatorSource).toContain("freedom1.digital.@gmail.com");
    expect(generatorSource).toContain("getPlatformInstallSteps");
    expect(generatorSource).toContain('if (platform === "Claude")');
    expect(generatorSource).toContain('if (platform === "ChatGPT")');
    expect(generatorSource).toContain('if (platform === "Manus")');
    expect(generatorSource).toContain('if (platform === "Grok/Groq")');
    expect(generatorSource).toContain("Create or open a Claude Project");
    expect(generatorSource).toContain("Custom GPT or ChatGPT Project instruction area");
    expect(generatorSource).toContain("project instructions and the workflows as agent runbooks");
    expect(generatorSource).toContain("API-side orchestration notes");
    expect(generatorSource).toContain("selected AI tool's project, custom-instruction, system, or workspace guidance area");
    expect(generatorSource).toContain("sm:grid-cols-3 lg:grid-cols-5");
    expect(generatorSource).toContain("text-xs sm:text-sm");
    expect(generatorSource).toContain("grid grid-cols-2 gap-2 border-b bg-white p-3 sm:flex sm:flex-wrap sm:p-4");
    expect(generatorSource).toContain("min-h-[520px] p-4 sm:min-h-[640px] sm:p-6 lg:p-7");
    expect(generatorSource).toContain("flex min-h-[420px] flex-col items-center justify-center text-center sm:min-h-[520px]");
  });

  it("disables export and packaging actions until a generated result exists and shows loading/error feedback", () => {
    expect(generatorSource).toContain("disabled={!result}");
    expect(generatorSource).toContain("disabled={!result || saveProduct.isPending}");
    expect(generatorSource).toContain("createAsset.isPending");
    expect(generatorSource).toContain("Generation failed. Please try again.");
    expect(generatorSource).toContain("Asset generated and ready to export.");
    expect(generatorSource).toContain("Marketplace listing saved.");
  });

  it("documents that Freedom One Academy export changes are scoped only to this project and chat context", () => {
    expect(projectScopeSource).toContain("claude-skill-studio");
    expect(projectScopeSource).toContain("Skillz Magic AI Studio");
    expect(projectScopeSource).toContain("scoped to this project and this chat/task context only");
    expect(projectScopeSource).toContain("not instructions for any other user project");
    expect(projectScopeSource).toContain("Freedom One Academy");
    expect(projectScopeSource).toContain("freedom1.digital.@gmail.com");
  });
});
