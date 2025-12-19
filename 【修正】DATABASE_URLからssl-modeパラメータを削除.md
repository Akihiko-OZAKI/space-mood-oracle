# 修正: DATABASE_URLからssl-modeパラメータを削除

## 🔧 変更内容

Renderの `DATABASE_URL` 環境変数から `?ssl-mode=REQUIRED` パラメータを削除します。

**理由:**
- コードでは `ssl` オプションを明示的に設定しているため、URLパラメータは不要
- パラメータが混乱の原因になる可能性がある

---

## 📋 手順

### 1. Renderダッシュボードで環境変数を編集

1. **Renderダッシュボード**にアクセス
   - https://dashboard.render.com/
   - `space-mood-oracle` サービスを開く

2. **Environmentタブ**を開く

3. **`DATABASE_URL` 環境変数**の右側の**「Edit」ボタン**をクリック

4. **現在の値:**
   ```
   mysql://...@gateway01.ap-northeast-1.prod.aws.tidbcloud.com:4000/test?ssl-mode=REQUIRED
   ```

5. **修正後の値:**
   ```
   mysql://...@gateway01.ap-northeast-1.prod.aws.tidbcloud.com:4000/test
   ```
   （`?ssl-mode=REQUIRED` の部分を削除）

6. **「Save Changes」ボタン**をクリック

---

### 2. 再デプロイ

環境変数を変更すると、Renderが自動的に再デプロイを開始します。

- **Eventsタブ**で、最新のデプロイが **"Live"** になるまで待つ

---

### 3. 再度「実データ取得」を実行

1. **Vercelの `/lab` ページ**にアクセス
   - https://space-mood-oracle.vercel.app/lab

2. **「実データ取得（NOAA）」ボタンをクリック**

3. **RenderのLogsタブで確認**
   - `[Database] ⭐ SHOW TABLES raw result:` を確認
   - テーブルが正しく表示されるか確認

---

## ✅ 確認ポイント

- [ ] `DATABASE_URL` から `?ssl-mode=REQUIRED` を削除
- [ ] 再デプロイが完了
- [ ] 「実データ取得」を実行
- [ ] `SHOW TABLES` の結果が正しく表示される

---

**まず、Renderの `DATABASE_URL` 環境変数から `?ssl-mode=REQUIRED` を削除してください！** 🔧


