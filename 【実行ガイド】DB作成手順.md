# 🚀 データベース作成 - 実行ガイド

## ⚡ 今すぐ実行する方法

### 📁 実行するファイル

**`【今すぐ実行】DB作成.sql`**

---

## 📋 実行手順（最も簡単な方法）

### 方法1: phpMyAdminで実行 ⭐ 推奨

1. **phpMyAdminを開く**
   - ブラウザで `http://localhost/phpmyadmin` を開く
   - または、XAMPP/MAMPなどのコントロールパネルから起動

2. **SQLファイルを開く**
   - ファイル: `【今すぐ実行】DB作成.sql`
   - 全体をコピー（Ctrl+A → Ctrl+C）

3. **実行**
   - phpMyAdminの上部メニューから「SQL」タブをクリック
   - SQL入力欄にペースト（Ctrl+V）
   - 右下の「実行」ボタンをクリック

4. **完了！** ✅

---

### 方法2: MySQL Workbenchで実行

1. **MySQL Workbenchを起動**
   - インストール済みの場合

2. **データベースに接続**
   - 既存の接続を選択、または新規接続を作成

3. **SQLファイルを開く**
   - ファイル: `【今すぐ実行】DB作成.sql`
   - 全体をコピー（Ctrl+A → Ctrl+C）

4. **実行**
   - クエリエディタ（Query Editor）を開く
   - ペースト（Ctrl+V）
   - ⚡（実行）ボタンをクリック

5. **完了！** ✅

---

### 方法3: コマンドラインで実行

```bash
# MySQLに接続
mysql -u root -p

# SQLファイルを実行（接続後）
source 【今すぐ実行】DB作成.sql

# または、直接実行
mysql -u root -p < "【今すぐ実行】DB作成.sql"
```

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

## 🆘 トラブルシューティング

### "Access denied"

**原因**: ユーザー名・パスワードが間違っている

**解決策**: 
- 正しいユーザー名・パスワードでログイン
- または、`root`ユーザーで実行を試す

### "Unknown database"

**原因**: データベースが作成されていない

**解決策**: 
- SQLファイルを再度実行
- `CREATE DATABASE` 文が実行されているか確認

### "Table already exists"

**原因**: 既にテーブルが存在する

**解決策**: 
- 問題ありません！`CREATE TABLE IF NOT EXISTS` なのでスキップされます
- そのまま使用できます

---

## 📝 実行するSQLの内容

このSQLファイルを実行すると：

1. ✅ **データベース作成**
   - 名前: `space_mood_oracle`
   - 文字コード: `utf8mb4`

2. ✅ **テーブル作成（3つ）**
   - `google_trend_data`
   - `twitter_trend_data`
   - `daily_mood_judgment`

**合計実行時間: 約5秒** ⏱️

---

## 🎯 実行後の次のステップ

データベース作成後：

1. ✅ 環境変数を設定（`.env` ファイルに `DATABASE_URL`）
2. ✅ サーバーを起動（`pnpm dev`）
3. ✅ APIをテスト

詳細は `完全セットアップ手順.md` を参照してください。

---

**それでは、`【今すぐ実行】DB作成.sql` を実行してください！** 🚀


