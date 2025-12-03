# 🔧 Gitインストールとコミット方法

## 現在の状況

Cursorで「download Git for Windows ボタン」が表示される = **Gitがインストールされていないか、Cursorが認識していない状態**

---

## 🎯 解決方法（2つの選択肢）

### 方法A: Git for Windowsをインストール（推奨）⭐

1. **「download Git for Windows」ボタンをクリック**
   - Cursorが表示しているボタンをクリック

2. **インストーラーを実行**
   - ダウンロードされたファイルを実行
   - 基本的には「Next」を押し続けてOK
   - デフォルト設定で問題ありません

3. **Cursorを再起動**
   - Gitインストール後、Cursorを一度閉じて再起動

4. **再度 `Ctrl+Shift+G` を押す**
   - 今度はソース管理パネルが開くはずです

### 方法B: GitHub Desktopを使用（簡単）✨

GitHub Desktopは、Gitコマンドを知らなくても使えるGUIツールです。

#### ステップ1: GitHub Desktopをインストール

1. https://desktop.github.com/ にアクセス
2. 「Download for Windows」をクリック
3. インストーラーを実行

#### ステップ2: GitHub Desktopでコミット・プッシュ

1. **GitHub Desktopを起動**
2. **リポジトリを追加**
   - 「File」→「Add Local Repository」
   - フォルダを選択：`H:\AI_study\228_宇宙パワー_V1\space_mood_oracle_v2.1\space_mood_oracle`

3. **変更を確認**
   - 左側に「8 changed files」と表示されます

4. **コミットメッセージを入力**
   - 下部のテキストボックスに：
   ```
   🔒 セキュリティ修正: 接続文字列から実際の認証情報を削除
   
   - 実際のDB接続文字列（パスワード含む）をプレースホルダーに置換
   - .gitignoreに*.envパターンを追加して.envファイルを保護
   - GitHubの警告に対応
   - TiDB Cloudのパスワードをリセットして無効化
   - Renderの環境変数を新しいパスワードに更新
   ```

5. **「Commit to main」をクリック**
   - または「Commit to master」（ブランチ名による）

6. **「Push origin」をクリック**
   - 上部のツールバーに「Push origin」ボタンがあります

---

## 🚀 最も簡単な方法（GitHub Desktop）

### 詳細手順

1. **GitHub Desktopをダウンロード・インストール**
   - https://desktop.github.com/
   - インストールは自動で進みます

2. **GitHub Desktopでリポジトリを開く**
   - 「File」→「Add Local Repository」
   - または、既に追加されている場合は自動的に表示されます

3. **変更を確認**
   - 左側の「Changes」タブに8つのファイルが表示されます
   - すべて自動的に選択されています

4. **コミット**
   - 下部の「Summary」にコミットメッセージを入力
   - 「Commit to main」をクリック

5. **プッシュ**
   - 上部の「Push origin」をクリック
   - 完了！

---

## 📝 コミットメッセージ（コピー用）

```
🔒 セキュリティ修正: 接続文字列から実際の認証情報を削除

- 実際のDB接続文字列（パスワード含む）をプレースホルダーに置換
- .gitignoreに*.envパターンを追加して.envファイルを保護
- GitHubの警告に対応
- TiDB Cloudのパスワードをリセットして無効化
- Renderの環境変数を新しいパスワードに更新
```

---

## ⚡ 今すぐやること

**推奨：GitHub Desktopを使用**
- 最も簡単で視覚的
- コマンドを覚える必要がない
- インストールが簡単

**手順：**
1. https://desktop.github.com/ を開く
2. ダウンロード・インストール
3. リポジトリを追加
4. コミット・プッシュ

---

## 💡 補足：Git for Windowsをインストールする場合

もしコマンドラインからGitを使いたい場合：

1. Cursorの「download Git for Windows」ボタンをクリック
2. インストーラーを実行
3. **インストール設定で「Git from the command line and also from 3rd-party software」を選択**
4. その他はデフォルトでOK
5. Cursorを再起動

その後、`Ctrl+Shift+G` でソース管理パネルが開くようになります。

---

**最も簡単なのは、GitHub Desktopを使う方法です！** ✨

