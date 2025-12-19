# 実行: testデータベースにテーブル作成SQL

## 📋 手順

### 1. TiDB CloudのSQL Editorを開く

1. **TiDB Cloudダッシュボード**にアクセス
   - https://tidbcloud.com/

2. **SQL Editor**を開く

3. **データベースを選択**
   - ドロップダウンで `test` を選択
   - または、SQLで `USE test;` を実行

---

### 2. 以下のSQLを順番に実行

#### ステップ1: 基本テーブルを作成

```sql
USE test;

-- users テーブル
CREATE TABLE IF NOT EXISTS `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);

-- daily_sentiment_scores テーブル
CREATE TABLE IF NOT EXISTS `daily_sentiment_scores` (
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

-- predictions テーブル
CREATE TABLE IF NOT EXISTS `predictions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`date` varchar(10) NOT NULL,
	`predicted_score` varchar(20) NOT NULL,
	`confidence` varchar(20),
	`model_version` varchar(50) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `predictions_id` PRIMARY KEY(`id`)
);

-- space_weather_data テーブル（重要！）
CREATE TABLE IF NOT EXISTS `space_weather_data` (
	`id` int AUTO_INCREMENT NOT NULL,
	`date` varchar(10) NOT NULL,
	`kp_index_max` varchar(10),
	`x_class_flare_count` int NOT NULL DEFAULT 0,
	`m_class_flare_count` int NOT NULL DEFAULT 0,
	`solar_wind_speed` varchar(20),
	`proton_flux` varchar(20),
	`solar_radiation_scale` int DEFAULT 0 NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `space_weather_data_id` PRIMARY KEY(`id`),
	CONSTRAINT `space_weather_data_date_unique` UNIQUE(`date`)
);

-- tweets テーブル
CREATE TABLE IF NOT EXISTS `tweets` (
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
```

---

### 3. テーブルが作成されたか確認

```sql
USE test;
SHOW TABLES;
```

以下のテーブルが表示されるはずです：
- `users`
- `daily_sentiment_scores`
- `predictions`
- `space_weather_data` ← **これが重要！**
- `tweets`

---

### 4. 確認後、再度「実データ取得」を実行

1. **Vercelの `/lab` ページ**にアクセス
   - https://space-mood-oracle.vercel.app/lab

2. **「実データ取得（NOAA）」ボタンをクリック**

3. **RenderのLogsタブで確認**
   - `[Database] ⭐ space_weather_data exists? true` と表示されるはずです

---

## ✅ 完了チェック

- [ ] TiDB Cloudで `USE test; SHOW TABLES;` を実行
- [ ] 上記のSQLでテーブルを作成
- [ ] `SHOW TABLES;` で `space_weather_data` が表示されることを確認
- [ ] Vercelの `/lab` から「実データ取得」を実行
- [ ] RenderのLogsタブで `space_weather_data exists? true` を確認

---

**まず、TiDB Cloudで上記のSQLを実行してください！** 🚀


