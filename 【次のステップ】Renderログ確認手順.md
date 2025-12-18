# 次のステップ: Renderログでエラーを確認

## ✅ 確認済み

- `DATABASE_URL` 環境変数が正しく設定されている
- 形式も問題なさそう（ホスト名、データベース名、SSL設定すべて正しい）

---

## 🔍 次のステップ: Renderのログを確認

`DATABASE_URL` は正しく設定されていますが、データベースクエリが失敗しているので、**Renderのログで具体的なエラーメッセージ**を確認する必要があります。

---

## 📋 手順

### ステップ1: RenderのLogsタブを開く

1. Renderダッシュボードの `space-mood-oracle` サービス詳細ページで
2. 上部メニューから **「Logs」** タブをクリック

---

### ステップ2: エラーメッセージを探す

ログをスクロールして、以下のようなエラーメッセージを探してください：

**探すべきキーワード:**
- `DrizzleQueryError`
- `Failed query`
- `getaddrinfo ENOTFOUND`
- `Access denied`
- `Table doesn't exist`
- `[Database] Failed to connect`

---

### ステップ3: エラーメッセージをコピー

見つかったエラーメッセージの **2〜3行** をそのままコピーして、ここに貼り付けてください。

**例:**
```
[DrizzleQueryError] Failed query: select `id`, `date`, `predicted_score` ...
cause: Error: getaddrinfo ENOTFOUND gateway01.ap-northeast-1.prod.aws.tidbcloud.com
```

または

```
[Database] Failed to connect: Error: Access denied for user '2iZ5PoqMuT8TqCD.root'@...
```

---

## 🎯 確認したいエラーの種類

### 1. ネットワークエラー（`getaddrinfo ENOTFOUND`）

**エラーメッセージ例:**
```
cause: Error: getaddrinfo ENOTFOUND gateway01.ap-northeast-1.prod.aws.tidbcloud.com
```

**原因:** ホスト名が解決できない

**解決方法:**
- ホスト名のタイポを確認
- ネットワーク接続を確認

---

### 2. 認証エラー（`Access denied`）

**エラーメッセージ例:**
```
cause: Error: Access denied for user '2iZ5PoqMuT8TqCD.root'@'xxx.xxx.xxx.xxx' (using password: YES)
```

**原因:** ユーザー名やパスワードが間違っている

**解決方法:**
- TiDB Cloudのパスワードを確認
- `DATABASE_URL` のパスワード部分を確認
- パスワードに特殊文字が含まれている場合、URLエンコードが必要かもしれません

---

### 3. テーブルが存在しない（`Table doesn't exist`）

**エラーメッセージ例:**
```
cause: Error: Table 'space_mood_oracle.predictions' doesn't exist
```

**原因:** テーブルが作成されていない

**解決方法:**
- Drizzleマイグレーションを実行
- または、手動でSQLスクリプトを実行してテーブルを作成

---

### 4. データベース接続のタイムアウト

**エラーメッセージ例:**
```
cause: Error: connect ETIMEDOUT ...
```

**原因:** ネットワーク接続がタイムアウトしている

**解決方法:**
- ファイアウォール設定を確認
- TiDB CloudのIPアドレス許可リストを確認

---

## 📝 注意事項

- ログは時系列で表示されます。**最新のエラーメッセージ**を探してください
- エラーメッセージ全体をコピーする必要はありません。**最初の2〜3行**で十分です
- もし複数のエラーがある場合、**最も重要なエラー（最初に発生したエラー）**を優先してください

---

**RenderのLogsタブを開いて、エラーメッセージを探してください！** 🔍

