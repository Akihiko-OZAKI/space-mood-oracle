# 🚀 今すぐ実行！Renderデプロイ手順

## ✅ 準備完了

- ✅ Renderアカウント作成済み
- ✅ GitHub連携済み
- ✅ 接続文字列取得済み

---

## 🎯 手順（約5分）

### ステップ1: Webサービスを作成

1. Renderダッシュボードで **「New +」** をクリック
2. **「Web Service」** を選択

### ステップ2: リポジトリを選択

1. 既に連携済みのGitHubリポジトリから選択
2. プロジェクトのリポジトリを選択

### ステップ3: サービス設定

以下の設定を入力:

| 項目 | 値 |
|------|-----|
| **Name** | `space-mood-oracle` |
| **Region** | `Oregon (US West)` など |
| **Branch** | `main` または `master` |
| **Root Directory** | `space_mood_oracle_v2.1/space_mood_oracle` |
| **Runtime** | `Node` |
| **Build Command** | `pnpm install && pnpm build` |
| **Start Command** | `pnpm start` |
| **Instance Type** | `Free` |

**重要な設定:**

- **Root Directory**: プロジェクトがサブディレクトリにある場合、ここを指定
- **Build Command**: `pnpm install && pnpm build`
- **Start Command**: `pnpm start`

### ステップ4: 環境変数を設定

「**Environment**」セクションで、以下の環境変数を追加:

#### 環境変数1: DATABASE_URL

```
Key: DATABASE_URL
Value: mysql://2iZ5PoqMuT8TqCD.root:r67OfCaeTlpguXgm@gateway01.ap-northeast-1.prod.aws.tidbcloud.com:4000/space_mood_oracle?ssl-mode=REQUIRED
```

#### 環境変数2: JWT_SECRET

```
Key: JWT_SECRET
Value: your-random-secret-key-change-this-in-production
```

**注意**: JWT_SECRETはランダムな文字列に変更してください（例: `openssl rand -hex 32`）

#### 環境変数3: NODE_ENV

```
Key: NODE_ENV
Value: production
```

#### 環境変数4: PORT

```
Key: PORT
Value: 10000
```

### ステップ5: サービスを作成

1. すべての設定を確認
2. **「Create Web Service」** をクリック
3. デプロイが自動的に開始されます ✅

---

## ⏳ デプロイ待機

### デプロイプロセス

1. **依存関係のインストール**（約2-3分）
   - `pnpm install` が実行される

2. **ビルド**（約3-5分）
   - `pnpm build` が実行される
   - ReactとExpressがビルドされる

3. **起動**（約1分）
   - `pnpm start` が実行される
   - アプリが起動する

**初回デプロイは約5-10分かかります** ⏱️

### ログの確認

- デプロイ中はログがリアルタイムで表示されます
- エラーがあればログに表示されます

---

## ✅ 確認

### 1. デプロイ成功の確認

- ダッシュボードで「**Live**」と表示されれば成功 ✅
- URLが表示されます（例: `https://space-mood-oracle.onrender.com`）

### 2. アプリにアクセス

- URLをクリックしてアプリにアクセス
- 正常に表示されれば成功 ✅

---

## 🔧 トラブルシューティング

### ビルドエラー

**エラー**: "Build failed"

**解決策:**
- ログを確認
- `package.json` のビルドスクリプトを確認
- 依存関係を確認

### 起動エラー

**エラー**: "Application failed to start"

**解決策:**
- 環境変数を確認
- データベース接続を確認
- ポート設定を確認（`PORT=10000`）

### データベース接続エラー

**エラー**: "Cannot connect to database"

**解決策:**
- `DATABASE_URL` を確認
- TiDB Cloudの接続文字列を確認
- SSL設定を確認（`?ssl-mode=REQUIRED`）

---

## 📝 まとめ

### セットアップ手順

1. ✅ Webサービスを作成
2. ✅ リポジトリを選択
3. ✅ サービス設定を入力
4. ✅ 環境変数を設定
5. ✅ デプロイ待機（約5-10分）
6. ✅ 動作確認

---

## 🎯 次のステップ

デプロイ完了後:

1. ✅ アプリにアクセスして動作確認
2. ✅ データベース接続を確認
3. ✅ APIエンドポイントをテスト

---

**さあ、Renderでデプロイしましょう！** 🚀

