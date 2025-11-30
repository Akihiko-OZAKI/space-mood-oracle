# 🚀 データベース作成 - 実行手順

## 📋 実行するSQL

**ファイル**: `【今すぐ実行】DB作成.sql`

---

## ⚡ 最も簡単な方法（推奨）

### phpMyAdminを使う場合

1. **phpMyAdminを開く**
   - ブラウザで `http://localhost/phpmyadmin` を開く
   - または、XAMPP/MAMPなどのコントロールパネルから起動

2. **SQLタブを開く**
   - 上部メニューの「SQL」をクリック

3. **SQLファイルを開いてコピー**
   - `【今すぐ実行】DB作成.sql` を開く
   - 全体をコピー（Ctrl+A → Ctrl+C）

4. **実行**
   - SQL入力欄にペースト（Ctrl+V）
   - 右下の「実行」ボタンをクリック

5. **完了！** ✅

---

### MySQL Workbenchを使う場合

1. **MySQL Workbenchを起動**
   - インストール済みの場合

2. **データベースに接続**
   - 既存の接続を選択

3. **クエリエディタを開く**
   - 新しいクエリタブを開く（または既存のクエリエディタを使用）

4. **SQLファイルを開いてコピー**
   - `【今すぐ実行】DB作成.sql` を開く
   - 全体をコピー（Ctrl+A → Ctrl+C）

5. **実行**
   - クエリエディタにペースト（Ctrl+V）
   - ⚡（実行）ボタンをクリック

6. **完了！** ✅

---

## 📝 実行される内容

このSQLを実行すると：

1. ✅ **データベース作成**
   ```sql
   CREATE DATABASE IF NOT EXISTS space_mood_oracle
   ```

2. ✅ **テーブル作成（3つ）**
   - `google_trend_data`
   - `twitter_trend_data`
   - `daily_mood_judgment`

---

## ✅ 実行後の確認

### 1. データベースが作成されたか確認

```sql
SHOW DATABASES;
```

→ `space_mood_oracle` が表示されればOK ✅

### 2. テーブルが作成されたか確認

```sql
USE space_mood_oracle;
SHOW TABLES;
```

**期待される結果:**
```
google_trend_data
twitter_trend_data
daily_mood_judgment
```

→ 3つが表示されれば成功！ ✅

---

## 🎯 次のステップ

データベース作成後：

1. ✅ 環境変数を設定（`.env` ファイル）
2. ✅ サーバーを起動（`pnpm dev`）
3. ✅ APIをテスト

---

**それでは、`【今すぐ実行】DB作成.sql` を実行してください！** 🚀

