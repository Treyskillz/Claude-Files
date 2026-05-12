import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const read = (relativePath: string) => readFileSync(join(root, relativePath), "utf8");

describe("retail readiness source evidence", () => {
  it("documents generator empty states and unavailable export actions before generation", () => {
    const generator = read("client/src/pages/Generator.tsx");

    expect(generator).toContain("Your generated asset will appear here.");
    expect(generator).toContain("Choose an AI platform, profession, industry, or business type");
    expect(generator).toContain("disabled={!result} onClick={() => result && copyToClipboard(result.content)");
    expect(generator).toContain("disabled={!result} onClick={() => result && exportToMarkdown(result.content, generatedTitle)}");
    expect(generator).toContain("disabled={!result} onClick={() => result && exportToPDF(result.content, generatedTitle, effectiveTargetPlatform)}");
    expect(generator).toContain("disabled={!result} onClick={() => result && exportClaudePluginZip");
    expect(generator).toContain("disabled={!result} onClick={saveToLocalLibrary}");
    expect(generator).toContain("disabled={!result || saveProduct.isPending} onClick={addToMarketplace}");
  });

  it("verifies pricing and marketplace paths include premium offers, loading, empty, auth, and checkout UX", () => {
    const pricing = read("client/src/pages/Pricing.tsx");
    const marketplace = read("client/src/pages/Marketplace.tsx");

    expect(pricing).toContain("Premium operating system");
    expect(pricing).toContain("Other / Custom Manual Category");
    expect(pricing).toContain("checkout.mutate");
    expect(pricing).toContain("Stripe Checkout opened in a new tab.");
    expect(pricing).toContain("Please sign in before checkout.");

    expect(marketplace).toContain("Loading marketplace data...");
    expect(marketplace).toContain("No completed purchases yet. Buy a product from the catalog to see it here.");
    expect(marketplace).toContain("Sign in to view purchase history and download-ready items.");
    expect(marketplace).toContain("window.open(data.checkoutUrl");
    expect(marketplace).toContain("downloadPurchaseInfo");
    expect(marketplace).toContain("Download summary");
    expect(marketplace).toContain("Purchase summary downloaded.");
    expect(marketplace).toContain("Test card:");
  });

  it("ensures checkout return routing lands on a dedicated status page with clear guidance", () => {
    const router = read("server/routers.ts");
    const success = read("client/src/pages/Success.tsx");

    expect(router).toContain("success_url: `${origin}/success?checkout=success&product=${encodeURIComponent(product.slug)}`");
    expect(router).toContain("cancel_url: `${origin}/success?checkout=cancelled&product=${encodeURIComponent(product.slug)}`");
    expect(success).toContain("Purchase received.");
    expect(success).toContain("Checkout was cancelled.");
    expect(success).toContain("Product reference:");
    expect(success).toContain("View purchases");
  });

  it("captures broader UX and performance-sensitive surfaces for final QA documentation", () => {
    const appShell = read("client/src/components/AppShell.tsx");
    const instructions = read("client/src/pages/Instructions.tsx");
    const home = read("client/src/pages/Home.tsx");
    const generator = read("client/src/pages/Generator.tsx");

    expect(appShell).toContain("/instructions");
    expect(instructions).toContain("How to use custom categories");
    expect(instructions).toContain("Quality checklist before exporting or selling");
    expect(home).toContain("Custom category generation");
    expect(home).toContain("Marketplace packaging");
    expect(home).toContain("container grid min-w-0");
    expect(home).toContain("w-full min-w-0 max-w-[calc(100vw-2rem)]");
    expect(home).toContain("w-full max-w-[calc(100vw-2rem)] text-[2.08rem]");
    expect(home).toContain("w-full rounded-full");

    expect(generator).toContain("Streamdown");
    expect(generator).toContain("print-area");
    expect(generator).toContain("createAsset.isPending");
    expect(generator).toContain("saveProduct.isPending");
  });
});
