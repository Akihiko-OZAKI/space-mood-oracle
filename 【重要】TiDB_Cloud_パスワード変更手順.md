# 🔑 TiDB Cloud パスワード変更手順

## 📍 パスワード変更の場所

**Firewall設定ではなく、「Connect」タブから変更します！**

---

## 🎯 手順（ステップバイステップ）

### ステップ1: TiDB Cloudダッシュボードにログイン

1. https://tidbcloud.com/ にアクセス
2. アカウントでログイン

### ステップ2: クラスターを開く

1. ダッシュボードから **`cluster0`** をクリック
   - （またはあなたのクラスター名）

### ステップ3: 「Connect」タブを開く

1. クラスターの詳細ページが開きます
2. **上部のタブ**から **「Connect」** をクリック
   - Overview / Connect / SQL Editor / ... というタブが並んでいます

### ステップ4: パスワードを変更

**「Connect」タブ内で以下を探してください：**

#### 方法A: 「Password」セクションがある場合

1. **「Password」セクション**を探す
2. **「Change Password」** または **「Reset Password」** ボタンをクリック
3. 新しいパスワードを入力
4. **保存** または **Generate Password**（自動生成）

#### 方法B: 「Generate Password」がある場合

1. **「Generate Password」** または **「Reset Password」** ボタンをクリック
2. 新しいパスワードが自動生成される
3. **⚠️ 重要**: パスワードは**一度しか表示されません**
4. **すぐにコピーして安全な場所に保存**

#### 方法C: 接続文字列の下にパスワード設定がある場合

1. 接続文字列が表示されている場所を探す
2. その近くに **「Password」** や **「Change」** ボタンがある
3. クリックして新しいパスワードを設定

---

## 📸 見つからない場合の確認ポイント

「Connect」タブで以下のような項目を探してください：

- ✅ **Password** セクション
- ✅ **Reset Password** ボタン
- ✅ **Change Password** ボタン
- ✅ **Generate Password** ボタン
- ✅ **Security** セクション（パスワード設定が含まれる場合あり）

---

## ⚠️ 重要な注意事項

### 1. パスワード変更後の対応

パスワードを変更したら、**必ず以下を更新**してください：

1. **Renderの環境変数**
   - Renderダッシュボードにログイン
   - サービスを開く
   - 「Environment」タブを開く
   - `DATABASE_URL` を編集
   - 新しいパスワードに更新

2. **ローカルの `.env` ファイル**（もし使用している場合）
   - `DATABASE_URL` のパスワード部分を更新

### 2. パスワードの保存

- パスワードは**安全な場所に保存**
- **GitHubにコミットしない**
- パスワード管理ツール（1Password、LastPassなど）を使用することを推奨

---

## 🔄 パスワード変更後の接続文字列更新

新しいパスワードを `NEW_PASSWORD` に設定した場合：

**変更前（古いパスワード）:**
```
mysql://2iZ5PoqMuT8TqCD.root:r67OfCaeTlpguXgm@gateway01.ap-northeast-1.prod.aws.tidbcloud.com:4000/space_mood_oracle?ssl-mode=REQUIRED
```

**変更後（新しいパスワード）:**
```
mysql://2iZ5PoqMuT8TqCD.root:NEW_PASSWORD@gateway01.ap-northeast-1.prod.aws.tidbcloud.com:4000/space_mood_oracle?ssl-mode=REQUIRED
```

---

## 🆘 それでも見つからない場合

### 確認事項

1. **正しいクラスターを開いているか確認**
   - 複数のクラスターがある場合、正しいものを開いているか

2. **「Connect」タブが表示されているか確認**
   - クラスターが完全に作成されていない場合、タブが表示されないことがあります

3. **権限を確認**
   - 管理者権限が必要な場合があります

4. **TiDB Cloudのヘルプを参照**
   - https://docs.pingcap.com/tidbcloud/
   - または、TiDB Cloudのサポートに問い合わせ

---

## 📝 補足：Firewall設定について

Firewall設定は**パスワード変更とは別の設定**です：

- **Firewall**: どのIPアドレスから接続を許可するかの設定（接続許可の制御）
- **Password**: データベースへのアクセス認証（実際のログイン情報）

現在の設定：
- `Allow_all_public_connections`: `0.0.0.0` - `255.255.255.255`
  - → すべてのIPアドレスからの接続を許可（開発環境では問題ありません）

**Firewall設定はそのままでOKです。パスワード変更は「Connect」タブから行ってください。**

---

## 🔍 より具体的な手順

現在、Firewall設定の画面を見ているということは、**Settings**タブまたは**Security**セクションを見ている可能性があります。

### パスワード変更の場所を探す手順

1. **クラスターの詳細ページに戻る**
   - 左側のメニューまたは上部のナビゲーションから「cluster0」をクリック

2. **「Connect」タブを探す**
   - 上部のタブメニューで「**Connect**」をクリック
   - タブがない場合は、左側のメニューから探す

3. **「Connect」タブ内で探す**
   - 「**Password**」セクション
   - 「**Reset Password**」ボタン
   - 「**Change Password**」ボタン
   - 「**Generate Password**」ボタン

### もしくは「Overview」タブから

1. **「Overview」タブを開く**
2. **「Connect」セクション**を探す
3. その中にパスワード設定がある場合があります

---

**パスワードを変更したら、Renderの環境変数も忘れずに更新してください！** 🔐

