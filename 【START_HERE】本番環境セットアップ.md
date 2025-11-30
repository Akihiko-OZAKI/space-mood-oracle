# 🚀 START HERE - 本番環境セットアップ

## 📋 概要

**TiDB Cloud（データベース） + Render（アプリ）** で完全無料の本番環境を構築します。

**所要時間: 約20分** ⏱️

---

## 🎯 セットアップ手順

### ステップ1: TiDB Cloudでデータベース作成（約7-10分）

#### 1. アカウント作成

1. https://tidbcloud.com/ にアクセス
2. 「Sign up」または「Get Started」をクリック
3. アカウント作成（メールアドレスまたはGitHub）
4. **Developer Tier（無料）** を選択

#### 2. クラスター作成

1. 「Create Cluster」をクリック
2. **Developer Tier** を選択（無料）
3. フォームに入力:
   - **Cluster Name**: `space-mood-oracle`（任意）
   - **Region**: 日本に近いものを選択
   - **Project**: 既存または新規作成
4. 「Create」をクリック
5. 数分待つ（クラスター作成中）

#### 3. 接続情報を取得

1. クラスターを開く
2. 「Connect」タブまたは「Overview」タブを開く
3. 「Standard Connection」を選択
4. **接続文字列をコピー**（後で使います）

**接続文字列の例:**
```
mysql://username:password@tidb.xxxxx.aws.tidbcloud.com:4000/database?ssl-mode=REQUIRED
```

#### 4. データベース作成（SQL実行）

1. クラスターを開く
2. 「SQL Editor」タブを開く
3. データベースを作成（接続文字列に含めるか、SQLで作成）:

```sql
CREATE DATABASE IF NOT EXISTS space_mood_oracle;
USE space_mood_oracle;
```

4. `【今すぐ実行】DB作成.sql` の内容をコピー＆ペースト
5. 「Run」または「Execute」をクリック
6. エラーがなければ成功 ✅

---

### ステップ2: Renderでアプリをデプロイ（約10分）

#### 1. Renderアカウント作成

1. https://render.com/ にアクセス
2. 「Get Started for Free」をクリック
3. GitHubアカウントでログイン（推奨）

#### 2. GitHubリポジトリを準備

- プロジェクトがGitHubにプッシュされていることを確認
- ブランチ名を確認（通常は `main` または `master`）

#### 3. Webサービスを作成

1. Renderダッシュボードで「New +」→「Web Service」を選択
2. GitHubリポジトリを選択
3. サービス設定を入力:

   | 項目 | 値 |
   |------|-----|
   | **Name** | `space-mood-oracle` |
   | **Region** | `Oregon (US West)` など |
   | **Branch** | `main` |
   | **Root Directory** | `space_mood_oracle_v2.1/space_mood_oracle` |
   | **Runtime** | `Node` |
   | **Build Command** | `pnpm install && pnpm build` |
   | **Start Command** | `pnpm start` |
   | **Instance Type** | `Free` |

4. **環境変数を設定**（「Environment」セクション）:

  ```env
  DATABASE_URL=mysql://username:password@tidb.xxxxx.aws.tidbcloud.com:4000/database?ssl-mode=REQUIRED
  JWT_SECRET=your-random-secret-key-change-this-in-production
  NODE_ENV=production
  PORT=10000
  ```

  **注意**: 
  - `DATABASE_URL` はTiDB Cloudから取得した接続文字列をそのまま使用
  - `JWT_SECRET` はランダムな文字列に変更（本番環境用）

5. 「Create Web Service」をクリック

#### 4. デプロイ待機

- 初回デプロイは約5-10分かかります
- ログでビルド状況を確認
- 「Live」と表示されれば成功 ✅

#### 5. 動作確認

- デプロイが完了したら、URLにアクセス
- アプリが正常に表示されれば成功 ✅

---

## ✅ チェックリスト

### PlanetScale

- [ ] アカウント作成完了
- [ ] データベース作成完了（`space_mood_oracle`）
- [ ] 接続文字列を取得
- [ ] SQL実行完了（テーブル作成）

### Render

- [ ] アカウント作成完了
- [ ] GitHubリポジトリを連携
- [ ] Webサービス作成完了
- [ ] 環境変数設定完了
- [ ] デプロイ成功
- [ ] 動作確認完了

---

## 🔧 トラブルシューティング

### PlanetScale

**問題**: SQL実行エラー
- 解決策: SQLファイルの内容を確認、エラーメッセージを確認

**問題**: 接続文字列が取得できない
- 解決策: データベースの「Connect」ボタンから取得

### Render

**問題**: ビルドエラー
- 解決策: ログを確認、`package.json` のビルドスクリプトを確認

**問題**: 起動エラー
- 解決策: 環境変数を確認、データベース接続を確認

**問題**: データベース接続エラー
- 解決策: `DATABASE_URL` を確認、PlanetScaleの接続文字列を確認

---

## 📚 詳細ガイド

- **TiDB Cloud詳細**: `TiDB_Cloud_セットアップガイド.md`
- **Render詳細**: `Render_デプロイガイド.md`
- **データベースSQL**: `【今すぐ実行】DB作成.sql`
- **変更履歴**: `【修正】データベース選択.md`

---

## 🎯 次のステップ

セットアップ完了後:

1. ✅ アプリにアクセスして動作確認
2. ✅ データベース接続を確認
3. ✅ APIエンドポイントをテスト
4. ✅ （オプション）UptimeRobotでPing設定（スリープ回避）

---

## 💰 コスト

**合計: $0/月（完全無料）** ✅

- PlanetScale: 無料（期限なし）
- Render: 無料（スリープあり）

---

**さあ、始めましょう！** 🚀

**ステップ1から順番に進めてください。**

