import { describe, expect, it } from "vitest";
import { buildFallbackAsset } from "./routers";

describe("generator custom category fallback", () => {
  it("includes custom profession, industry, platform, and asset category context in a Master Operating System", () => {
    const content = buildFallbackAsset({
      assetType: "master_os",
      mode: "autonomous",
      title: "Custom Aviation Compliance Operating System",
      professionCategory: "Aviation Compliance Consultants",
      industryCategory: "Private Aviation Operations",
      businessType: "Boutique advisory firm",
      industry: "Aviation",
      customCategoryContext: "Part 135 safety audit workflows",
      targetPlatform: "Perplexity Spaces",
      audience: "aviation compliance teams",
      goal: "standardize safety audit preparation",
      constraints: "avoid legal advice and require expert review",
      recommendedAssetFocus: "focus on audit intake, evidence collection, safety review prompts, and manager handoffs",
    });

    expect(content).toContain("Custom Aviation Compliance Operating System");
    expect(content).toContain("Perplexity Spaces");
    expect(content).toContain("Aviation Compliance Consultants / Private Aviation Operations / Boutique advisory firm / Aviation / Part 135 safety audit workflows");
    expect(content).toContain("## Category Map / Recommended Asset Map");
    expect(content).toContain("focus on audit intake, evidence collection, safety review prompts, and manager handoffs");
  });
});
