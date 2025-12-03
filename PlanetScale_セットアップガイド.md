# 🌍 PlanetScale セットアップ完全ガイド

## 📋 概要

PlanetScaleは、**完全無料で本番環境に使用できる**MySQL互換のクラウドデータベースです。

---

## 🎯 なぜ PlanetScale か？

1. ✅ **完全無料**（期限なし、本番環境でも使用可能）
2. ✅ **MySQL互換**（既存コード変更不要）
3. ✅ **高パフォーマンス**（自動スケーリング）
4. ✅ **セットアップが簡単**

---

## 📥 ステップ1: アカウント作成

### 1. PlanetScaleにアクセス

- サイト: https://planetscale.com/
- 「Sign up」または「Get started」をクリック

### 2. アカウント作成

- GitHubアカウントでログイン可能（推奨）
- または、メールアドレスで登録

### 3. プラン選択

- **「Hobby」プランを選択**（完全無料）
- 「Create account」をクリック

---

## 📦 ステップ2: データベース作成

### 1. ダッシュボードから作成

1. ダッシュボードを開く
2. 「Create database」ボタンをクリック
3. フォームに入力:
   - **Database name**: `space_mood_oracle`
   - **Region**: 日本に近いものを選択（例: `Asia Pacific (Tokyo)`）
   - **Plan**: `Hobby`（無料）を選択
4. 「Create database」をクリック

### 2. 作成完了

- データベースが作成されます
- 数秒で完了 ✅

---

## 🔗 ステップ3: 接続情報を取得

### 方法1: ダッシュボードから取得

1. 作成したデータベースをクリック
2. 上部の「**Connect**」ボタンをクリック
3. 「Connect with」から選択:
   - 「**General**」を選択（推奨）
   - または「Prisma」も可
4. **接続文字列が表示される**

**接続文字列の例:**
```
mysql://xxxxxxxxxx:pscale_pw_xxxxxxxxxx@aws.connect.psdb.cloud/space_mood_oracle?sslaccept=strict
```

### 方法2: パスワードを生成

1. 「Connect」画面で「**Generate new password**」をクリック
2. パスワードが生成される
3. **重要**: このパスワードは一度しか表示されません。コピーして保存！

---

## ⚙️ ステップ4: 環境変数を設定

### 1. `.env` ファイルを作成

プロジェクトルートに `.env` ファイルを作成:

```env
# PlanetScale データベース接続
DATABASE_URL=mysql://username:password@host.planetscale.com:3306/database?sslaccept=strict

# JWT署名シークレット
JWT_SECRET=your-random-secret-key-change-this-in-production

# Manus OAuth（ローカルでは不要）
# VITE_APP_ID=your-app-id
# OAUTH_SERVER_URL=https://api.manus.im
# VITE_OAUTH_PORTAL_URL=https://portal.manus.im
```

### 2. 接続文字列を設定

PlanetScaleから取得した接続文字列を、そのまま `DATABASE_URL` に設定してください。

**注意事項:**
- SSL接続が必須（`?sslaccept=strict` が含まれている）
- パスワードは安全に保管（`.env` ファイルはGitにコミットしない）

---

## 🗄️ ステップ5: データベース作成（マイグレーション）

### 方法1: PlanetScaleダッシュボードから実行（推奨）

1. **データベースを開く**
   - PlanetScaleダッシュボードで `space_mood_oracle` を開く

2. **ブランチを選択**
   - 左側の「Branches」タブを開く
   - 「**main**」ブランチを選択（デフォルト）
   - または、開発用に新しいブランチを作成

3. **SQLコンソールを開く**
   - 「**Console**」タブを開く
   - または、「SQL Editor」をクリック

4. **SQLを実行**
   - `【今すぐ実行】DB作成.sql` の内容をコピー
   - SQLエディタにペースト
   - 「**Run**」ボタンをクリック

5. **確認**
   - 実行結果が表示される
   - エラーがなければ成功 ✅

### 方法2: PlanetScale CLIから実行

#### CLIをインストール

```bash
# Windows (PowerShell)
winget install planetscale.cli

# または、npmから
npm install -g pscale
```

#### ログイン

```bash
pscale auth login
```

#### データベースに接続してSQL実行

```bash
# データベースに接続
pscale connect space_mood_oracle main

# 別のターミナルでSQLを実行
mysql -h 127.0.0.1 -P 3306 -u root < 【今すぐ実行】DB作成.sql
```

### 方法3: 接続文字列を使って直接実行

PlanetScaleの接続文字列を使って、MySQLクライアントから直接接続:

```bash
mysql "mysql://username:password@host.planetscale.com:3306/database?sslaccept=strict" < 【今すぐ実行】DB作成.sql
```

---

## ✅ ステップ6: 確認

### 1. テーブルが作成されたか確認

PlanetScaleダッシュボードで:

1. データベースを開く
2. 「**Tables**」タブを開く
3. 以下のテーブルが表示されれば成功 ✅:
   - `google_trend_data`
   - `twitter_trend_data`
   - `daily_mood_judgment`

### 2. 接続テスト

サーバーを起動して接続を確認:

```bash
pnpm dev
```

エラーが出なければ接続成功 ✅

---

## 🔧 ブランチ機能（開発/本番の分離）

PlanetScaleにはブランチ機能があります:

- **mainブランチ**: 本番環境用
- **開発ブランチ**: 開発・テスト用

### 開発ブランチの作成

1. ダッシュボードで「Branches」タブを開く
2. 「Create branch」をクリック
3. ブランチ名を入力（例: `dev`）
4. 「Create branch」をクリック

### 本番にデプロイ

開発が完了したら:

1. 開発ブランチでテスト
2. 「Create deploy request」で本番ブランチ（main）にマージ

---

## 📊 無料枠の制限

### Hobbyプラン（無料）

- ✅ **ストレージ**: 5GB
- ✅ **リクエスト**: 10億行/月
- ✅ **データベース**: 1つ
- ✅ **期限**: **なし**

### 制限を超えた場合

- ストレージが5GBを超える: アーカイブまたはデータ削減
- リクエストが制限を超える: アラート通知（一時的な超過は問題なし）

**小規模アプリには十分な制限です** ✅

---

## 🆘 トラブルシューティング

### 接続エラー: "SSL connection required"

→ PlanetScaleはSSL接続が必須です

**解決策:**
- 接続文字列に `?sslaccept=strict` が含まれているか確認
- または、接続文字列の末尾に `?sslaccept=strict` を追加

### 接続エラー: "Access denied"

→ ユーザー名・パスワードが間違っている

**解決策:**
- PlanetScaleダッシュボードで新しいパスワードを生成
- `.env` ファイルを更新

### マイグレーションエラー

→ SQL構文エラーの可能性

**解決策:**
- SQLファイルの内容を確認
- エラーメッセージを確認して修正

---

## 📝 まとめ

### セットアップ手順

1. ✅ PlanetScaleにアカウント作成
2. ✅ データベース作成（`space_mood_oracle`）
3. ✅ 接続情報を取得
4. ✅ `.env` ファイルに設定
5. ✅ マイグレーションSQLを実行
6. ✅ 動作確認

### 所要時間

- アカウント作成: 約2分
- データベース作成: 約1分
- 接続情報取得: 約1分
- マイグレーション: 約1分

**合計: 約5分** ⏱️

---

## 🎯 次のステップ

データベースセットアップ完了後:

1. ✅ サーバーを起動（`pnpm dev`）
2. ✅ APIをテスト
3. ✅ 本番環境にデプロイ

---

**PlanetScaleのセットアップを始めましょう！** 🚀

詳細: https://planetscale.com/


