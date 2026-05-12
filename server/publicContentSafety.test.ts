import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = path.resolve(__dirname, "..");

const publicRouteFiles = [
  "client/src/pages/Home.tsx",
  "client/src/pages/Pricing.tsx",
  "client/src/pages/Instructions.tsx",
  "client/src/pages/Marketplace.tsx",
  "client/src/pages/Account.tsx",
  "client/src/components/AppShell.tsx",
];

const ownerOnlyTerms = [
  "business plan",
  "viability study",
  "market viability",
  "market-positioning",
  "market positioning",
  "go-to-market",
  "pricing strategy",
  "sales funnel",
  "owner-only",
  "private handoff",
  "owner handoff",
];

const privateDocumentReferences = [
  "docs/owner_handoff_package_index.md",
  "docs/market_viability_assessment.md",
  "docs/social_media_marketing_package.md",
  "docs/viability_source_notes.md",
  "docs/retail_readiness_qa_report.md",
  "docs/github_delivery_and_deployment_guide.md",
];

describe("customer-facing public content safety", () => {
  it("keeps owner-only strategy terms and private handoff document links out of public routes", () => {
    const auditedContent = publicRouteFiles.map(relativePath => {
      const absolutePath = path.join(projectRoot, relativePath);
      expect(fs.existsSync(absolutePath), `${relativePath} should exist for the public route audit`).toBe(true);
      return {
        relativePath,
        content: fs.readFileSync(absolutePath, "utf8").toLowerCase(),
      };
    });

    for (const { relativePath, content } of auditedContent) {
      for (const term of ownerOnlyTerms) {
        expect(content, `${relativePath} should not expose owner-only term: ${term}`).not.toContain(term);
      }

      for (const privateReference of privateDocumentReferences) {
        expect(content, `${relativePath} should not link private handoff document: ${privateReference}`).not.toContain(privateReference.toLowerCase());
      }
    }
  });

  it("records the owner-approval rule in the private handoff package", () => {
    const handoffPath = path.join(projectRoot, "docs/owner_handoff_package_index.md");
    const handoffContent = fs.readFileSync(handoffPath, "utf8");

    expect(handoffContent).toContain("## Public-content approval rule");
    expect(handoffContent).toContain("unless the owner explicitly approves their publication");
    expect(handoffContent).toContain("should not be linked from the public navigation");
  });
});
