# データベース名確認: ローカルとRenderで同じDB名か確認

## 🔍 確認すべきこと

ローカル環境とRender環境で、**同じデータベース名**を使っているか確認してください。

---

## 📋 確認手順

### ステップ1: ローカル環境のデータベース名を確認

ローカルの `.env` ファイルまたは環境変数を確認：

```env
DATABASE_URL=mysql://...@gateway01.ap-northeast-1.prod.aws.tidbcloud.com:4000/????
```

**`/` の後ろの部分がデータベース名です。**

例：
- `/space_mood_oracle` → データベース名: `space_mood_oracle`
- `/test` → データベース名: `test`

---

### ステップ2: Render環境のデータベース名を確認

Renderダッシュボード → `space-mood-oracle` サービス → Environment タブ

`DATABASE_URL` の値を確認：
```
mysql://...@gateway01.ap-northeast-1.prod.aws.tidbcloud.com:4000/space_mood_oracle?ssl-mode=REQUIRED
```

データベース名は `space_mood_oracle` になっているはずです。

---

### ステップ3: 比較

| 環境 | データベース名 |
|------|---------------|
| ローカル | `???` （確認が必要） |
| Render | `space_mood_oracle` |

---

## 🎯 もしデータベース名が違う場合

### ケース1: ローカルが `test`、Renderが `space_mood_oracle`

**問題:**
- ローカルでは `test` データベースのテーブルを使っていた
- Renderでは `space_mood_oracle` データベースに接続している
- `space_mood_oracle` データベースにはテーブルが存在しない

**解決方法:**
1. TiDB Cloudで `space_mood_oracle` データベースにテーブルを作成
2. または、Renderの `DATABASE_URL` を `test` に変更（ローカルと同じにする）

### ケース2: 両方とも `space_mood_oracle`

**問題:**
- データベース名は同じ
- テーブルは存在しているはず
- しかし、クエリが失敗している

**考えられる原因:**
1. **エラーがログに出力されていない**（try-catchで捕捉されていない）
2. **データが存在しない**（これはエラーではなく、空の結果を返すはず）
3. **タイムゾーンの問題**（日付の比較で問題が発生している可能性）

---

## 🔍 次のステップ

### データベース名が同じ場合

1. **実際のエラーメッセージを確認**
   - フロントエンドのコンソールエラーをもう一度確認
   - エラーメッセージの詳細を見る

2. **データベースのテーブルとデータを確認**
   - TiDB CloudのSQL Editorで確認
   ```sql
   USE space_mood_oracle;
   SHOW TABLES;
   SELECT * FROM predictions LIMIT 5;
   SELECT * FROM space_weather_data LIMIT 5;
   ```

3. **Renderのログをもう一度確認**
   - エラーが発生した**直後**のログを確認
   - タイムスタンプを見て、エラー発生時刻を特定

### データベース名が違う場合

1. どちらかに統一する
2. テーブルが存在しないデータベースにテーブルを作成する

---

**まず、ローカル環境のデータベース名を確認してください！** 🔍

