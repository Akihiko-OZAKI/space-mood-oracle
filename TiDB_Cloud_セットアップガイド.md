# 🌍 TiDB Cloud セットアップ完全ガイド

## 📋 概要

TiDB Cloudは、**完全無料で本番環境に使用できる**MySQL互換の分散型クラウドデータベースです。

**引継ぎサマリーでも推奨されています** ✅

---

## 🎯 なぜ TiDB Cloud か？

1. ✅ **完全無料プランあり**（Developer Tier）
2. ✅ **MySQL互換**（既存コード変更不要）
3. ✅ **引継ぎサマリーで推奨**
4. ✅ **本番環境対応**（分散データベース）

---

## 📥 ステップ1: アカウント作成

### 1. TiDB Cloudにアクセス

- サイト: https://tidbcloud.com/
- 「Sign up」または「Get Started」をクリック

### 2. アカウント作成

- メールアドレスで登録
- または、GitHubアカウントでログイン可能

### 3. プラン選択

- **「Developer Tier」を選択**（無料）
- 無料枠の制限を確認

---

## 📦 ステップ2: クラスター作成

### 1. ダッシュボードから作成

1. ダッシュボードを開く
2. 「Create Cluster」または「Create」ボタンをクリック
3. **「Developer Tier」** を選択（無料）
4. フォームに入力:
   - **Cluster Name**: `space-mood-oracle`（任意）
   - **Region**: 日本に近いものを選択（例: `us-west-2`）
   - **Project**: 既存プロジェクトを選択、または新規作成
5. 「Create」をクリック

### 2. 作成完了

- クラスターが作成されます
- 数分かかる場合があります ⏱️

---

## 🔗 ステップ3: 接続情報を取得

### 1. クラスターを開く

1. 作成したクラスターをクリック
2. 「Connect」タブまたは「Overview」タブを開く

### 2. 接続文字列を取得

1. 「Connect」セクションを開く
2. 「Standard Connection」を選択
3. **接続文字列をコピー**

**接続文字列の形式:**
```
mysql://username:password@tidb.xxxxx.aws.tidbcloud.com:4000/database?ssl-mode=REQUIRED
```

### 3. パスワードを設定

- 初回接続時にパスワードを設定
- パスワードを安全に保管

---

## ⚙️ ステップ4: 環境変数を設定

### 1. `.env` ファイルを作成

プロジェクトルートに `.env` ファイルを作成:

```env
# TiDB Cloud データベース接続
DATABASE_URL=mysql://username:password@tidb.xxxxx.aws.tidbcloud.com:4000/database?ssl-mode=REQUIRED

# JWT署名シークレット
JWT_SECRET=your-random-secret-key-change-this-in-production

# Manus OAuth（ローカルでは不要）
# VITE_APP_ID=your-app-id
# OAUTH_SERVER_URL=https://api.manus.im
# VITE_OAUTH_PORTAL_URL=https://portal.manus.im
```

### 2. 接続文字列を設定

TiDB Cloudから取得した接続文字列を、そのまま `DATABASE_URL` に設定してください。

**注意事項:**
- SSL接続が推奨（`?ssl-mode=REQUIRED` が含まれている）
- パスワードは安全に保管（`.env` ファイルはGitにコミットしない）

---

## 🗄️ ステップ5: データベース作成（マイグレーション）

### 方法1: TiDB Cloudダッシュボードから実行（推奨）

1. **クラスターを開く**
   - TiDB Cloudダッシュボードでクラスターを開く

2. **SQL Editorを開く**
   - 「SQL Editor」タブを開く
   - または、「Connect」→「SQL Editor」をクリック

3. **SQLを実行**
   - `【今すぐ実行】DB作成.sql` の内容をコピー
   - SQLエディタにペースト
   - 「Run」または「Execute」をクリック

4. **確認**
   - 実行結果が表示される
   - エラーがなければ成功 ✅

### 方法2: データベース名を指定

TiDB Cloudでは、接続時にデータベース名を指定できます。

接続文字列にデータベース名を含める:
```
mysql://username:password@tidb.xxxxx.aws.tidbcloud.com:4000/space_mood_oracle?ssl-mode=REQUIRED
```

または、SQL Editorでデータベースを作成:
```sql
CREATE DATABASE IF NOT EXISTS space_mood_oracle;
USE space_mood_oracle;
```

その後、`【今すぐ実行】DB作成.sql` を実行。

---

## ✅ ステップ6: 確認

### 1. テーブルが作成されたか確認

TiDB Cloudダッシュボードで:

1. クラスターを開く
2. 「SQL Editor」を開く
3. 以下のSQLを実行:

```sql
USE space_mood_oracle;
SHOW TABLES;
```

4. 以下のテーブルが表示されれば成功 ✅:
   - `google_trend_data`
   - `twitter_trend_data`
   - `daily_mood_judgment`

### 2. 接続テスト

ローカルでサーバーを起動して接続を確認:

```bash
pnpm dev
```

エラーが出なければ接続成功 ✅

---

## 📊 無料枠の制限

### Developer Tier（無料）

- **ストレージ**: 25GB行ストレージ + 25GB列ストレージ
- **リクエスト**: 250万リクエストユニット（RUs）/月
- **クラスター**: 制限あり（詳細要確認）

### 制限を超えた場合

- ストレージが制限を超える: アーカイブまたはデータ削減
- リクエストが制限を超える: アラート通知

**小規模アプリには十分な制限です** ✅

---

## 🆘 トラブルシューティング

### 接続エラー: "SSL connection required"

→ TiDB CloudはSSL接続が推奨です

**解決策:**
- 接続文字列に `?ssl-mode=REQUIRED` が含まれているか確認
- または、接続文字列の末尾に `?ssl-mode=REQUIRED` を追加

### 接続エラー: "Access denied"

→ ユーザー名・パスワードが間違っている

**解決策:**
- TiDB Cloudダッシュボードでパスワードをリセット
- `.env` ファイルを更新

### マイグレーションエラー

→ SQL構文エラーの可能性

**解決策:**
- SQLファイルの内容を確認
- エラーメッセージを確認して修正
- データベースが選択されているか確認

---

## 📝 まとめ

### セットアップ手順

1. ✅ TiDB Cloudにアカウント作成
2. ✅ クラスター作成（Developer Tier）
3. ✅ 接続情報を取得
4. ✅ `.env` ファイルに設定
5. ✅ SQL実行（テーブル作成）
6. ✅ 動作確認

### 所要時間

- アカウント作成: 約2分
- クラスター作成: 約3-5分
- 接続情報取得: 約1分
- マイグレーション: 約1分

**合計: 約7-10分** ⏱️

---

## 🎯 次のステップ

データベースセットアップ完了後:

1. ✅ サーバーを起動（`pnpm dev`）
2. ✅ APIをテスト
3. ✅ Renderでアプリをデプロイ

---

**TiDB Cloudのセットアップを始めましょう！** 🚀

詳細: https://tidbcloud.com/


