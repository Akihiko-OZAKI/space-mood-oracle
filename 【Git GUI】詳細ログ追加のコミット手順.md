# Git GUI: 詳細ログ追加のコミット手順

## 📝 変更内容

データベース接続とテーブル確認の詳細ログを追加しました。

**変更ファイル:**
- `space_mood_oracle_v3/server/db.ts`
- `space_mood_oracle_v3/server/realSpaceWeather.ts`

---

## 🔧 Git GUIでのコミット手順

### 1. Git GUIを開く

```bash
cd H:\AI_study\228_宇宙パワー_V1\space-mood-oracle
git gui
```

または、エクスプローラーで `space-mood-oracle` フォルダを右クリック → **Git GUI Here**

---

### 2. 変更をステージング

1. **「Unstaged Changes」セクション**で、以下のファイルを見つける：
   - `space_mood_oracle_v3/server/db.ts`
   - `space_mood_oracle_v3/server/realSpaceWeather.ts`

2. 各ファイルを**右クリック** → **「Stage to Commit」**

   （または、ファイルを選択して**「Stage Changed」ボタン**をクリック）

3. **「Staged Changes」セクション**に移動したことを確認

---

### 3. コミットメッセージを入力

**「Commit Message」欄**に以下を入力：

```
Add detailed database logging for debugging

- Add database name, host, port, user logging in db.ts
- Add SELECT DATABASE() and SHOW TABLES queries to verify connection
- Add detailed table verification logs in realSpaceWeather.ts
- Add ⭐ markers to key diagnostic logs for easy searching
- Improve error logging with full error details
```

---

### 4. コミット

**「Commit」ボタン**をクリック

---

### 5. プッシュ

1. **「Push」ボタン**をクリック
2. 確認ダイアログで**「Push」**をクリック

---

## ✅ 確認

プッシュが完了すると、Renderが自動的に再デプロイを開始します。

**次のステップ:**
1. Renderの**Eventsタブ**でデプロイが完了するのを待つ
2. Renderの**Logsタブ**で、⭐マークが付いたログを確認
3. `[Database] ⭐ Current database (from SELECT DATABASE()):` が表示されることを確認
4. `[Database] ⭐ Available tables in database:` が表示されることを確認


