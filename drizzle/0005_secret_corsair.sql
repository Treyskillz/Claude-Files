ALTER TABLE `marketplaceProducts` ADD `listingStatus` enum('draft','pending_review','approved','rejected') DEFAULT 'approved' NOT NULL;--> statement-breakpoint
ALTER TABLE `marketplaceProducts` ADD `rejectionReason` text;--> statement-breakpoint
ALTER TABLE `marketplaceProducts` ADD `reviewedById` int;--> statement-breakpoint
ALTER TABLE `marketplaceProducts` ADD `reviewedAt` timestamp;--> statement-breakpoint
ALTER TABLE `marketplaceProducts` ADD `payoutMode` enum('platform_owned','connect_destination') DEFAULT 'platform_owned' NOT NULL;--> statement-breakpoint
ALTER TABLE `marketplaceProducts` ADD `sellerStripeAccountId` varchar(128);--> statement-breakpoint
ALTER TABLE `marketplaceProducts` ADD `platformFeeBps` int DEFAULT 2000 NOT NULL;--> statement-breakpoint
ALTER TABLE `purchases` ADD `sellerId` int;--> statement-breakpoint
ALTER TABLE `purchases` ADD `sellerStripeAccountId` varchar(128);--> statement-breakpoint
ALTER TABLE `purchases` ADD `grossAmountCents` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `purchases` ADD `sellerShareCents` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `purchases` ADD `platformFeeCents` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `purchases` ADD `stripeTransferId` varchar(255);--> statement-breakpoint
ALTER TABLE `purchases` ADD `payoutStatus` enum('not_applicable','pending','paid','failed') DEFAULT 'not_applicable' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `stripeConnectAccountId` varchar(128);--> statement-breakpoint
ALTER TABLE `users` ADD `stripeConnectOnboardingStatus` enum('not_started','pending','complete') DEFAULT 'not_started' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `stripeConnectChargesEnabled` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `stripeConnectPayoutsEnabled` int DEFAULT 0 NOT NULL;