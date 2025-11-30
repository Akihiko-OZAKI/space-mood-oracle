-- ============================================
-- データベース作成 + テーブル作成（一括実行）
-- このファイルを一度に実行すると、データベースとテーブルが全て作成されます
-- ============================================

-- ============================================
-- ステップ1: データベースを作成
-- ============================================
CREATE DATABASE IF NOT EXISTS space_mood_oracle 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_general_ci;

-- データベースを選択
USE space_mood_oracle;

-- ============================================
-- ステップ2: 既存のテーブルを作成（既に存在する場合はスキップ）
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
-- 実行完了！
-- ============================================

-- 確認用SQL（コメントアウトを外して実行すると確認できます）
-- SHOW TABLES;
-- DESCRIBE google_trend_data;
-- DESCRIBE twitter_trend_data;
-- DESCRIBE daily_mood_judgment;

