# 🚀 マイグレーション実行ガイド

## 📋 現在の状況

新しいテーブル3つをデータベースに作成する必要があります：
- `google_trend_data`
- `twitter_trend_data`
- `daily_mood_judgment`

## ✅ 実行方法（2つの選択肢）

### 方法1: 手動実行（最も確実）⭐ 推奨

1. **マイグレーションファイルを開く**
   ```
   drizzle/0003_trend_analysis_tables.sql
   ```

2. **SQL内容をコピー**

3. **データベース管理ツールで実行**
   - phpMyAdminの場合: SQLタブ → ペースト → 実行
   - MySQL Workbenchの場合: クエリエディタ → ペースト → 実行
   - コマンドライン: `mysql -u user -p database < drizzle/0003_trend_analysis_tables.sql`

4. **完了！** ✅

### 方法2: スクリプトで実行

**前提条件**: 環境変数 `DATABASE_URL` が設定されている必要があります

```bash
# 1. 依存関係をインストール（初回のみ）
npm install --legacy-peer-deps

# 2. マイグレーション実行
node scripts/run-migration.mjs
```

---

## 🔍 実行後の確認

マイグレーションが成功したら、以下のSQLで確認できます：

```sql
-- テーブルが作成されたか確認
SHOW TABLES LIKE '%trend%';
SHOW TABLES LIKE '%mood%';

-- 各テーブルの構造を確認
DESCRIBE google_trend_data;
DESCRIBE twitter_trend_data;
DESCRIBE daily_mood_judgment;
```

---

## 🎯 次のステップ

マイグレーション実行後：

1. ✅ **動作確認**
   - サーバーを起動: `pnpm dev` または `npm run dev`
   - APIエンドポイントをテスト

2. ✅ **テスト**
   - `trends.getTodayMood` APIを呼び出し
   - 判定結果が正しく返されるか確認

---

## 📁 関連ファイル

- **マイグレーションSQL**: `drizzle/0003_trend_analysis_tables.sql`
- **実行スクリプト**: `scripts/run-migration.mjs`
- **詳細手順**: `マイグレーション手動実行手順.md`
- **簡単手順**: `マイグレーション実行方法.txt`

---

**わからないことがあれば、まずは方法1（手動実行）をお試しください！** 🎉


