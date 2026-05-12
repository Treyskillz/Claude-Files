import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { calculatePayoutSplit, isAdminUser, toCsv } from "./routers";

const projectFile = (relativePath: string) => readFileSync(join(process.cwd(), relativePath), "utf8");

describe("marketplace payout split helpers", () => {
  it("assigns a platform fee and seller share for Connect destination-charge listings", () => {
    const result = calculatePayoutSplit({
      priceCents: 10_000,
      payoutMode: "connect_destination",
      platformFeeBps: 2_000,
    });

    expect(result).toEqual({
      platformFeeBps: 2_000,
      platformFeeCents: 2_000,
      sellerShareCents: 8_000,
      payoutStatus: "pending",
    });
  });

  it("keeps platform-owned sales fully attributable to the app owner", () => {
    const result = calculatePayoutSplit({
      priceCents: 4_900,
      payoutMode: "platform_owned",
      platformFeeBps: 2_000,
    });

    expect(result.platformFeeBps).toBe(10_000);
    expect(result.platformFeeCents).toBe(4_900);
    expect(result.sellerShareCents).toBe(0);
    expect(result.payoutStatus).toBe("not_applicable");
  });

  it("uses the default platform fee for Connect listings when none is stored", () => {
    const result = calculatePayoutSplit({
      priceCents: 5_000,
      payoutMode: "connect_destination",
      platformFeeBps: null,
    });

    expect(result.platformFeeBps).toBe(2_000);
    expect(result.platformFeeCents).toBe(1_000);
    expect(result.sellerShareCents).toBe(4_000);
  });
});

describe("Stripe Connect seller onboarding and listing moderation flow", () => {
  it("creates an Express connected account and hosted onboarding account link", () => {
    const routerSource = projectFile("server/routers.ts");

    expect(routerSource).toContain("startSellerOnboarding");
    expect(routerSource).toContain("stripe.accounts.create");
    expect(routerSource).toContain('type: "express"');
    expect(routerSource).toContain("stripe.accountLinks.create");
    expect(routerSource).toContain('refresh_url: `${origin}/marketplace?seller_onboarding=refresh`');
    expect(routerSource).toContain('return_url: `${origin}/marketplace?seller_onboarding=complete`');
    expect(routerSource).toContain('type: "account_onboarding"');
  });

  it("submits customer seller listings as pending Connect destination-charge listings for admin review", () => {
    const routerSource = projectFile("server/routers.ts");
    const marketplaceSource = projectFile("client/src/pages/Marketplace.tsx");
    const adminDashboardSource = projectFile("client/src/pages/AdminDashboard.tsx");

    expect(routerSource).toContain('listingStatus: admin ? "approved" : "pending_review"');
    expect(routerSource).toContain('payoutMode: admin ? "platform_owned" : "connect_destination"');
    expect(routerSource).toContain("reviewListing");
    expect(routerSource).toContain("Seller Stripe Connect onboarding must be complete before this listing can be approved.");
    expect(marketplaceSource).toContain("const submitListing = trpc.marketplace.saveProduct.useMutation");
    expect(marketplaceSource).toContain("Stripe Connect seller onboarding");
    expect(adminDashboardSource).toContain("customer-submitted listings are awaiting review");
    expect(adminDashboardSource).toContain("reviewListing");
  });
});

describe("admin sales and payout export helpers", () => {
  it("creates escaped CSV output for report rows", () => {
    const csv = toCsv([
      {
        purchase_id: 101,
        product_title: "Prompt Pack, Pro",
        seller_email: "seller@example.com",
        note: "Includes \"quoted\" listing copy",
      },
    ]);

    expect(csv).toBe('"purchase_id","product_title","seller_email","note"\n"101","Prompt Pack, Pro","seller@example.com","Includes ""quoted"" listing copy"');
  });

  it("returns an empty string when there are no rows to export", () => {
    expect(toCsv([])).toBe("");
  });
});

describe("admin marketplace access detection", () => {
  it("recognizes explicit admin users", () => {
    expect(isAdminUser({ role: "admin", openId: "customer-open-id" })).toBe(true);
  });

  it("recognizes the app owner by owner open id", () => {
    const previousOwnerOpenId = process.env.OWNER_OPEN_ID;
    process.env.OWNER_OPEN_ID = "owner-open-id";

    try {
      expect(isAdminUser({ role: "user", openId: "owner-open-id" })).toBe(true);
    } finally {
      if (previousOwnerOpenId === undefined) {
        delete process.env.OWNER_OPEN_ID;
      } else {
        process.env.OWNER_OPEN_ID = previousOwnerOpenId;
      }
    }
  });
});
