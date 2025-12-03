# 🔗 TiDB Cloud 接続情報

## 📋 取得した接続情報

```
Host: YOUR_HOST.tidbcloud.com
Port: 4000
User: YOUR_USERNAME
Database: fortune500 → space_mood_oracle に変更
Password: 設定が必要
```

---

## ⚠️ 重要な注意点

### 1. データベース名の変更

接続文字列では、`fortune500` の代わりに `space_mood_oracle` を使用してください。

### 2. パスワードの設定

パスワードが設定されていない場合は、設定する必要があります。

---

## 🔑 パスワードの設定方法

### TiDB Cloudダッシュボードから

1. cluster0 を開く
2. 「Connect」タブを開く
3. 「Password」セクションで設定
4. または、「Generate Password」で自動生成

**重要**: パスワードは一度しか表示されません。必ずコピーして安全に保管してください。

---

## 🔗 接続文字列の形式

### パスワード設定後

```
mysql://YOUR_USERNAME:YOUR_PASSWORD@YOUR_HOST.tidbcloud.com:4000/space_mood_oracle?ssl-mode=REQUIRED
```

### 個別パラメータ

```env
DATABASE_URL=mysql://YOUR_USERNAME:YOUR_PASSWORD@YOUR_HOST.tidbcloud.com:4000/space_mood_oracle?ssl-mode=REQUIRED
```

---

## ✅ 完成した接続文字列の例

パスワードを `mypassword123` に設定した場合:

```env
DATABASE_URL=mysql://YOUR_USERNAME:YOUR_PASSWORD@YOUR_HOST.tidbcloud.com:4000/space_mood_oracle?ssl-mode=REQUIRED
```

---

## 📝 次のステップ

1. ✅ パスワードを設定
2. ✅ 接続文字列を組み立てる
3. ✅ Renderの環境変数に設定
4. ✅ デプロイ

---

**パスワードを設定して、接続文字列を完成させましょう！** 🔐


