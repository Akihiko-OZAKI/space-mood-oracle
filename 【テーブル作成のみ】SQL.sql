-- ============================================
-- 🚀 テーブル作成SQL（データベース作成済みの場合）
-- ============================================
-- 
-- データベース space_mood_oracle が既に作成されている場合、
-- 以下のSQLだけを実行してください
--
-- ============================================

-- データベースを選択
USE space_mood_oracle;

-- Googleトレンドデータテーブル
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

-- Twitterトレンドデータテーブル
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

-- 日次判定結果テーブル
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
-- ✅ 実行完了！
-- ============================================
-- 
-- 確認用SQL:
-- USE space_mood_oracle;
-- SHOW TABLES;
-- 
-- 期待される結果:
-- google_trend_data
-- twitter_trend_data  
-- daily_mood_judgment
--
-- ============================================


