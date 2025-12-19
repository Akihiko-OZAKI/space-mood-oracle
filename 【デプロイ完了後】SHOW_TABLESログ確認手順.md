# デプロイ完了後: SHOW TABLESログ確認手順

## ✅ 完了したこと

- [x] `SHOW TABLES` のログ出力を改善
- [x] エラーハンドリングを強化
- [x] Gitにコミット・プッシュ
- [x] Renderでデプロイ開始

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

#### サーバー起動時（最新デプロイのログ）

```
[Database] ⭐ Starting database introspection...
[Database] ⭐ Current database (from SELECT DATABASE()): test
[Database] ⭐ Executing SHOW TABLES query...
[Database] ⭐ SHOW TABLES query completed
[Database] ⭐ SHOW TABLES raw result: ...
[Database] ⭐ SHOW TABLES result type: array/object/...
[Database] ⭐ SHOW TABLES result length: ...
[Database] ⭐ Available tables in database: ...
[Database] ⭐ Table count: ...
[Database] ⭐ space_weather_data exists? ...
[Database] ⭐ Database introspection completed
```

#### 「実データ取得」実行時

```
[SpaceWeather] ⭐ Starting table verification...
[SpaceWeather] ⭐ Pool found, querying database...
[SpaceWeather] ⭐ Current database: test
[SpaceWeather] ⭐ Executing SHOW TABLES query...
[SpaceWeather] ⭐ SHOW TABLES query completed
[SpaceWeather] ⭐ SHOW TABLES raw result: ...
[SpaceWeather] ⭐ SHOW TABLES result type: ...
[SpaceWeather] ⭐ SHOW TABLES result length: ...
[SpaceWeather] ⭐ Available tables: ...
[SpaceWeather] ⭐ space_weather_data in tables? ...
```

---

## 🔍 検索方法

RenderのLogsタブの検索ボックスで、以下を検索：

### 方法1: 生の結果を検索

```
SHOW TABLES raw result
```

### 方法2: ステップを検索

```
Starting database introspection
```

### 方法3: ⭐マークで検索

```
⭐ SHOW TABLES
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

### 4. エラーメッセージ

- もしエラーが発生した場合、詳細なエラー情報が表示されるはずです

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


