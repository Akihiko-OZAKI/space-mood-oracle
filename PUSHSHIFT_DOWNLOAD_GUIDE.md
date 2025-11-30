# Pushshift Torrent ダウンロードガイド

このガイドでは、Pushshift Torrentから実際のTwitter/Xデータをダウンロードし、Space Mood Oracleにインポートする手順を説明します。

## 前提条件

- **大容量ストレージ**: 1ヶ月分のデータで約10〜50GB必要
- **高速インターネット接続**: ダウンロードに数時間〜数日かかる可能性があります
- **Torrentクライアント**: qBittorrent、Transmission、またはμTorrentなど

## ステップ1: Torrentファイルの入手

### オプションA: Academic Torrents（推奨）

1. [Academic Torrents](https://academictorrents.com/)にアクセス
2. 検索バーで「pushshift twitter」または「reddit」を検索
3. 利用可能なデータセットを確認：
   - `pushshift_twitter_2023_01.zst` - 2023年1月のデータ
   - `pushshift_twitter_2023_02.zst` - 2023年2月のデータ
   - など

### オプションB: Internet Archive

1. [Internet Archive](https://archive.org/)にアクセス
2. 「pushshift twitter dumps」で検索
3. 利用可能なコレクションを確認

### オプションC: Pushshift公式（現在ダウン中の可能性）

1. [Pushshift.io](https://pushshift.io/)にアクセス
2. Torrentsセクションを確認
3. ※2024年以降、サーバーが不安定な可能性があります

## ステップ2: Torrentのダウンロード

### qBittorrentを使用する場合

1. qBittorrentをインストール（無料・オープンソース）
   - Windows: https://www.qbittorrent.org/download.php
   - Mac: Homebrewで `brew install qbittorrent`
   - Linux: `sudo apt install qbittorrent`

2. Torrentファイルを開く
   - ダウンロードしたい期間のTorrentファイルをダブルクリック
   - または、qBittorrentで「ファイル」→「Torrentを追加」

3. 保存先を指定
   - 十分な空き容量があるドライブを選択
   - 例: `D:\pushshift_data\`

4. ダウンロード開始
   - 「OK」をクリックしてダウンロード開始
   - 完了まで待機（数時間〜数日）

## ステップ3: データの解凍

ダウンロードしたファイルは`.zst`形式で圧縮されています。

### Windows

1. [7-Zip](https://www.7-zip.org/)をインストール
2. `.zst`ファイルを右クリック → 「7-Zip」→「ここに解凍」

### Mac/Linux

```bash
# zstdをインストール
# Mac
brew install zstd

# Linux
sudo apt install zstd

# 解凍
zstd -d pushshift_twitter_2023_01.zst
```

## ステップ4: JSONからCSVへの変換

解凍後、NDJSON（改行区切りJSON）形式のファイルが得られます。これをCSVに変換します。

### Pythonスクリプトを使用

```python
import json
import csv
from datetime import datetime

input_file = 'pushshift_twitter_2023_01.json'
output_file = 'tweets_2023_01.csv'

with open(input_file, 'r', encoding='utf-8') as infile, \
     open(output_file, 'w', newline='', encoding='utf-8') as outfile:
    
    writer = csv.writer(outfile)
    writer.writerow(['date', 'text', 'lang'])  # ヘッダー
    
    for line_num, line in enumerate(infile, 1):
        try:
            tweet = json.loads(line)
            
            # 必要なフィールドを抽出
            created_at = tweet.get('created_at')
            text = tweet.get('text') or tweet.get('full_text', '')
            lang = tweet.get('lang', 'unknown')
            
            # 日付を YYYY-MM-DD 形式に変換
            if created_at:
                # Twitter の created_at フォーマット: "Wed Oct 10 20:19:24 +0000 2018"
                dt = datetime.strptime(created_at, '%a %b %d %H:%M:%S %z %Y')
                date_str = dt.strftime('%Y-%m-%d')
            else:
                continue  # 日付がない場合はスキップ
            
            # 日本語ツイートのみフィルタ（オプション）
            if lang == 'ja':
                writer.writerow([date_str, text, lang])
        
        except Exception as e:
            print(f"Error on line {line_num}: {e}")
            continue
        
        # 進捗表示
        if line_num % 100000 == 0:
            print(f"Processed {line_num:,} tweets...")

print(f"✅ CSV conversion complete: {output_file}")
```

### スクリプトの実行

```bash
python convert_to_csv.py
```

## ステップ5: Space Mood Oracleへのアップロード

1. Space Mood Oracleにログイン
2. ホームページの「ツイートデータアップロード」セクションに移動
3. 「CSVファイルを選択」ボタンをクリック
4. 変換したCSVファイルを選択
5. 「アップロード開始」をクリック

### アップロード時の注意点

- **ファイルサイズ**: 1ファイルあたり最大100MBを推奨
- **大きなファイルの場合**: 日付範囲で分割してアップロード
- **処理時間**: 10万件のツイートで約5〜10分かかります

## ステップ6: データの確認

アップロード完了後：

1. ホームページに戻る
2. 「今日の集合意識」セクションでデータが表示されることを確認
3. グラフで感情スコアの推移を確認

## トラブルシューティング

### Torrentが遅い

- **シード数を確認**: シード数が少ない場合、ダウンロードが遅くなります
- **別の期間を試す**: より人気のある期間（2023年前半など）を選択

### 解凍エラー

- **ファイルの整合性を確認**: Torrentクライアントでハッシュチェックを実行
- **十分な空き容量**: 解凍には元ファイルの3〜5倍の容量が必要

### CSV変換エラー

- **エンコーディング**: UTF-8を使用していることを確認
- **メモリ不足**: 大きなファイルは分割処理を検討

### アップロードエラー

- **ファイル形式**: CSVヘッダーに `date`, `text` が含まれていることを確認
- **日付形式**: `YYYY-MM-DD` 形式であることを確認

## 推奨データ範囲

初回は以下の範囲から始めることを推奨します：

- **期間**: 2023年1月〜3月（3ヶ月分）
- **言語**: 日本語のみ（`lang == 'ja'`）
- **サンプリング**: 全データの10%をランダムサンプリング

これにより、データサイズを管理しやすくしつつ、十分な分析が可能です。

## 参考リンク

- [Pushshift Documentation](https://pushshift.io/docs)
- [Academic Torrents](https://academictorrents.com/)
- [qBittorrent](https://www.qbittorrent.org/)
- [7-Zip](https://www.7-zip.org/)

## サポート

問題が発生した場合は、プロジェクトのREADMEまたはGitHub Issuesを確認してください。
