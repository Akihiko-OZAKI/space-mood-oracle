# 根本解決: DATABASE_URL再設定手順

## 🔍 問題の核心

- TiDB Cloudでは `test` データベースに8つのテーブルが存在することを確認済み
- Renderからは `SHOW TABLES` の結果が空配列 `[]`
- `SELECT DATABASE()` の結果は `test` で正しい

**結論**: Renderが接続しているデータベースと、TiDB Cloudで確認したデータベースが**異なる可能性が高い**です。

---

## 🔧 解決方法

### 1. TiDB Cloudで接続文字列を再生成

1. **TiDB Cloudダッシュボード**にアクセス
   - https://tidbcloud.com/

2. **クラスタを選択**

3. **「Connect」ボタンをクリック**

4. **「Connect your app」を選択**

5. **「Connection String」をコピー**
   - 形式: `mysql://ユーザー名:パスワード@ホスト:ポート/データベース名`

6. **データベース名部分を `/test` に変更**
   - 例: `mysql://...@gateway01.ap-northeast-1.prod.aws.tidbcloud.com:4000/test`

---

### 2. Renderの `DATABASE_URL` 環境変数を更新

1. **Renderダッシュボード** → `space-mood-oracle` サービス

2. **Environmentタブ**を開く

3. **`DATABASE_URL` 環境変数**の右側の**「Edit」ボタン**をクリック

4. **新しい接続文字列を貼り付け**
   - TiDB Cloudで再生成した接続文字列を使用
   - データベース名部分が `/test` になっていることを確認
   - `?ssl-mode=REQUIRED` パラメータは**削除**（コードで明示的に設定しているため）

5. **「Save Changes」ボタン**をクリック

---

### 3. 再デプロイを待つ

- 環境変数を変更すると、Renderが自動的に再デプロイを開始します
- Eventsタブで、最新のデプロイが **"Live"** になるまで待つ

---

### 4. 再度「実データ取得」を実行

1. **Vercelの `/lab` ページ**にアクセス
   - https://space-mood-oracle.vercel.app/lab

2. **「実データ取得（NOAA）」ボタンをクリック**

---

### 5. RenderのLogsタブで確認

以下のログが表示されるはずです：

```
[Database] ⭐ Current database (from SELECT DATABASE()): test
[Database] ⭐ SHOW TABLES raw result: [8つのテーブルが表示される]
[Database] ⭐ Table count: 8
[Database] ⭐ space_weather_data exists? true
```

---

## ✅ 確認ポイント

1. **接続文字列のデータベース名部分が `/test` になっているか**
2. **`?ssl-mode=REQUIRED` パラメータが削除されているか**
3. **再デプロイが完了しているか**
4. **`SHOW TABLES` の結果に8つのテーブルが表示されるか**

---

**まず、TiDB Cloudで接続文字列を再生成して、Renderの `DATABASE_URL` を更新してください！** 🔧

