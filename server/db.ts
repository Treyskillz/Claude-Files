import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  generatedAssets,
  InsertGeneratedAsset,
  InsertMarketplaceProduct,
  InsertPurchase,
  InsertUser,
  marketplaceProducts,
  purchases,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod", "stripeCustomerId", "stripeConnectAccountId"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.stripeConnectOnboardingStatus !== undefined) {
      values.stripeConnectOnboardingStatus = user.stripeConnectOnboardingStatus;
      updateSet.stripeConnectOnboardingStatus = user.stripeConnectOnboardingStatus;
    }
    if (user.stripeConnectChargesEnabled !== undefined) {
      values.stripeConnectChargesEnabled = user.stripeConnectChargesEnabled;
      updateSet.stripeConnectChargesEnabled = user.stripeConnectChargesEnabled;
    }
    if (user.stripeConnectPayoutsEnabled !== undefined) {
      values.stripeConnectPayoutsEnabled = user.stripeConnectPayoutsEnabled;
      updateSet.stripeConnectPayoutsEnabled = user.stripeConnectPayoutsEnabled;
    }
    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();

    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateUserStripeConnectStatus(
  userId: number,
  details: {
    stripeConnectAccountId?: string | null;
    stripeConnectOnboardingStatus?: "not_started" | "pending" | "complete";
    stripeConnectChargesEnabled?: number;
    stripeConnectPayoutsEnabled?: number;
  },
) {
  const db = await getDb();
  if (!db) return undefined;
  await db.update(users).set(details).where(eq(users.id, userId));
  return getUserById(userId);
}

export async function saveGeneratedAsset(asset: InsertGeneratedAsset) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(generatedAssets).values(asset).$returningId();
  return result[0];
}

export async function listGeneratedAssets(userId?: number) {
  const db = await getDb();
  if (!db) return [];
  if (userId) {
    return db.select().from(generatedAssets).where(eq(generatedAssets.userId, userId)).orderBy(desc(generatedAssets.createdAt)).limit(50);
  }
  return db.select().from(generatedAssets).orderBy(desc(generatedAssets.createdAt)).limit(25);
}

export async function upsertMarketplaceProduct(product: InsertMarketplaceProduct) {
  const db = await getDb();
  if (!db) return undefined;
  await db.insert(marketplaceProducts).values(product).onDuplicateKeyUpdate({
    set: {
      title: product.title,
      category: product.category,
      packageType: product.packageType,
      priceCents: product.priceCents,
      description: product.description,
      includedFilesJson: product.includedFilesJson,
      licenseTerms: product.licenseTerms,
      stripeProductId: product.stripeProductId,
      stripePriceId: product.stripePriceId,
      listingStatus: product.listingStatus,
      rejectionReason: product.rejectionReason,
      reviewedById: product.reviewedById,
      reviewedAt: product.reviewedAt,
      payoutMode: product.payoutMode,
      sellerStripeAccountId: product.sellerStripeAccountId,
      platformFeeBps: product.platformFeeBps,
    },
  });
  const rows = await db.select().from(marketplaceProducts).where(eq(marketplaceProducts.slug, product.slug)).limit(1);
  return rows[0];
}

export async function listMarketplaceProducts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(marketplaceProducts).orderBy(desc(marketplaceProducts.createdAt)).limit(100);
}

export async function listApprovedMarketplaceProducts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(marketplaceProducts).where(eq(marketplaceProducts.listingStatus, "approved")).orderBy(desc(marketplaceProducts.createdAt)).limit(100);
}

export async function listSellerMarketplaceProducts(ownerId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(marketplaceProducts).where(eq(marketplaceProducts.ownerId, ownerId)).orderBy(desc(marketplaceProducts.createdAt)).limit(50);
}

export async function getMarketplaceProductBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(marketplaceProducts).where(eq(marketplaceProducts.slug, slug)).limit(1);
  return rows[0];
}

export async function getMarketplaceProductById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(marketplaceProducts).where(eq(marketplaceProducts.id, id)).limit(1);
  return rows[0];
}

export async function reviewMarketplaceProduct(details: {
  id: number;
  status: "approved" | "rejected";
  reviewedById: number;
  rejectionReason?: string | null;
  sellerStripeAccountId?: string | null;
  payoutMode?: "platform_owned" | "connect_destination";
  platformFeeBps?: number;
}) {
  const db = await getDb();
  if (!db) return undefined;
  await db
    .update(marketplaceProducts)
    .set({
      listingStatus: details.status,
      reviewedById: details.reviewedById,
      reviewedAt: new Date(),
      rejectionReason: details.status === "rejected" ? details.rejectionReason ?? "Listing rejected by admin review." : null,
      sellerStripeAccountId: details.sellerStripeAccountId,
      payoutMode: details.payoutMode,
      platformFeeBps: details.platformFeeBps,
    })
    .where(eq(marketplaceProducts.id, details.id));
  return getMarketplaceProductById(details.id);
}

export async function createPurchaseRecord(purchase: InsertPurchase) {
  const db = await getDb();
  if (!db) return undefined;
  await db.insert(purchases).values(purchase).onDuplicateKeyUpdate({
    set: {
      productSlug: purchase.productSlug,
      productTitle: purchase.productTitle,
      packageType: purchase.packageType,
      stripeCustomerId: purchase.stripeCustomerId,
      stripePaymentIntentId: purchase.stripePaymentIntentId,
      stripeSubscriptionId: purchase.stripeSubscriptionId,
      sellerId: purchase.sellerId,
      sellerStripeAccountId: purchase.sellerStripeAccountId,
      grossAmountCents: purchase.grossAmountCents,
      sellerShareCents: purchase.sellerShareCents,
      platformFeeCents: purchase.platformFeeCents,
      stripeTransferId: purchase.stripeTransferId,
      payoutStatus: purchase.payoutStatus,
      fulfillmentStatus: purchase.fulfillmentStatus,
    },
  });
  const rows = await db
    .select()
    .from(purchases)
    .where(eq(purchases.stripeCheckoutSessionId, purchase.stripeCheckoutSessionId))
    .limit(1);
  return rows[0];
}

export async function markPurchaseReadyBySession(
  sessionId: string,
  details: { stripePaymentIntentId?: string | null; stripeCustomerId?: string | null },
) {
  const db = await getDb();
  if (!db) return;
  await db
    .update(purchases)
    .set({
      fulfillmentStatus: "ready",
      stripePaymentIntentId: details.stripePaymentIntentId ?? null,
      stripeCustomerId: details.stripeCustomerId ?? null,
    })
    .where(eq(purchases.stripeCheckoutSessionId, sessionId));
}

export async function markPurchaseFulfilled(details: {
  stripeCheckoutSessionId: string;
  stripeCustomerId?: string | null;
  stripePaymentIntentId?: string | null;
  stripeSubscriptionId?: string | null;
}) {
  const db = await getDb();
  if (!db) return;
  await db
    .update(purchases)
    .set({
      fulfillmentStatus: "ready",
      stripeCustomerId: details.stripeCustomerId ?? null,
      stripePaymentIntentId: details.stripePaymentIntentId ?? null,
      stripeSubscriptionId: details.stripeSubscriptionId ?? null,
    })
    .where(eq(purchases.stripeCheckoutSessionId, details.stripeCheckoutSessionId));
}

export async function listUserPurchases(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(purchases).where(eq(purchases.userId, userId)).orderBy(desc(purchases.createdAt)).limit(50);
}

export async function listRecentPurchases(limit = 100) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(purchases).orderBy(desc(purchases.createdAt)).limit(limit);
}
