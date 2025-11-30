# 📦 GitHubリポジトリ作成とプッシュ手順

## 📋 プロジェクトの場所

**プロジェクトルート**: `H:\AI_study\228_宇宙パワー_V1\space_mood_oracle_v2.1\space_mood_oracle`

このディレクトリに `package.json` があります。

---

## 🎯 推奨: プロジェクトルートをGitリポジトリにする

**Gitリポジトリのルート**: `space_mood_oracle_v2.1\space_mood_oracle`

**理由:**
- ✅ `package.json` がある場所
- ✅ Renderの設定が簡単（Root Directory指定不要）
- ✅ プロジェクトのみが含まれる

---

## 📋 手順

### ステップ1: GitHubでリポジトリを作成

1. **GitHubにアクセス**
   - https://github.com/ にアクセス
   - ログイン

2. **新しいリポジトリを作成**
   - 右上の「+」→「New repository」をクリック
   - または、https://github.com/new にアクセス

3. **リポジトリ設定**
   - **Repository name**: `space-mood-oracle`（任意）
   - **Description**: 任意（例: "Space Mood Oracle - 宇宙の意思"）
   - **Public** または **Private** を選択
   - **⚠️ 重要**: 「Initialize this repository with a README」は**チェックしない**（既存のプロジェクトをプッシュするため）

4. **「Create repository」をクリック**

### ステップ2: プロジェクトディレクトリに移動

```bash
cd H:\AI_study\228_宇宙パワー_V1\space_mood_oracle_v2.1\space_mood_oracle
```

または、PowerShellで：

```powershell
cd "H:\AI_study\228_宇宙パワー_V1\space_mood_oracle_v2.1\space_mood_oracle"
```

### ステップ3: Git初期化

```bash
git init
```

### ステップ4: ファイルを追加

```bash
git add .
```

### ステップ5: 初回コミット

```bash
git commit -m "Initial commit: Space Mood Oracle v2.1"
```

### ステップ6: GitHubにプッシュ

1. **リモートリポジトリを追加**

```bash
git remote add origin https://github.com/YOUR_USERNAME/space-mood-oracle.git
```

**注意**: `YOUR_USERNAME` を自分のGitHubユーザー名に置き換えてください。

2. **ブランチ名をmainに変更（必要なら）**

```bash
git branch -M main
```

3. **プッシュ**

```bash
git push -u origin main
```

**注意**: 初回は認証が必要です。GitHubのユーザー名とパスワード（またはPersonal Access Token）を入力します。

---

## 📝 コマンドまとめ（プロジェクトルート）

```bash
# 1. プロジェクトディレクトリに移動
cd "H:\AI_study\228_宇宙パワー_V1\space_mood_oracle_v2.1\space_mood_oracle"

# 2. Git初期化
git init

# 3. ファイルを追加
git add .

# 4. 初回コミット
git commit -m "Initial commit: Space Mood Oracle v2.1"

# 5. リモートリポジトリを追加
git remote add origin https://github.com/YOUR_USERNAME/space-mood-oracle.git

# 6. ブランチ名をmainに変更（必要なら）
git branch -M main

# 7. プッシュ
git push -u origin main
```

---

## 🔄 代替案: 一つ上のディレクトリをリポジトリにする場合

もし `H:\AI_study\228_宇宙パワー_V1` をGitリポジトリにする場合:

### メリット
- ✅ 引継ぎサマリー.txtも含められる
- ✅ プロジェクト全体を管理できる

### デメリット
- ❌ RenderでRoot Directoryを指定する必要がある（`space_mood_oracle_v2.1/space_mood_oracle`）
- ❌ 不要なファイル（zipファイルなど）も含む可能性

### 手順（一つ上の場合）

```bash
# 1. 一つ上のディレクトリに移動
cd "H:\AI_study\228_宇宙パワー_V1"

# 2. Git初期化
git init

# 3. .gitignoreに除外するファイルを追加（必要なら）
# space_mood_oracle_v2.1.zip など

# 4. ファイルを追加
git add .

# 5. コミット
git commit -m "Initial commit"

# 6. リモート追加
git remote add origin https://github.com/YOUR_USERNAME/space-mood-oracle.git

# 7. プッシュ
git push -u origin main
```

**Render設定**:
- Root Directory: `space_mood_oracle_v2.1/space_mood_oracle`

---

## 💡 推奨

**プロジェクトルート（`space_mood_oracle_v2.1\space_mood_oracle`）をGitリポジトリにすることを推奨します。**

理由:
- ✅ Renderの設定が簡単
- ✅ プロジェクトのみが含まれる
- ✅ 一般的な構成

---

## 🔐 GitHub認証

### Personal Access Token（推奨）

パスワードの代わりにPersonal Access Tokenを使用する場合:

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. 「Generate new token」をクリック
3. 必要な権限を選択（`repo` など）
4. トークンを生成してコピー
5. プッシュ時にパスワードの代わりにトークンを使用

---

## ✅ 確認

プッシュ後、GitHubのリポジトリページを開いて確認:

1. ✅ ファイルが表示されている
2. ✅ コミット履歴が表示されている
3. ✅ ブランチが `main` になっている
4. ✅ `package.json` がリポジトリのルートにある

---

## 🚀 次のステップ

GitHubにプッシュ完了後:

1. ✅ RenderでWebサービスを作成
2. ✅ リポジトリを選択
3. ✅ **Root Directory**: （プロジェクトルートをリポジトリにした場合）空欄、または（一つ上をリポジトリにした場合）`space_mood_oracle_v2.1/space_mood_oracle`
4. ✅ デプロイ開始

---

## ⚠️ 注意事項

### .envファイルはコミットしない

`.env` ファイルは `.gitignore` に含まれているので、自動的に除外されます。

### 接続文字列の取り扱い

接続文字列を含むファイル（`【完成】接続文字列.env` など）は:
- **GitHubにコミットしない**
- Renderの環境変数に直接設定する

---

## 🆘 トラブルシューティング

### エラー: "remote origin already exists"

```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/space-mood-oracle.git
```

### エラー: "failed to push some refs"

```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

---

**GitHubにプッシュして、Renderでデプロイしましょう！** 🚀
