# Vercel環境変数 - Environment選択の詳しい説明

## 📋 重要: RenderとVercelの違い

**添付画像はRenderの画面ですが、今回の作業はVercelで行います。**

- **Render**: バックエンドAPIサーバー（`https://space-mood-oracle.onrender.com`）
- **Vercel**: フロントエンド（`https://space-mood-oracle.vercel.app`）

今回設定する `VITE_API_BASE_URL` は **Vercel側** に設定します。

---

## 🎯 Vercelの3つのEnvironment（環境）とは

Vercelには、デプロイ先として**3つの環境**があります。環境変数をどの環境で使うか指定できます。

### 1. Production（本番環境）

- **用途**: ユーザーに公開される最終バージョン
- **URL**: `https://space-mood-oracle.vercel.app`
- **タイミング**: `main` ブランチへのプッシュ時に自動デプロイ
- **特徴**: 最も安定した環境、本番データを使用

**この環境にチェックを入れる理由:**
- 公開UIが本番環境で正しく動作するため
- 本番環境のフロントエンドからRenderのAPIを呼び出すため

---

### 2. Preview（プレビュー環境）

- **用途**: プルリクエストやブランチごとのプレビュー
- **URL**: `https://space-mood-oracle-xxx.vercel.app`（ランダムなサブドメイン）
- **タイミング**: 
  - プルリクエスト作成時
  - `main` 以外のブランチにプッシュ時
- **特徴**: 変更内容を本番前に確認できる

**この環境にチェックを入れる理由:**
- プレビュー環境でもAPIが正常に動作するようにするため
- 開発中の変更をテストする際、同じAPI URLを使うため

---

### 3. Development（開発環境）

- **用途**: ローカル開発環境（`vercel dev` コマンド使用時）
- **URL**: `http://localhost:3000`（ローカル）
- **タイミング**: `vercel dev` コマンドを実行した時
- **特徴**: ローカルで開発しながらVercelの機能をテストできる

**この環境にチェックを入れる理由:**
- ローカル開発時にも同じAPI URLを使えるようにするため
- 開発環境と本番環境で一貫した動作を保証するため

---

## ✅ なぜ3つすべてにチェックを入れるのか

### 理由1: 一貫した動作の保証

3つすべてにチェックを入れることで、**どの環境でも同じAPI URL**（`https://space-mood-oracle.onrender.com`）が使われます。

```
Production   → https://space-mood-oracle.onrender.com ✅
Preview      → https://space-mood-oracle.onrender.com ✅
Development  → https://space-mood-oracle.onrender.com ✅
```

### 理由2: 環境による動作の違いを避ける

もし1つだけにチェックを入れると：

**❌ Productionだけチェックした場合:**
- 本番環境: APIが動作する ✅
- プレビュー環境: APIが動作しない ❌（環境変数が未定義）
- 開発環境: APIが動作しない ❌（環境変数が未定義）

**❌ Previewだけチェックした場合:**
- 本番環境: APIが動作しない ❌（環境変数が未定義）
- プレビュー環境: APIが動作する ✅
- 開発環境: APIが動作しない ❌（環境変数が未定義）

### 理由3: トラブルシューティングが簡単

すべての環境で同じ設定を使うことで、**環境によるバグの発生を防ぎ**、デバッグが簡単になります。

---

## 📸 Vercelでの設定画面イメージ

Vercelの環境変数設定画面では、以下のようなチェックボックスが表示されます：

```
Key:   VITE_API_BASE_URL
Value: https://space-mood-oracle.onrender.com

Environment: （複数選択可）
☑ Production
☑ Preview  
☑ Development
```

**この3つすべてにチェックを入れます。**

---

## 🎯 実際の設定手順（Vercel）

### ステップ1: Vercelダッシュボードを開く

1. https://vercel.com にアクセス
2. ログイン
3. `space-mood-oracle` プロジェクトを選択

### ステップ2: 環境変数設定画面を開く

1. 上部メニューの **「Settings」** をクリック
2. 左サイドバーの **「Environment Variables」** をクリック

### ステップ3: 環境変数を追加

1. **「Key」** に `VITE_API_BASE_URL` を入力
2. **「Value」** に `https://space-mood-oracle.onrender.com` を入力
3. **「Environment」** セクションで、以下3つすべてにチェックを入れる：
   - ☑ **Production**
   - ☑ **Preview**
   - ☑ **Development**

   **重要**: チェックボックスは複数選択できます。3つすべてを選択してください。

4. **「Add」** または **「Save」** ボタンをクリック

### ステップ4: 確認

環境変数一覧に、以下のように表示されます：

```
VITE_API_BASE_URL
https://space-mood-oracle.onrender.com
Production, Preview, Development
```

「Production, Preview, Development」と表示されていれば、3つすべてに適用されています。

---

## ⚠️ よくある間違い

### ❌ 間違い1: 1つだけチェックする

```
☑ Production
☐ Preview
☐ Development
```

**問題**: プレビューや開発環境でAPIが動作しない

### ❌ 間違い2: Environmentの意味を理解していない

「Environment」は「どの環境でこの環境変数を使うか」を指定するもの。複数選択可能です。

### ✅ 正しい設定

```
☑ Production
☑ Preview
☑ Development
```

**すべてにチェックを入れることで、どの環境でも同じAPI URLが使われます。**

---

## 🔍 確認方法

### 方法1: Vercelダッシュボードで確認

1. Settings → Environment Variables
2. `VITE_API_BASE_URL` の行を確認
3. 「Production, Preview, Development」と表示されているか確認

### 方法2: デプロイ後に確認

1. ブラウザの開発者ツール（F12）を開く
2. Console タブで確認
3. Network タブで、APIリクエストのURLを確認
4. `https://space-mood-oracle.onrender.com/api/trpc/...` に送信されているか確認

---

## 📚 参考情報

### 各環境で環境変数を使い分けたい場合

もし環境ごとに異なるAPI URLを使いたい場合：

**Production用:**
```
Key: VITE_API_BASE_URL
Value: https://space-mood-oracle.onrender.com
Environment: ☑ Production のみ
```

**Preview用:**
```
Key: VITE_API_BASE_URL
Value: https://space-mood-oracle-preview.onrender.com
Environment: ☑ Preview のみ
```

しかし、今回のケースでは**RenderのAPI URLは1つだけ**なので、3つすべてに同じ値を設定するのが正解です。

---

**まとめ: Production、Preview、Development の3つすべてにチェックを入れることで、どの環境でも同じAPI URLが使われ、一貫した動作が保証されます！** ✅

