# PoC実装サマリー - Twitter/Googleトレンド統合分析

## 📋 実装完了項目

### 1. ✅ データベーススキーマ拡張
- **ファイル**: `drizzle/schema.ts`
- **追加テーブル**:
  - `google_trend_data`: Googleトレンドデータ
  - `twitter_trend_data`: Twitterトレンドデータ  
  - `daily_mood_judgment`: 日次判定結果（良い日/悪い日）

### 2. ✅ データベース操作関数
- **ファイル**: `server/db.ts`
- **追加関数**:
  - `upsertGoogleTrendData()`
  - `getGoogleTrendData()`, `getGoogleTrendDataByDate()`
  - `upsertTwitterTrendData()`
  - `getTwitterTrendData()`, `getTwitterTrendDataByDate()`
  - `upsertDailyMoodJudgment()`
  - `getDailyMoodJudgmentByDate()`, `getDailyMoodJudgments()`

### 3. ✅ Googleトレンド取得機能
- **ファイル**: `server/googleTrends.ts` (既存を利用)
- **機能**: キーワードベースのトレンドデータ取得
- **注意**: 現在はシミュレーションデータ（実データ取得は後で実装）

### 4. ✅ Twitterトレンド取得機能
- **ファイル**: `server/twitterTrends.ts` (新規作成)
- **機能**: 
  - トレンドキーワードの感情分析
  - 簡易版（手動キーワード指定、シミュレーション）

### 5. ✅ 統合判定エンジン
- **ファイル**: `server/moodJudgment.ts` (新規作成)
- **機能**:
  - Googleトレンド + Twitterトレンド + 宇宙データを統合
  - 「今日は良い日/悪い日」を判定
  - 重み付けスコア計算（Google 35%, Twitter 40%, 宇宙 25%）

### 6. ✅ トレンド分析サービス
- **ファイル**: `server/trendAnalysisService.ts` (新規作成)
- **機能**:
  - データ取得・分析・保存を統合
  - `analyzeAndJudgeMood()`: 指定日の分析
  - `getTodayMoodJudgment()`: 今日の判定を取得

### 7. ✅ tRPC APIエンドポイント
- **ファイル**: `server/routers.ts`
- **追加エンドポイント**:
  - `trends.getTodayMood`: 今日の判定を取得
  - `trends.getMoodByDate`: 指定日の判定を取得
  - `trends.updateMoodJudgment`: 判定を更新/再計算
  - `trends.getGoogleTrends`: Googleトレンドデータ取得
  - `trends.getTwitterTrends`: Twitterトレンドデータ取得
  - `trends.getMoodJudgments`: 期間内の判定一覧取得

---

## 🔧 次のステップ（実装が必要）

### 1. データベースマイグレーション
```bash
cd space_mood_oracle_v2.1/space_mood_oracle
pnpm db:push
# または
npm run db:push
```

### 2. Googleトレンド実データ取得
現在はシミュレーションデータを使用。
実装オプション：
- Google Trends API（アルファ版、申請必要）
- `pytrends` ライブラリ（Python、Node.jsから呼び出し）
- スクレイピング（利用規約注意）

### 3. Twitterトレンド実データ取得
現在はサンプルキーワードを使用。
実装オプション：
- Twitter API v2（有料、無料枠あり）
- スクレイピング（利用規約注意）

### 4. フロントエンド統合
- 今日の判定結果を表示
- 「良い日/悪い日」バッジ表示
- トレンドデータの可視化

---

## 🧪 テスト方法

### APIテスト（tRPC）
```typescript
// 今日の判定を取得
const result = await trpc.trends.getTodayMood.query();

// 指定日の判定を取得
const result = await trpc.trends.getMoodByDate.query({ 
  date: '2025-01-15' 
});

// 判定を更新
const result = await trpc.trends.updateMoodJudgment.mutate({ 
  date: '2025-01-15' 
});
```

### 直接関数呼び出しテスト
```typescript
import { analyzeAndJudgeMood } from './server/trendAnalysisService';

const result = await analyzeAndJudgeMood('2025-01-15');
console.log(result.judgment);
```

---

## 📊 データフロー

```
1. Googleトレンドデータ取得
   └─> キーワード（ポジティブ/ネガティブ）のトレンドスコア
   └─> データベース保存

2. Twitterトレンドデータ取得
   └─> トレンドワードの感情分析
   └─> データベース保存

3. 宇宙天気データ取得（既存）
   └─> Kp指数、フレア数
   └─> 影響度計算

4. 統合判定
   └─> 3つのデータソースを重み付け統合
   └─> 「良い日/悪い日/普通」を判定
   └─> データベース保存

5. API経由でフロントエンドに提供
```

---

## 🎯 判定ロジック

### スコア計算
- **総合スコア**: -1.0（最悪）～ +1.0（最高）
- **判定閾値**:
  - `score > 0.2` → "good"（良い日）
  - `score < -0.2` → "bad"（悪い日）
  - それ以外 → "neutral"（普通）

### 重み付け
- Googleトレンド: 35%
- Twitterトレンド: 40%
- 宇宙天気: 25%

### 信頼度
- 利用可能なデータソース数に基づく（0.0～1.0）
- 3つ全て揃っていれば信頼度1.0

---

## ⚠️ 注意事項

1. **Googleトレンド**: 現在はシミュレーションデータ。実データ取得にはAPI申請またはスクレイピングが必要
2. **Twitterトレンド**: 現在はサンプルキーワード。実データ取得にはAPI利用またはスクレイピングが必要
3. **マイグレーション**: データベースマイグレーションを実行するまで、新しいテーブルは使用できない
4. **ネット環境**: 大量データ取得はネットカフェで実施予定（本日のPoCでは少量データで動作確認）

---

## 📝 実装ファイル一覧

### 新規作成
- `server/twitterTrends.ts`
- `server/moodJudgment.ts`
- `server/trendAnalysisService.ts`

### 更新
- `server/db.ts` (DB操作関数追加)
- `server/routers.ts` (tRPCエンドポイント追加)
- `drizzle/schema.ts` (既にテーブル定義済み)

---

## 🚀 動作確認手順

1. **マイグレーション実行**
   ```bash
   cd space_mood_oracle_v2.1/space_mood_oracle
   pnpm db:push
   ```

2. **サーバー起動**
   ```bash
   pnpm dev
   ```

3. **APIテスト**
   - tRPC経由で `trends.getTodayMood` を呼び出す
   - または直接関数 `analyzeAndJudgeMood()` を呼び出す

4. **データ確認**
   - データベースで新しいテーブルにデータが保存されているか確認

---

以上で、Twitter/Googleトレンド統合分析のPoC実装が完了しました！🎉

