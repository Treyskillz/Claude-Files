import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { buildAdminCheckoutBypass, isAdminUser } from "./routers";
import type { TrpcContext } from "./_core/context";

const readProjectFile = (relativePath: string) => readFileSync(join(process.cwd(), relativePath), "utf8");

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createContext(user: AuthenticatedUser | null): TrpcContext {
  return {
    user,
    req: {
      protocol: "https",
      headers: { origin: "https://skillzmagic.example" },
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

const userBase = {
  id: 1,
  openId: "customer-open-id",
  email: "customer@example.com",
  name: "Customer User",
  loginMethod: "manus",
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
} satisfies Omit<AuthenticatedUser, "role">;

describe("admin free access", () => {
  it("identifies explicit admins and the project owner as admin users", () => {
    const originalOwnerOpenId = process.env.OWNER_OPEN_ID;
    process.env.OWNER_OPEN_ID = "owner-open-id";

    expect(isAdminUser({ role: "admin", openId: "someone-else" })).toBe(true);
    expect(isAdminUser({ role: "user", openId: "owner-open-id" })).toBe(true);
    expect(isAdminUser({ role: "user", openId: "customer-open-id" })).toBe(false);
    expect(isAdminUser(null)).toBe(false);

    if (originalOwnerOpenId === undefined) {
      delete process.env.OWNER_OPEN_ID;
    } else {
      process.env.OWNER_OPEN_ID = originalOwnerOpenId;
    }
  });

  it("builds a free admin checkout response without Stripe session identifiers", () => {
    const bypass = buildAdminCheckoutBypass({
      slug: "pro-monthly",
      title: "Pro Monthly",
      description: "Recurring creator access",
      packageType: "subscription_monthly",
      priceCents: 2900,
    });

    expect(bypass).toMatchObject({
      checkoutUrl: null,
      sessionId: null,
      adminFreeAccess: true,
      productSlug: "pro-monthly",
      productTitle: "Pro Monthly",
      packageType: "subscription_monthly",
    });
    expect(bypass.message).toContain("No Stripe checkout or purchase record is required");
  });

  it("returns admin checkout bypass only for admin callers while non-admin callers continue to the paid path", async () => {
    const originalStripeKey = process.env.STRIPE_SECRET_KEY;
    delete process.env.STRIPE_SECRET_KEY;
    vi.resetModules();

    try {
      const { appRouter } = await import("./routers");
      const adminCaller = appRouter.createCaller(createContext({ ...userBase, id: 2, openId: "admin-open-id", role: "admin" }));
      const customerCaller = appRouter.createCaller(createContext({ ...userBase, id: 3, role: "user" }));

      await expect(adminCaller.marketplace.checkout({ slug: "pro-monthly" })).resolves.toMatchObject({
        adminFreeAccess: true,
        checkoutUrl: null,
        sessionId: null,
      });

      await expect(customerCaller.marketplace.checkout({ slug: "pro-monthly" })).rejects.toThrow("Stripe is not configured");
    } finally {
      if (originalStripeKey === undefined) {
        delete process.env.STRIPE_SECRET_KEY;
      } else {
        process.env.STRIPE_SECRET_KEY = originalStripeKey;
      }
      vi.resetModules();
    }
  });

  it("rejects unauthenticated access to protected marketplace routes", async () => {
    const { appRouter } = await import("./routers");
    const anonymousCaller = appRouter.createCaller(createContext(null));

    await expect(anonymousCaller.marketplace.purchases()).rejects.toThrow("Please login");
    await expect(anonymousCaller.marketplace.checkout({ slug: "pro-monthly" })).rejects.toThrow("Please login");
  });

  it("keeps customer checkout copy while exposing admin-only download controls", () => {
    const marketplace = readProjectFile("client/src/pages/Marketplace.tsx");
    const pricing = readProjectFile("client/src/pages/Pricing.tsx");
    const generator = readProjectFile("client/src/pages/Generator.tsx");
    const account = readProjectFile("client/src/pages/Account.tsx");
    const shell = readProjectFile("client/src/components/AppShell.tsx");

    expect(marketplace).toContain("Admin marketplace access: download package files without opening Stripe checkout.");
    expect(marketplace).toContain("Admin included");
    expect(marketplace).toContain("Buy now");
    expect(marketplace).toContain("onAdminDownload");
    expect(marketplace).toContain("Confirm admin access");
    expect(marketplace).toContain("Buy now");

    expect(pricing).toContain("Owner/admin pricing access is included");
    expect(pricing).toContain("Customer pricing and Stripe checkout remain active for non-admin accounts");
    expect(pricing).toContain("plan.cta");

      expect(generator).toContain("Admin exports unlocked");
      expect(generator).toContain("Markdown, PDF, and Platform ZIP downloads do not require payment");
      expect(generator).toContain("Publish package");
      expect(generator).toContain("trpc.admin.publishGeneratedAsset.useMutation");
      expect(account).toContain("Admin workspace active");
      expect(shell).toContain("Admin access enabled");
      expect(shell).toContain("isAdmin ?");
      expect(shell).toContain("/admin");
  });

  it("protects admin dashboard and one-click publish procedures from customer and anonymous callers", async () => {
    const originalStripeKey = process.env.STRIPE_SECRET_KEY;
    delete process.env.STRIPE_SECRET_KEY;
    vi.resetModules();

    try {
      const { appRouter } = await import("./routers");
      const anonymousCaller = appRouter.createCaller(createContext(null));
      const customerCaller = appRouter.createCaller(createContext({ ...userBase, id: 4, role: "user" }));
      const adminCaller = appRouter.createCaller(createContext({ ...userBase, id: 5, openId: "admin-open-id", role: "admin" }));

      await expect(anonymousCaller.admin.dashboard()).rejects.toThrow("Please login");
      await expect(customerCaller.admin.dashboard()).rejects.toThrow("reserved for the project owner/admin account");
      await expect(customerCaller.admin.publishGeneratedAsset({ title: "Customer Asset", assetType: "skill", content: "Blocked customer publish content with enough length", summary: "Blocked", priceCents: 1900, packageType: "individual" })).rejects.toThrow("reserved for the project owner/admin account");

      await expect(adminCaller.admin.dashboard()).resolves.toMatchObject({
        payoutGuidance: expect.objectContaining({
          currentStatus: expect.stringContaining("Stripe Connect destination charges"),
          requiredNextStep: expect.stringContaining("moderation queue"),
        }),
      });
    } finally {
      if (originalStripeKey === undefined) {
        delete process.env.STRIPE_SECRET_KEY;
      } else {
        process.env.STRIPE_SECRET_KEY = originalStripeKey;
      }
      vi.resetModules();
    }
  });

  it("documents marketplace payout limits and renders source-backed admin dashboard sections", () => {
    const marketplace = readProjectFile("client/src/pages/Marketplace.tsx");
    const adminDashboard = readProjectFile("client/src/pages/AdminDashboard.tsx");
    const app = readProjectFile("client/src/App.tsx");
    const shell = readProjectFile("client/src/components/AppShell.tsx");

    expect(marketplace).toContain("Seller payout status");
    expect(marketplace).toContain("Approved Connect listings are prepared for destination-charge payout routing");
    expect(marketplace).toContain("Stripe Connect seller onboarding");
    expect(adminDashboard).toContain("This page is visible only to owner/admin accounts");
    expect(adminDashboard).toContain("Saved listings");
    expect(adminDashboard).toContain("Recent purchases");
    expect(adminDashboard).toContain("Builder assets");
    expect(adminDashboard).toContain("Recent saved marketplace listings");
    expect(adminDashboard).toContain("Recent purchase records");
    expect(adminDashboard).toContain("Recent Builder assets");
    expect(adminDashboard).toContain("Customer accounts cannot view dashboard data or publish marketplace packages by typing the URL");
    expect(adminDashboard).toContain("One-click publish workflow");
    expect(app).toContain("/admin");
    expect(shell).toContain("isAdmin ?");
    expect(shell).toContain("Admin dashboard");
  });

  it("successfully publishes an admin-generated package with derived marketplace metadata", async () => {
    const upsertMarketplaceProduct = vi.fn(async input => ({
      id: 77,
      ...input,
      createdAt: new Date("2026-05-11T00:00:00.000Z"),
      updatedAt: new Date("2026-05-11T00:00:00.000Z"),
    }));

    vi.resetModules();
    vi.doMock("./db", () => ({
      createPurchaseRecord: vi.fn(),
      listGeneratedAssets: vi.fn(async () => []),
      listMarketplaceProducts: vi.fn(async () => []),
      listRecentPurchases: vi.fn(async () => []),
      listUserPurchases: vi.fn(async () => []),
      saveGeneratedAsset: vi.fn(),
      upsertMarketplaceProduct,
    }));

    try {
      const { appRouter } = await import("./routers");
      const adminCaller = appRouter.createCaller(createContext({ ...userBase, id: 9, openId: "admin-open-id", role: "admin" }));

      const result = await adminCaller.admin.publishGeneratedAsset({
        title: "Healthcare Intake Automation Skill",
        assetType: "skill",
        content: "# Healthcare Intake Automation Skill\n\nThis generated package content is long enough to represent a real Builder output.",
        summary: "A ready-to-sell intake automation skill package.",
        priceCents: 4900,
        packageType: "individual",
      });

      expect(result).toMatchObject({
        published: true,
        product: expect.objectContaining({
          ownerId: 9,
          title: "Healthcare Intake Automation Skill",
          category: "Claude Skills",
          packageType: "individual",
          priceCents: 4900,
          description: "A ready-to-sell intake automation skill package.",
        }),
        includedFiles: expect.arrayContaining([
          "healthcare-intake-automation-skill/SKILL.md",
          "healthcare-intake-automation-skill/usage-guide.md",
          "healthcare-intake-automation-skill/license.md",
        ]),
      });
      expect(upsertMarketplaceProduct).toHaveBeenCalledWith(expect.objectContaining({
        ownerId: 9,
        title: "Healthcare Intake Automation Skill",
        category: "Claude Skills",
        includedFilesJson: expect.stringContaining("SKILL.md"),
      }));
      expect(result.message).toContain("Customer checkout remains paid unless the viewer is an admin");
    } finally {
      vi.doUnmock("./db");
      vi.resetModules();
    }
  });
});
