# データベース名統一: ローカルを `space_mood_oracle` に合わせる（代替案）

## 🎯 代替案: ローカルのデータベース名を `space_mood_oracle` に変更

もし `space_mood_oracle` という名前を使いたい場合、こちらの方法もあります。

**ただし、この方法は `test` データベースに既にテーブルがある場合、`space_mood_oracle` データベースにテーブルを作成する必要があります。**

---

## 📋 手順

### ステップ1: TiDB Cloudで `space_mood_oracle` データベースにテーブルを作成

1. TiDB Cloudコンソール → SQL Editor
2. 以下のSQLを実行：

```sql
USE space_mood_oracle;

-- 必要なテーブルを作成
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

CREATE TABLE IF NOT EXISTS `predictions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`date` varchar(10) NOT NULL,
	`predicted_score` varchar(20) NOT NULL,
	`confidence` varchar(20),
	`model_version` varchar(50) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `predictions_id` PRIMARY KEY(`id`)
);

CREATE TABLE IF NOT EXISTS `space_weather_data` (
	`id` int AUTO_INCREMENT NOT NULL,
	`date` varchar(10) NOT NULL,
	`kp_index_max` varchar(10),
	`x_class_flare_count` int NOT NULL DEFAULT 0,
	`m_class_flare_count` int NOT NULL DEFAULT 0,
	`solar_wind_speed` varchar(20),
	`proton_flux` varchar(20),
	`solar_radiation_scale` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `space_weather_data_id` PRIMARY KEY(`id`),
	CONSTRAINT `space_weather_data_date_unique` UNIQUE(`date`)
);

CREATE TABLE IF NOT EXISTS `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') DEFAULT 'user' NOT NULL,
	`createdAt` timestamp DEFAULT (now()) NOT NULL,
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP NOT NULL,
	`lastSignedIn` timestamp DEFAULT (now()) NOT NULL,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
```

3. テーブルが作成されたか確認：
```sql
SHOW TABLES;
```

---

### ステップ2: ローカルの `.env` ファイルを更新

1. `H:\AI_study\228_宇宙パワー_V1\space_mood_oracle_v3\.env` を開く
2. `DATABASE_URL` を以下に変更：
   ```
   DATABASE_URL=mysql://LgmGciWwK5YKo7Q.root:xxxxx@gateway01.ap-northeast-1.prod.aws.tidbcloud.com:4000/space_mood_oracle?ssl-mode=REQUIRED
   ```
   （`/test` を `/space_mood_oracle` に変更）

3. ファイルを保存

---

### ステップ3: ローカル環境で動作確認

1. ローカルサーバーを再起動
2. 動作を確認

---

## ⚠️ 注意事項

- この方法では、`test` データベースのデータと `space_mood_oracle` データベースのデータは別々になります
- `test` データベースに既存データがある場合、`space_mood_oracle` にはデータがありません
- 必要に応じて、データを移行する必要があります

---

**推奨: Renderを `test` に合わせる方が簡単です！** 🎯

