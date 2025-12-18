# Next Step: Vercel環境変数設定後の確認事項

## ✅ 完了済み

- [x] Gitへのコミット・プッシュ完了
- [x] Render側で環境変数の設定を確認（参考）

---

## 🔴 重要: まだ必要な作業

### ⚠️ RenderではなくVercel側で設定が必要

添付画像は**Renderの設定画面**ですが、`VITE_API_BASE_URL` は **Vercel側（フロントエンド）** で使用する環境変数です。

**なぜVercel側か:**
- `VITE_` で始まる環境変数は、Vite（フロントエンドビルドツール）が使用
- フロントエンドのコード（`client/src/main.tsx`）で読み込まれる
- Vercelにデプロイされるフロントエンドが、この環境変数を使ってAPIのURLを決定

**Render側の設定は参考程度:**
- Render側でも設定してもエラーにはなりませんが、実際には使われません
- バックエンド（Render）は環境変数を読み込む必要がないため

---

## 📋 Next Steps（次のステップ）

### ステップ1: Vercelで環境変数を設定 ⚠️ 必須

1. **Vercelダッシュボードにアクセス**
   - https://vercel.com にアクセス
   - ログイン
   - `space-mood-oracle` プロジェクトを選択

2. **環境変数設定画面を開く**
   - Settings → Environment Variables

3. **環境変数を追加**
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://space-mood-oracle.onrender.com`
   - **Environment**: ☑ Production, ☑ Preview, ☑ Development（3つすべてにチェック）

4. **Add をクリック**

5. **確認**
   - 環境変数一覧に `VITE_API_BASE_URL` が表示される
   - 「Production, Preview, Development」と表示されていることを確認

---

### ステップ2: VercelでRedeploy（再デプロイ） ⚠️ 必須

環境変数を追加しただけでは、既存のデプロイには反映されません。

1. **Deployments タブを開く**
   - プロジェクト詳細ページの上部メニューから **「Deployments」** をクリック

2. **最新のデプロイをRedeploy**
   - 最新のデプロイ（一番上）を探す
   - 右側の **「...」**（3つの点）メニューをクリック
   - **「Redeploy」** を選択
   - 確認ダイアログで **「Redeploy」** をクリック

3. **デプロイ完了を待つ**
   - 通常1〜3分で完了
   - ステータスが「Ready」になるまで待つ

---

### ステップ3: 動作確認

1. **公開UIを確認**
   - https://space-mood-oracle.vercel.app にアクセス
   - ページが正常に表示されるか確認

2. **開発者ツールで確認（F12）**
   - **Console タブ**: エラーが出ていないか確認
   - **Network タブ**: APIリクエストを確認
     - リクエストURLが `https://space-mood-oracle.onrender.com/api/trpc/...` になっているか確認
     - リクエストが成功（200 OK）しているか確認

3. **エラーの確認**
   - 「データ取得エラー」が表示されないか確認
   - 「まだ十分なデータが集まっていません」が表示される場合は、データ投入が必要（次のステップ4を参照）

---

### ステップ4: 初期データの投入（データが表示されない場合）

公開UIで「まだ十分なデータが集まっていません」と表示される場合：

1. **メンテUIにアクセス**
   - https://space-mood-oracle.vercel.app/lab にアクセス

2. **実データ取得（NOAA）**
   - 「実データ取得（NOAA）」ボタンをクリック
   - 今日の宇宙天気データを取得

3. **宇宙モデル更新**
   - 「宇宙モデル更新」ボタンをクリック
   - 過去90日分のデータで推論モデルを学習
   - ※ もし「学習データが不足しています」と表示された場合:
     - 過去の集合意識データ（Hacker Newsの感情スコア）が必要
     - CSVアップロードまたは `get-hn-mood.py` スクリプトで過去データを取得

4. **公開UIを再確認**
   - https://space-mood-oracle.vercel.app に戻る
   - データが表示されるか確認

---

## 🔍 トラブルシューティング

### 問題1: 環境変数を設定したが、APIリクエストが失敗する

**確認事項:**
- [ ] Vercel側で環境変数が正しく設定されているか（Settings → Environment Variables）
- [ ] Redeployを実行したか（環境変数を追加しただけでは反映されない）
- [ ] ブラウザの開発者ツール（F12）→ Network タブで、APIリクエストのURLを確認
  - `https://space-mood-oracle.onrender.com/api/trpc/...` になっているか？

**解決方法:**
- 環境変数が正しく設定されていることを確認
- Redeployを実行
- ブラウザのキャッシュをクリア（Ctrl+Shift+R または Cmd+Shift+R）

---

### 問題2: CORSエラーが発生する

**エラーメッセージ例:**
```
Access to fetch ... has been blocked by CORS policy
```

**確認事項:**
- [ ] Render側の `CORS_ORIGIN` 環境変数が正しく設定されているか
  - 値: `https://space-mood-oracle.vercel.app`

**解決方法:**
1. Renderダッシュボード → `space-mood-oracle` サービス → Environment タブ
2. `CORS_ORIGIN` を確認
3. 設定されていない、または間違っている場合:
   - `CORS_ORIGIN` = `https://space-mood-oracle.vercel.app` を追加
   - Manual Deploy を実行

---

### 問題3: 「まだ十分なデータが集まっていません」と表示される

**原因:**
- データベースに初期データが入っていない

**解決方法:**
- ステップ4の「初期データの投入」を実行

---

## 📊 チェックリスト

作業を進める際に、以下を確認してください:

- [ ] **Vercel側で環境変数を設定**
  - Key: `VITE_API_BASE_URL`
  - Value: `https://space-mood-oracle.onrender.com`
  - Environment: Production, Preview, Development すべてにチェック

- [ ] **VercelでRedeployを実行**
  - Deployments タブ → 最新デプロイ → Redeploy

- [ ] **公開UIが表示される**
  - https://space-mood-oracle.vercel.app にアクセス
  - エラーが出ていないか確認

- [ ] **APIリクエストが正常に送信される**
  - 開発者ツール（F12）→ Network タブ
  - リクエストURLが `https://space-mood-oracle.onrender.com/api/trpc/...` になっているか確認

- [ ] **データが表示される（または適切なメッセージが表示される）**
  - データがある場合: 推定スコア、宇宙天気データが表示される
  - データがない場合: 「まだ十分なデータが集まっていません」が表示される

---

## 🎯 最終ゴール

すべてのステップが完了すると：

1. ✅ 公開UI（`https://space-mood-oracle.vercel.app`）が正常に表示される
2. ✅ APIリクエストが正常に送信される
3. ✅ データが表示される（または適切なメッセージが表示される）
4. ✅ メンテUI（`https://space-mood-oracle.vercel.app/lab`）が正常に動作する

---

**次のステップ: Vercel側で環境変数を設定してください！** 🚀

