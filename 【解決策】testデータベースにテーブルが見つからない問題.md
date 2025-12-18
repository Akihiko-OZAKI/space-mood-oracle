# 解決策: testデータベースにテーブルが見つからない問題

## 🔴 エラー内容

```
Error: Table 'test.space_weather_data' doesn't exist
```

TiDB Cloudではテーブルが存在するのに、Renderからは見えていません。

---

## 🔍 考えられる原因

### 原因1: データベース接続先が異なる

TiDB Cloudで確認したデータベースと、Renderから接続しているデータベースが異なる可能性があります。

**確認方法:**
1. Renderのログで、データベース接続時のログを確認
2. `[Database] Initializing MySQL pool with TLS to mysql://...:4000/test` が表示されているか確認

---

### 原因2: データベース名が実際には違う

`DATABASE_URL` では `/test` になっていても、実際には異なるデータベースに接続している可能性があります。

---

## 🔧 解決方法

### ステップ1: Renderのログでデータベース名を確認

RenderのLogsタブで、以下のログを探してください：

```
[Database] Initializing MySQL pool with TLS to mysql://gateway01.ap-northeast-1.prod.aws.tidbcloud.com:4000/???
```

**`???` の部分が実際のデータベース名です。**
- `/test` になっているはずですが、確認してください

---

### ステップ2: TiDB Cloudで test データベースを確認

TiDB CloudのSQL Editorで、以下を実行：

```sql
USE test;
SHOW TABLES;
```

**確認すべきこと:**
- テーブルが実際に存在するか
- データベース名が `test` であること

---

### ステップ3: データベース接続の詳細を確認

TiDB Cloudで、以下のクエリを実行して、データベースの一覧を確認：

```sql
SHOW DATABASES;
```

**確認すべきこと:**
- `test` データベースが存在するか
- 他に `space_mood_oracle` などのデータベースが存在するか

---

### ステップ4: テーブルを再作成（必要に応じて）

もし `test` データベースにテーブルが存在しない場合、テーブルを作成する必要があります。

**手順:**
1. TiDB CloudのSQL Editorで以下を実行：

```sql
USE test;

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
```

2. 他のテーブルも同様に作成

---

## 📋 チェックリスト

- [ ] Renderのログで、データベース名が `/test` になっているか確認
- [ ] TiDB Cloudで `USE test; SHOW TABLES;` を実行して、テーブルが存在するか確認
- [ ] `SHOW DATABASES;` を実行して、`test` データベースが存在するか確認
- [ ] テーブルが存在しない場合は、テーブルを作成

---

**まず、Renderのログで `[Database] Initializing MySQL pool with TLS to mysql://...:4000/???` の行を確認して、データベース名が `/test` になっているか確認してください！** 🔍

