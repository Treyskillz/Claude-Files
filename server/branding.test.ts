import { describe, expect, it } from "vitest";
import { APP_BRAND } from "../shared/branding";

describe("Skills Magic AI branding", () => {
  it("uses the requested product name and multi-platform Master Operating Systems positioning", () => {
    expect(APP_BRAND.name).toBe("Skills Magic AI");
    expect(APP_BRAND.primaryAsset).toBe("Master Operating Systems");
    expect(APP_BRAND.supportedPlatforms).toContain("Claude");
    expect(APP_BRAND.supportedPlatforms).toContain("ChatGPT");
    expect(APP_BRAND.supportedPlatforms).toContain("Manus");
    expect(APP_BRAND.supportedPlatforms).toContain("Grok/Groq");
  });
});
