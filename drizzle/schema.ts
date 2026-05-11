import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  stripeCustomerId: varchar("stripeCustomerId", { length: 128 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const generatedAssets = mysqlTable("generatedAssets", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  title: varchar("title", { length: 220 }).notNull(),
  assetType: mysqlEnum("assetType", ["master_os", "skill", "prompt", "workflow", "bundle", "resource"]).notNull(),
  source: mysqlEnum("source", ["autonomous", "assisted", "uploaded", "official_reference"]).default("autonomous").notNull(),
  summary: text("summary"),
  content: text("content"),
  manifestJson: text("manifestJson"),
  licenseTerms: text("licenseTerms"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const marketplaceProducts = mysqlTable("marketplaceProducts", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("ownerId"),
  title: varchar("title", { length: 220 }).notNull(),
  slug: varchar("slug", { length: 220 }).notNull().unique(),
  category: varchar("category", { length: 120 }).notNull(),
  packageType: mysqlEnum("packageType", ["individual", "bundle", "one_time_app", "subscription_monthly", "subscription_annual"]).default("individual").notNull(),
  priceCents: int("priceCents").default(2900).notNull(),
  description: text("description"),
  includedFilesJson: text("includedFilesJson"),
  licenseTerms: text("licenseTerms"),
  stripeProductId: varchar("stripeProductId", { length: 128 }),
  stripePriceId: varchar("stripePriceId", { length: 128 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const purchases = mysqlTable("purchases", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  productSlug: varchar("productSlug", { length: 220 }).notNull(),
  productTitle: varchar("productTitle", { length: 220 }).notNull(),
  packageType: mysqlEnum("packageType", ["individual", "bundle", "one_time_app", "subscription_monthly", "subscription_annual"]).default("individual").notNull(),
  stripeCheckoutSessionId: varchar("stripeCheckoutSessionId", { length: 255 }).notNull().unique(),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  fulfillmentStatus: mysqlEnum("fulfillmentStatus", ["pending", "ready", "fulfilled", "refunded"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type GeneratedAsset = typeof generatedAssets.$inferSelect;
export type InsertGeneratedAsset = typeof generatedAssets.$inferInsert;
export type MarketplaceProduct = typeof marketplaceProducts.$inferSelect;
export type InsertMarketplaceProduct = typeof marketplaceProducts.$inferInsert;
export type Purchase = typeof purchases.$inferSelect;
export type InsertPurchase = typeof purchases.$inferInsert;
