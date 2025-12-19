# デプロイ後確認: SHOW TABLES結果の確認手順

## ✅ 完了したこと

- [x] `DATABASE_URL` から `?ssl-mode=REQUIRED` を削除
- [x] `SHOW TABLES` の結果処理を改善（生の結果も出力）
- [x] Gitにコミット・プッシュ
- [x] Renderで再デプロイ中

---

## 🔄 デプロイ完了後の確認手順

### 1. Renderのデプロイ完了を確認

1. **Renderダッシュボード** → `space-mood-oracle` サービス
2. **Eventsタブ**を確認
   - 最新のデプロイが **"Live"** になっているか確認
   - デプロイ中なら、完了するまで待つ

---

### 2. 再度「実データ取得」を実行

1. **Vercelの `/lab` ページ**にアクセス
   - https://space-mood-oracle.vercel.app/lab

2. **「実データ取得（NOAA）」ボタンをクリック**

---

### 3. RenderのLogsタブで確認

以下のログが表示されるはずです：

#### データベース接続時

```
[Database] Initializing MySQL pool with TLS to mysql://...4000/test
[Database] Database name: test
[Database] Host: gateway01.ap-northeast-1.prod.aws.tidbcloud.com
[Database] Port: 4000
[Database] User: ...
[Database] Connection object created successfully.
[Database] Database connection pool ready for: test
[Database] ⭐ Current database (from SELECT DATABASE()): test
[Database] ⭐ SHOW TABLES raw result: ...
[Database] ⭐ SHOW TABLES result type: array/object/...
[Database] ⭐ SHOW TABLES result length: ...
[Database] ⭐ Available tables in database: ...
[Database] ⭐ Table count: ...
[Database] ⭐ space_weather_data exists? true/false
```

#### 「実データ取得」実行時

```
[SpaceWeather] saveRealDataToDatabase called with X items
[SpaceWeather] Database connection obtained, starting to save data
[SpaceWeather] ⭐ Starting table verification...
[SpaceWeather] ⭐ Current database: test
[SpaceWeather] ⭐ SHOW TABLES raw result: ...
[SpaceWeather] ⭐ SHOW TABLES result type: ...
[SpaceWeather] ⭐ Available tables: ...
[SpaceWeather] ⭐ space_weather_data in tables? true/false
```

---

## 🎯 確認すべきポイント

### 1. `SHOW TABLES raw result` の内容

- **期待される結果**: 8つのテーブル名が表示される
  - `space_weather_data`
  - `daily_sentiment_scores`
  - `predictions`
  - `users`
  - `tweets`
  - `daily_mood_judgment`
  - `google_trend_data`
  - `twitter_trend_data`

- **もし空配列 `[]` の場合**: 
  - 接続先のデータベースが間違っている可能性
  - または、権限の問題

### 2. `SHOW TABLES result type`

- **期待される結果**: `array`
- **もし `object` の場合**: 結果の形式が異なる可能性

### 3. `SHOW TABLES result length`

- **期待される結果**: `8`（テーブル数）
- **もし `0` の場合**: テーブルが見えていない

### 4. `space_weather_data exists?`

- **期待される結果**: `true`
- **もし `false` の場合**: テーブルが存在しないか、見えていない

---

## 💡 もし問題が解決しない場合

### ケース1: `result length: 0` の場合

- TiDB Cloudで、接続ユーザーの権限を確認
- または、別のクラスタに接続している可能性

### ケース2: `result type: object` の場合

- 結果の形式が異なる可能性
- ログの `raw result` を確認して、形式を特定

### ケース3: エラーが発生する場合

- エラーメッセージを確認
- ログの詳細を確認

---

## ✅ 完了チェック

- [ ] Renderのデプロイが完了（"Live"）
- [ ] 「実データ取得」を実行
- [ ] `SHOW TABLES raw result` を確認
- [ ] `result length: 8` を確認
- [ ] `space_weather_data exists? true` を確認
- [ ] データが正常に保存される

---

**デプロイ完了後、上記の手順で確認してください！** 🔍


