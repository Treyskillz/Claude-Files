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
    expect(account).toContain("Admin workspace active");
    expect(shell).toContain("Admin access enabled");
  });
});
