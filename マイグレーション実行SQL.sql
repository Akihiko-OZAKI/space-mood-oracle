-- ============================================
-- マイグレーション: トレンド分析テーブル作成
-- 実行日: 2025-01-30
-- ============================================

-- 1. Googleトレンドデータテーブル
CREATE TABLE IF NOT EXISTS `google_trend_data` (
	`id` int AUTO_INCREMENT NOT NULL,
	`date` varchar(10) NOT NULL,
	`keyword` varchar(100) NOT NULL,
	`score` int,
	`region` varchar(10) DEFAULT 'JP',
	`category` varchar(50),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `google_trend_data_id` PRIMARY KEY(`id`)
);

-- 2. Twitterトレンドデータテーブル
CREATE TABLE IF NOT EXISTS `twitter_trend_data` (
	`id` int AUTO_INCREMENT NOT NULL,
	`date` varchar(10) NOT NULL,
	`keyword` varchar(100) NOT NULL,
	`tweet_volume` int,
	`sentiment_score` varchar(20),
	`region` varchar(10) DEFAULT 'JP',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `twitter_trend_data_id` PRIMARY KEY(`id`)
);

-- 3. 日次判定結果テーブル
CREATE TABLE IF NOT EXISTS `daily_mood_judgment` (
	`id` int AUTO_INCREMENT NOT NULL,
	`date` varchar(10) NOT NULL,
	`judgment` varchar(20) NOT NULL,
	`score` varchar(20) NOT NULL,
	`google_score` varchar(20),
	`twitter_score` varchar(20),
	`space_weather_score` varchar(20),
	`confidence` varchar(20),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `daily_mood_judgment_id` PRIMARY KEY(`id`),
	CONSTRAINT `daily_mood_judgment_date_unique` UNIQUE(`date`)
);

-- ============================================
-- 実行後の確認用SQL
-- ============================================
-- 以下のSQLでテーブルが作成されたことを確認できます:
--
-- SHOW TABLES LIKE '%trend%';
-- SHOW TABLES LIKE '%mood%';
--
-- DESCRIBE google_trend_data;
-- DESCRIBE twitter_trend_data;
-- DESCRIBE daily_mood_judgment;
-- ============================================

