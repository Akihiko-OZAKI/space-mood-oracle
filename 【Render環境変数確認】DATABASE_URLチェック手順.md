# Render環境変数確認: DATABASE_URLチェック手順

## 🎯 確認すべき内容

Render側の `DATABASE_URL` 環境変数が正しく設定されているか確認します。

---

## 📋 手順

### ステップ1: Renderダッシュボードにアクセス

1. ブラウザで https://dashboard.render.com にアクセス
2. ログイン
3. ダッシュボードで **`space-mood-oracle`** サービスを探す
4. サービス名をクリックして、サービス詳細ページを開く

---

### ステップ2: Environmentタブを開く

1. サービス詳細ページの上部メニューを確認
2. **「Environment」** タブをクリック

**注意:** 「Environments」（複数形）ではなく、**「Environment」**（単数形）です。

---

### ステップ3: DATABASE_URL環境変数を確認

Environmentタブを開くと、環境変数の一覧が表示されます。

**確認すべき環境変数:**
- `DATABASE_URL`

**確認内容:**
1. `DATABASE_URL` が一覧に表示されているか
2. 値が正しく設定されているか

**正しい値の形式:**
```
mysql://USERNAME:PASSWORD@HOST:4000/DATABASE_NAME?ssl-mode=REQUIRED
```

**TiDB Cloudの接続文字列の例:**
```
mysql://LgmGciWwK5YKo7Q.root:PASSWORD@gateway01.ap-northeast-1.prod.aws.tidbcloud.com:4000/space_mood_oracle?ssl-mode=REQUIRED
```

**重要なポイント:**
- ホスト名に `.`（ドット）が含まれているか確認
  - ✅ 正しい: `gateway01.ap-northeast-1.prod.aws.tidbcloud.com`
  - ❌ 間違い: `gateway01ap-northeast-1.prod.aws.tidbcloud.com`（ドットが抜けている）
- ポート番号は `4000`
- データベース名は `space_mood_oracle` または `test`
- `ssl-mode=REQUIRED` が含まれているか

---

### ステップ4: 他の環境変数も確認

以下の環境変数も確認してください：

- `CORS_ORIGIN` = `https://space-mood-oracle.vercel.app`
- `NODE_ENV` = `production`（設定されていれば）
- `PORT` = `10000`（設定されていれば）

---

## 🔍 問題が見つかった場合

### 問題1: DATABASE_URLが存在しない

**解決方法:**
1. Environmentタブで **「Add Environment Variable」** または **「+ Add」** ボタンをクリック
2. Key: `DATABASE_URL`
3. Value: TiDB Cloudの接続文字列を入力
4. **「Save Changes」** をクリック
5. **「Manual Deploy」** を実行して再デプロイ

### 問題2: DATABASE_URLの値が間違っている

**解決方法:**
1. `DATABASE_URL` の行をクリックして編集
2. 正しい接続文字列に修正
3. **「Save Changes」** をクリック
4. **「Manual Deploy」** を実行して再デプロイ

### 問題3: ホスト名にドットが抜けている

**解決方法:**
- `gateway01ap-northeast-1.prod.aws.tidbcloud.com` → `gateway01.ap-northeast-1.prod.aws.tidbcloud.com`
- `gateway01` と `ap-northeast-1` の間に `.`（ドット）を追加

---

## 📸 確認後の次のステップ

### DATABASE_URLが正しく設定されている場合

1. **Logsタブを確認**
   - Renderダッシュボード → `space-mood-oracle` サービス → **Logs** タブ
   - データベース接続に関するログメッセージを確認：
     - ✅ 正常: `[Database] Connection object created successfully.`
     - ❌ 異常: `[Database] Failed to connect: ...` または `[Database] DATABASE_URL is not set.`

2. **エラーログを確認**
   - `DrizzleQueryError` や `getaddrinfo ENOTFOUND` などのエラーメッセージがないか確認

### DATABASE_URLが設定されていない、または間違っている場合

1. 上記の「問題が見つかった場合」を参照して修正
2. Manual Deployを実行
3. 再度Logsタブで確認

---

## 🔗 関連リンク

- Renderダッシュボード: https://dashboard.render.com
- TiDB Cloudコンソール: https://tidbcloud.com

---

**まず、RenderのEnvironmentタブで `DATABASE_URL` が正しく設定されているか確認してください！** 🔍

