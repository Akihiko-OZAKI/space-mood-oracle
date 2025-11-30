CREATE TABLE `daily_sentiment_scores` (
	`id` int AUTO_INCREMENT NOT NULL,
	`date` varchar(10) NOT NULL,
	`score` varchar(20) NOT NULL,
	`tweet_count` int NOT NULL DEFAULT 0,
	`positive_count` int NOT NULL DEFAULT 0,
	`negative_count` int NOT NULL DEFAULT 0,
	`neutral_count` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `daily_sentiment_scores_id` PRIMARY KEY(`id`),
	CONSTRAINT `daily_sentiment_scores_date_unique` UNIQUE(`date`)
);
--> statement-breakpoint
CREATE TABLE `predictions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`date` varchar(10) NOT NULL,
	`predicted_score` varchar(20) NOT NULL,
	`confidence` varchar(20),
	`model_version` varchar(50) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `predictions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `space_weather_data` (
	`id` int AUTO_INCREMENT NOT NULL,
	`date` varchar(10) NOT NULL,
	`kp_index_max` varchar(10),
	`x_class_flare_count` int NOT NULL DEFAULT 0,
	`m_class_flare_count` int NOT NULL DEFAULT 0,
	`solar_wind_speed` varchar(20),
	`proton_flux` varchar(20),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `space_weather_data_id` PRIMARY KEY(`id`),
	CONSTRAINT `space_weather_data_date_unique` UNIQUE(`date`)
);
--> statement-breakpoint
CREATE TABLE `tweets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tweet_id` varchar(64) NOT NULL,
	`text` text NOT NULL,
	`lang` varchar(10),
	`sentiment_score` varchar(20),
	`createdAt` timestamp NOT NULL,
	`processedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `tweets_id` PRIMARY KEY(`id`),
	CONSTRAINT `tweets_tweet_id_unique` UNIQUE(`tweet_id`)
);
