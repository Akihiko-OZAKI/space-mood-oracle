# Vercel環境変数設定 - 詳細手順

## 📋 設定する環境変数

```
Key:   VITE_API_BASE_URL
Value: https://space-mood-oracle.onrender.com
```

## 🎯 なぜ必要なのか

- Vercelにデプロイされたフロントエンドから、RenderにデプロイされたAPIサーバーにリクエストを送るため
- この環境変数がビルド時に埋め込まれ、本番環境でAPIのURLとして使用される
- 設定しないと、フロントエンドが `/api/trpc` という相対パスを使おうとして失敗する

## 📝 ステップバイステップ手順

### ステップ1: Vercelダッシュボードにアクセス

1. ブラウザで https://vercel.com を開く
2. **「Sign In」** をクリック（または既にログイン済みの場合はスキップ）
3. GitHubアカウントでログイン（推奨）

---

### ステップ2: プロジェクトを選択

1. ダッシュボードの **「Projects」** セクションを確認
2. **`space-mood-oracle`** という名前のプロジェクトを探す
3. プロジェクト名をクリックして、プロジェクト詳細ページを開く

---

### ステップ3: Settings（設定）画面を開く

1. プロジェクト詳細ページの上部メニューから **「Settings」** タブをクリック
2. 左サイドバーのメニューの中から **「Environment Variables」** をクリック

---

### ステップ4: 環境変数を追加

1. **「Key」** の入力欄に以下を入力：
   ```
   VITE_API_BASE_URL
   ```

2. **「Value」** の入力欄に以下を入力：
   ```
   https://space-mood-oracle.onrender.com
   ```
   ⚠️ **重要**: 末尾のスラッシュ（`/`）は**付けない**

3. **「Environment」** のチェックボックスで、以下3つすべてにチェックを入れる：
   - ☑ **Production**（本番環境）
   - ☑ **Preview**（プレビュー環境）
   - ☑ **Development**（開発環境）

4. **「Add」** ボタン（または **「Save」** ボタン）をクリック

5. 環境変数が一覧に追加されたことを確認

---

### ステップ5: デプロイを再実行（Redeploy）

環境変数を追加しただけでは、既存のデプロイには反映されません。**新しいデプロイが必要**です。

#### 方法1: 最新デプロイをRedeploy（推奨）

1. プロジェクト詳細ページの上部メニューから **「Deployments」** タブをクリック
2. 最新のデプロイ（一番上）を探す
3. デプロイの右側にある **「...」**（3つの点）メニューをクリック
4. **「Redeploy」** を選択
5. **「Redeploy」** を確認
6. デプロイが完了するまで待つ（通常1〜3分）

#### 方法2: 新しいコミットをプッシュ（代替方法）

もし方法1ができない場合：
1. 適当なファイルに軽微な変更を加える（例: READMEに空白行を追加）
2. コミット & プッシュ
3. Vercelが自動的に新しいデプロイを開始する

---

### ステップ6: 動作確認

1. デプロイが完了したら、**「Visit」** ボタンをクリック（または https://space-mood-oracle.vercel.app を開く）
2. ブラウザの開発者ツール（F12）を開く
3. **「Console」** タブを確認
4. APIへのリクエストが `https://space-mood-oracle.onrender.com/api/trpc/...` に送信されているか確認
5. エラーがなければ成功！

---

## 🔍 確認方法

### 環境変数が正しく設定されているか確認

**方法1: Vercelダッシュボードで確認**
- Settings → Environment Variables で、`VITE_API_BASE_URL` が一覧に表示されているか確認

**方法2: ビルドログで確認**
- Deployments → 最新デプロイ → 「Build Logs」を開く
- `VITE_API_BASE_URL` が環境変数として認識されているか確認（ただし値はマスクされる）

**方法3: 本番環境で確認**
- ブラウザの開発者ツール（F12）→ Network タブ
- APIリクエストのURLが `https://space-mood-oracle.onrender.com/api/trpc/...` になっているか確認

---

## ⚠️ よくある間違い

### ❌ 間違い1: 値の末尾にスラッシュを付ける
```
❌ https://space-mood-oracle.onrender.com/
✅ https://space-mood-oracle.onrender.com
```
コード内で既に `/api/trpc` を追加するため、末尾のスラッシュは不要です。

### ❌ 間違い2: Environmentを1つだけ選択
```
❌ Production だけチェック
✅ Production, Preview, Development すべてにチェック
```
すべての環境で動作するように、3つすべてにチェックを入れましょう。

### ❌ 間違い3: 環境変数を追加しただけでRedeployしない
環境変数を追加しても、既存のデプロイには反映されません。必ず **Redeploy** が必要です。

### ❌ 間違い4: キー名を間違える
```
❌ VITE_API_URL
❌ API_BASE_URL
❌ VITE_API_BASE
✅ VITE_API_BASE_URL
```
`VITE_` で始まる必要があります（Viteの環境変数の規則）。

---

## 🐛 トラブルシューティング

### 問題: 環境変数を設定したが、APIリクエストが失敗する

**確認事項:**
1. 環境変数が正しく設定されているか（Settings → Environment Variables）
2. Redeployを実行したか（環境変数を追加しただけでは反映されない）
3. RenderのAPIサーバーが起動しているか（https://space-mood-oracle.onrender.com にアクセスして確認）
4. RenderのCORS設定が正しいか（`CORS_ORIGIN=https://space-mood-oracle.vercel.app`）

**デバッグ方法:**
1. ブラウザの開発者ツール（F12）→ Console タブ
2. エラーメッセージを確認
3. Network タブで、APIリクエストのURLを確認
4. リクエストがどこに送信されているか確認

### 問題: CORSエラーが発生する

Render側の `CORS_ORIGIN` 環境変数が正しく設定されているか確認してください。

**Render側の設定:**
1. Renderダッシュボード → `space-mood-oracle` サービス → Environment タブ
2. `CORS_ORIGIN` が `https://space-mood-oracle.vercel.app` に設定されているか確認
3. 設定されていない場合は追加して、**Manual Deploy** を実行

---

## 📚 参考情報

- [Vercel環境変数の公式ドキュメント](https://vercel.com/docs/concepts/projects/environment-variables)
- [Vite環境変数の公式ドキュメント](https://vitejs.dev/guide/env-and-mode.html)

---

**設定が完了したら、`https://space-mood-oracle.vercel.app` で公開UIが正常に動作するか確認してください！** 🚀

