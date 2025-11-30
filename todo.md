# Space Mood Oracle - Project TODO

## Phase 1: Data Collection Infrastructure
- [x] データベーススキーマ設計（ツイート感情スコア、宇宙天気データ）
- [x] Pushshift Torrentデータ処理パイプライン実装
- [x] データアップロード・インポート機能の実装

## Phase 2: Sentiment Analysis
- [x] 多言語感情辞書の統合（81言語 + 東北大辞書）
- [x] 感情分析エンジンの実装（辞書ベース）
- [x] 日次感情スコア計算機能
- [x] バッチ処理機能の実装

## Phase 3: Space Weather Data Integration
- [x] NOAA太陽フレアデータ取得API実装
- [x] 京都大学Kp指数データ取得API実装
- [x] 宇宙天気データの自動更新機能
- [x] データマージ・相関分析機能

## Phase 4: Machine Learning Model
- [x] LightGBM/XGBoost予測モデルの実装（簡易版・相関分析ベース）
- [x] 特徴量エンジニアリング
- [x] モデルトレーニング機能
- [x] 予測API実装

## Phase 5: Frontend UI
- [x] ランディングページデザイン（宇宙テーマ）
- [x] 今日の宇宙占い表示機能
- [x] 感情スコア可視化（チャート・グラフ）
- [x] 宇宙天気データ表示
- [x] 予測結果表示UI
- [x] 過去データ検索・閲覧機能

## Phase 6: Testing & Optimization
- [x] tRPC procedures のVitest テスト作成
- [x] エンドツーエンドテスト
- [ ] パフォーマンス最適化
- [ ] ドキュメント作成

## Phase 7: Enhancement - Data & Visualization
- [ ] 自動サンプルデータ生成機能の実装
- [ ] 初期データの自動投入
- [ ] Rechartsによる時系列グラフの追加
- [ ] 感情スコアと宇宙天気の相関チャート
- [ ] インタラクティブなデータ可視化

## Phase 8: Real Data Integration
- [ ] Pushshift Torrentデータインポート機能
- [ ] CSVアップロード機能
- [ ] バッチ処理の最適化

## Phase 9: Real Data Integration (Free Sources)
- [x] NOAA Space Weather API実装（太陽フレアデータ）
- [x] 京都大学Kp指数データ取得実装
- [x] 実データの自動取得・保存機能
- [x] UI: 実データ取得ボタン追加
- [ ] CSVアップロード機能（ツイートデータ）
- [ ] バッチ感情分析処理
- [ ] 実データと疑似データの切り替え機能

## Phase 10: UI Improvements
- [x] 画面上部にデータ管理セクションを追加
- [x] 実データ取得ボタンを常時表示
- [x] データソース表示（疑似/実データ）
- [x] データ更新日時の表示

## Phase 11: Rebranding to "Cosmic Will"
- [x] タイトルを「宇宙の意思」に変更
- [x] メッセージを集合意識コンセプトに変更
- [x] 「運勢」→「集合意識」「人類の気分」
- [x] 神秘的・スピリチュアルな表現に統一

## Phase 12: Tweet Data Upload
- [x] CSVアップロードUI実装
- [x] ファイルアップロードAPI実装
- [x] バッチ感情分析処理
- [x] 進捗表示機能
- [x] エラーハンドリング

## Phase 13: Solar Radiation Storm Integration
- [x] データベーススキーマにS-scaleフィールドを追加
- [x] NOAAからSolar Radiation Stormデータ取得
- [ ] UIに太陽放射ストーム情報を表示
- [ ] 感情スコアとの相関分析に追加

## Phase 14: Real Data Integration Fix
- [x] 「実データ取得」機能のデバッグ
- [x] 認証チェックの修正
- [x] エラーハンドリングの改善
- [x] 実データ取得のテスト

## Phase 15: Pushshift Torrent Preparation
- [x] ダウンロード手順書の作成
- [x] CSVフォーマットの確認
- [x] アップロード手順の整理
