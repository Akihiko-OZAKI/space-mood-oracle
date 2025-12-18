# テーブル確認: TiDB Cloudでテーブルの存在を確認

## 🔍 状況

- データベース接続は成功している（`[Database] Connection object created successfully.`）
- Renderのログにはエラーがない
- しかし、フロントエンド側でデータベースクエリエラーが発生している

**考えられる原因:** テーブルが存在しない可能性が高い

---

## 📋 確認手順

### ステップ1: TiDB Cloudコンソールにアクセス

1. https://tidbcloud.com にアクセス
2. ログイン
3. クラスターを選択

---

### ステップ2: SQL Editorを開く

1. 左サイドバーの **「SQL Editor」** をクリック
2. SQL Editorが開く

---

### ステップ3: テーブルの存在を確認

以下のSQLを実行して、テーブルが存在するか確認してください：

```sql
SHOW TABLES;
```

**期待される結果:**
以下のテーブルが表示されるべきです：
- `daily_sentiment_scores`
- `predictions`
- `space_weather_data`
- `users`
- （その他のテーブル）

---

### ステップ4: テーブルが存在しない場合

もしテーブルが存在しない場合、以下のSQLスクリプトを実行してテーブルを作成してください：

#### 必要なテーブル1: `daily_sentiment_scores`

```sql
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
```

#### 必要なテーブル2: `predictions`

```sql
CREATE TABLE `predictions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`date` varchar(10) NOT NULL,
	`predicted_score` varchar(20) NOT NULL,
	`confidence` varchar(20),
	`model_version` varchar(50) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `predictions_id` PRIMARY KEY(`id`)
);
```

#### 必要なテーブル3: `space_weather_data`

```sql
CREATE TABLE `space_weather_data` (
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
```

#### 必要なテーブル4: `users`（認証用）

```sql
CREATE TABLE `users` (
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

---

## 🎯 確認後の次のステップ

### テーブルが存在する場合

1. テーブル構造を確認
2. データが存在するか確認（テーブルが空でもエラーにはならないはずですが、確認はしておきましょう）

### テーブルが存在しない場合

1. 上記のSQLスクリプトを実行してテーブルを作成
2. 公開UIを再度アクセスして、エラーが解消されたか確認

---

## 📝 注意事項

- データベース名が `space_mood_oracle` であることを確認してください（`USE space_mood_oracle;` を実行してからテーブルを作成）
- テーブルを作成した後、Renderのアプリを再起動する必要はありません（接続プールが自動的に新しいテーブルを認識します）

---

**まず、TiDB CloudのSQL Editorで `SHOW TABLES;` を実行して、テーブルが存在するか確認してください！** 🔍

