CREATE TABLE `chatMessages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`message` text NOT NULL,
	`response` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chatMessages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ideaMedia` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ideaId` int NOT NULL,
	`mediaUrl` text NOT NULL,
	`mediaType` enum('image','video') NOT NULL,
	`fileKey` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ideaMedia_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ideas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`category` varchar(100) NOT NULL,
	`stage` enum('فكرة','نموذج أولي','مشروع قائم','Idea','Prototype','Live Project') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ideas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`userType` enum('idea','skill','investor') NOT NULL DEFAULT 'idea',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
