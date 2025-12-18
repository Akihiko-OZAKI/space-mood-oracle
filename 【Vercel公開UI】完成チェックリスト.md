# Vercel公開UI 完成チェックリスト

## ✅ 完了済み
- [x] 公開UI（`Public.tsx`）の作成
- [x] `/lab`ルートの設定（`vercel.json`）
- [x] エラーハンドリングの改善
- [x] Render APIのデプロイ完了

## 🔧 確認・設定が必要な項目

### 1. Vercelの環境変数設定

**必須環境変数:**
```
VITE_API_BASE_URL=https://space-mood-oracle.onrender.com
```

**設定手順:**
1. Vercelダッシュボード（https://vercel.com/dashboard）にアクセス
2. `space-mood-oracle`プロジェクトを選択
3. **Settings** → **Environment Variables** を開く
4. 以下の環境変数を追加:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: `https://space-mood-oracle.onrender.com`
   - **Environment**: `Production`, `Preview`, `Development` すべてにチェック
5. **Save** をクリック
6. **Deployments** タブに戻り、最新のデプロイを **Redeploy** する

### 2. RenderのCORS設定確認

**Render環境変数:**
```
CORS_ORIGIN=https://space-mood-oracle.vercel.app
```

**確認手順:**
1. Renderダッシュボード（https://dashboard.render.com）にアクセス
2. `space-mood-oracle`サービスを選択
3. **Environment** タブを開く
4. `CORS_ORIGIN` が `https://space-mood-oracle.vercel.app` に設定されているか確認
5. 設定されていない場合は追加して **Save Changes** → **Manual Deploy**

### 3. データベースの初期データ投入

**手順:**
1. ブラウザで `https://space-mood-oracle.vercel.app/lab` を開く
2. **「実データ取得（NOAA）」** ボタンをクリック
   - 今日の宇宙天気データを取得
3. **「宇宙モデル更新」** ボタンをクリック
   - 過去90日分のデータで推論モデルを学習
   - ただし、この時点で過去の集合意識データ（Hacker Newsの感情スコア）が必要
4. もし「学習データが不足しています」と表示された場合:
   - 過去の日別ムードCSVをアップロードするか
   - または、`get-hn-mood.py`スクリプトで過去データを取得

### 4. 動作確認

**公開UI（`https://space-mood-oracle.vercel.app/`）:**
- [ ] ページが正常に表示される
- [ ] 「宇宙だけから見た今日の集合意識」カードが表示される
- [ ] データがない場合は「まだ十分なデータが集まっていません」と表示される
- [ ] データがある場合は、推定スコアと信頼度が表示される
- [ ] 今日の宇宙天気（Kp指数、フレア回数）が表示される
- [ ] グラフ（過去30日分）が表示される（データがある場合）
- [ ] 「このサイトが示していること」セクションが表示される

**メンテUI（`https://space-mood-oracle.vercel.app/lab`）:**
- [ ] ダッシュボードが表示される
- [ ] 「実データ取得（NOAA）」ボタンが動作する
- [ ] 「宇宙モデル更新」ボタンが動作する
- [ ] エラーメッセージが適切に表示される

### 5. トラブルシューティング

**問題: 公開UIで「データ取得エラー」が表示される**
- Vercelの環境変数 `VITE_API_BASE_URL` が正しく設定されているか確認
- RenderのAPIが起動しているか確認（https://space-mood-oracle.onrender.com/api/trpc/oracle.getTodayFortune）
- ブラウザの開発者ツール（F12）でNetworkタブを確認し、APIリクエストのエラーを確認

**問題: CORSエラーが発生する**
- Renderの `CORS_ORIGIN` が `https://space-mood-oracle.vercel.app` に設定されているか確認
- ブラウザのコンソールでエラーメッセージを確認

**問題: 「まだ十分なデータが集まっていません」と表示される**
- `/lab` ページから「実データ取得（NOAA）」を実行
- 過去の集合意識データが必要な場合は、CSVアップロードまたは `get-hn-mood.py` を実行

## 📝 次のステップ

1. Vercelの環境変数を設定
2. RenderのCORS設定を確認
3. 初期データを投入
4. 公開UIで動作確認
5. 必要に応じて、自動データ取得のスケジュール設定（Render Cron Jobsなど）

