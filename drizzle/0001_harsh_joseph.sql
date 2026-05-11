CREATE TABLE `generatedAssets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`title` varchar(220) NOT NULL,
	`assetType` enum('skill','prompt','workflow','bundle','resource') NOT NULL,
	`source` enum('autonomous','assisted','uploaded','official_reference') NOT NULL DEFAULT 'autonomous',
	`summary` text,
	`content` text,
	`manifestJson` text,
	`licenseTerms` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `generatedAssets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `marketplaceProducts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerId` int,
	`title` varchar(220) NOT NULL,
	`slug` varchar(220) NOT NULL,
	`category` varchar(120) NOT NULL,
	`packageType` enum('individual','bundle','subscription_monthly','subscription_annual') NOT NULL DEFAULT 'individual',
	`priceCents` int NOT NULL DEFAULT 2900,
	`description` text,
	`includedFilesJson` text,
	`licenseTerms` text,
	`stripeProductId` varchar(128),
	`stripePriceId` varchar(128),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `marketplaceProducts_id` PRIMARY KEY(`id`),
	CONSTRAINT `marketplaceProducts_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `purchases` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`productSlug` varchar(220) NOT NULL,
	`productTitle` varchar(220) NOT NULL,
	`packageType` enum('individual','bundle','subscription_monthly','subscription_annual') NOT NULL DEFAULT 'individual',
	`stripeCheckoutSessionId` varchar(255) NOT NULL,
	`stripePaymentIntentId` varchar(255),
	`stripeCustomerId` varchar(255),
	`fulfillmentStatus` enum('pending','ready','fulfilled','refunded') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `purchases_id` PRIMARY KEY(`id`),
	CONSTRAINT `purchases_stripeCheckoutSessionId_unique` UNIQUE(`stripeCheckoutSessionId`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `stripeCustomerId` varchar(128);