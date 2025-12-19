# 次回作業: Renderログ確認手順

## ✅ 完了したこと

- [x] 詳細ログ追加（`db.ts`, `realSpaceWeather.ts`）
- [x] Gitにコミット・プッシュ

---

## 🔄 次回やること

### 1. Renderの再デプロイ確認

1. **Renderダッシュボード**にアクセス
   - https://dashboard.render.com/
   - `space-mood-oracle` サービスを開く

2. **Eventsタブ**を確認
   - 最新のデプロイが **"Live"** になっているか確認
   - もしデプロイ中なら、完了するまで待つ

---

### 2. Renderログで⭐マーク付きログを確認

**Logsタブ**を開いて、以下を確認：

#### サーバー起動時（最新デプロイのログ）

以下のログが表示されているか確認：

```
[Database] Initializing MySQL pool with TLS to mysql://...
[Database] Database name: test
[Database] Host: gateway01.ap-northeast-1.prod.aws.tidbcloud.com
[Database] Port: 4000
[Database] User: ...
[Database] Connection object created successfully.
[Database] Database connection pool ready for: test
[Database] ⭐ Current database (from SELECT DATABASE()): test
[Database] ⭐ Available tables in database: ...
[Database] ⭐ Table count: X
[Database] ⭐ space_weather_data exists? true/false
```

**重要:** 
- `⭐ Current database` が **`test`** になっているか？
- `⭐ Available tables` に **`space_weather_data`** が含まれているか？
- `⭐ space_weather_data exists?` が **`true`** か？

---

### 3. ログが見つからない場合

#### 方法1: 検索機能を使う

RenderのLogsタブに検索ボックスがある場合、以下を検索：

```
⭐
```

または

```
Current database
```

#### 方法2: ログをスクロール

- 最新デプロイのログの**最初の方**（サーバー起動時）を見る
- `[Database] Initializing MySQL pool` の**後**のログを確認

---

### 4. エラーが発生した場合

「実データ取得」ボタンを押したときに、以下のログが表示されるか確認：

```
[SpaceWeather] saveRealDataToDatabase called with X items
[SpaceWeather] Database connection obtained, starting to save data
[SpaceWeather] ⭐ Starting table verification...
[SpaceWeather] ⭐ Current database: test
[SpaceWeather] ⭐ Available tables: ...
[SpaceWeather] ⭐ space_weather_data in tables? true/false
```

エラーが発生した場合は、エラーメッセージと上記のログを確認して、原因を特定します。

---

## 📊 確認すべきポイント

1. **データベース名が `test` になっているか？**
   - `[Database] ⭐ Current database` を確認

2. **テーブルが存在するか？**
   - `[Database] ⭐ space_weather_data exists?` を確認

3. **もし `false` なら、TiDB Cloudでテーブルが存在するか再確認**
   - TiDB Cloud → SQL Editor → `USE test;` → `SHOW TABLES;`

4. **もしテーブルが存在するのに `false` なら、接続先のデータベースが間違っている可能性**
   - Renderの `DATABASE_URL` 環境変数を確認

---

## 🎯 次のステップ

ログ確認後、エラーの原因が特定できたら：

1. テーブルが存在しない場合 → テーブルを作成
2. データベース名が間違っている場合 → `DATABASE_URL` を修正
3. その他の場合 → エラーメッセージに基づいて対応

---

**お疲れ様でした！次回は上記の手順でログを確認してください。** 🔍



