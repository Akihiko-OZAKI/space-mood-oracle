# データベース名統一: Renderを `test` に合わせる

## 🎯 推奨: Renderのデータベース名を `test` に変更

ローカル環境が既に `test` データベースで動作しているので、**Renderも `test` に統一する**のが最も簡単です。

---

## 📋 手順

### ステップ1: RenderのEnvironmentタブを開く

1. Renderダッシュボード → `space-mood-oracle` サービス
2. **Environment** タブをクリック

---

### ステップ2: DATABASE_URLを編集

1. `DATABASE_URL` の行を探す
2. 値をクリックして編集モードにする
3. 現在の値:
   ```
   mysql://2iZ5PoqMuT8TqCD.root:MerKdDQuP3300ei6@gateway01.ap-northeast-1.prod.aws.tidbcloud.com:4000/space_mood_oracle?ssl-mode=REQUIRED
   ```
4. `/space_mood_oracle` を `/test` に変更:
   ```
   mysql://2iZ5PoqMuT8TqCD.root:MerKdDQuP3300ei6@gateway01.ap-northeast-1.prod.aws.tidbcloud.com:4000/test?ssl-mode=REQUIRED
   ```
5. **Save Changes** をクリック

---

### ステップ3: Manual Deploy（手動デプロイ）

1. 上部メニューの **「Manual Deploy」** をクリック
2. **「Deploy latest commit」** を選択
3. デプロイが完了するまで待つ（通常1〜3分）

---

### ステップ4: 動作確認

1. 公開UIにアクセス: https://space-mood-oracle.vercel.app
2. エラーが解消されたか確認
3. データが表示されるか確認（または「まだ十分なデータが集まっていません」と表示されるか確認）

---

## ✅ 確認

変更後、Renderのログで以下を確認：

```
[Database] Initializing MySQL pool with TLS to mysql://gateway01.ap-northeast-1.prod.aws.tidbcloud.com:4000/test
[Database] Connection object created successfully.
```

データベース名が `/test` になっていることを確認してください。

---

**RenderのDATABASE_URLを `/test` に変更してください！** 🚀

