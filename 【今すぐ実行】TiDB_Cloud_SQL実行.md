# 🚀 今すぐ実行！TiDB CloudでSQL実行

## 📋 状況

✅ **cluster0 が既に作成されている**

プランを選択する前に、データベースとテーブルを作成できます！

---

## 🎯 手順（約2分）

### ステップ1: cluster0 を開く

1. TiDB Cloudダッシュボードで **cluster0** をクリック
2. クラスターの詳細ページを開く

### ステップ2: SQL Editor を開く

1. 上部のタブから **「SQL Editor」** または **「Chat2Query」** をクリック
2. SQL Editorが開きます

### ステップ3: SQLを実行

1. `【今すぐ実行】DB作成.sql` ファイルを開く
2. **ファイル全体をコピー**（Ctrl+A → Ctrl+C）
3. SQL Editorにペースト（Ctrl+V）
4. **「Run」** または **「Execute」** ボタンをクリック

### ステップ4: 確認

1. エラーが出なければ成功 ✅
2. 確認用SQLを実行:

```sql
USE space_mood_oracle;
SHOW TABLES;
```

3. 以下の3つのテーブルが表示されればOK ✅:
   - `google_trend_data`
   - `twitter_trend_data`
   - `daily_mood_judgment`

---

## 📝 実行するSQL（コピー用）

```sql
-- データベースを作成
CREATE DATABASE IF NOT EXISTS space_mood_oracle 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_general_ci;

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
```

---

## ✅ 実行後

SQL実行が成功したら:

1. ✅ データベース `space_mood_oracle` が作成される
2. ✅ 3つのテーブルが作成される
3. ✅ 接続情報を取得して、`.env` ファイルに設定

---

## 🔗 次のステップ

1. ✅ SQL実行完了
2. ✅ 接続情報を取得（「Connect」タブ）
3. ✅ `.env` ファイルに設定
4. ✅ Renderでデプロイ

---

**さあ、SQLを実行しましょう！** 🚀


