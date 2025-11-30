/**
 * Sentiment Analysis Engine
 * Multi-language dictionary-based sentiment scoring
 */

interface SentimentLexicon {
  [word: string]: number;
}

interface SentimentResult {
  score: number;
  positive: number;
  negative: number;
  neutral: number;
}

/**
 * Simple sentiment lexicon for demonstration
 * In production, load from external files or database
 */
const ENGLISH_LEXICON: SentimentLexicon = {
  // Positive words
  good: 1, great: 2, excellent: 3, amazing: 3, wonderful: 3, fantastic: 3,
  happy: 2, love: 3, best: 3, beautiful: 2, perfect: 3, awesome: 3,
  brilliant: 3, outstanding: 3, superb: 3, magnificent: 3, delightful: 2,
  
  // Negative words
  bad: -1, terrible: -3, horrible: -3, awful: -3, worst: -3, hate: -3,
  sad: -2, angry: -2, disappointed: -2, poor: -2, disgusting: -3,
  pathetic: -3, useless: -2, failure: -2, disaster: -3, nightmare: -3,
};

const JAPANESE_LEXICON: SentimentLexicon = {
  // Positive words (ポジティブな単語)
  良い: 1, いい: 1, 素晴らしい: 3, 最高: 3, 嬉しい: 2, 幸せ: 2,
  楽しい: 2, 好き: 2, 愛: 3, 美しい: 2, 完璧: 3, すごい: 2,
  素敵: 2, 感動: 3, ありがとう: 2, 感謝: 2, 成功: 2, 勝利: 2,
  
  // Negative words (ネガティブな単語)
  悪い: -1, 最悪: -3, ひどい: -3, 嫌い: -2, 悲しい: -2, 辛い: -2,
  苦しい: -2, 怒り: -2, 失望: -2, 残念: -2, 不安: -2, 心配: -2,
  絶望: -3, 地獄: -3, 失敗: -2, 問題: -1, 困難: -2,
};

/**
 * Detect language from text (simple heuristic)
 */
function detectLanguage(text: string): 'ja' | 'en' {
  // Check if text contains Japanese characters
  const japaneseRegex = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/;
  return japaneseRegex.test(text) ? 'ja' : 'en';
}

/**
 * Tokenize text into words
 */
function tokenize(text: string, lang: 'ja' | 'en'): string[] {
  if (lang === 'ja') {
    // Simple Japanese tokenization - extract individual words
    // Match sequences of Japanese characters
    const matches = text.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]+/g) || [];
    // Also split into individual characters for better matching
    const chars: string[] = [];
    for (const match of matches) {
      // Add the full match
      chars.push(match);
      // Also add individual characters
      for (let i = 0; i < match.length; i++) {
        chars.push(match[i]);
      }
      // Add 2-character combinations
      for (let i = 0; i < match.length - 1; i++) {
        chars.push(match.substring(i, i + 2));
      }
      // Add 3-character combinations
      for (let i = 0; i < match.length - 2; i++) {
        chars.push(match.substring(i, i + 3));
      }
    }
    return chars;
  } else {
    // English tokenization
    return text.toLowerCase().match(/\b\w+\b/g) || [];
  }
}

/**
 * Calculate sentiment score for a single text
 */
export function analyzeSentiment(text: string): SentimentResult {
  if (!text || text.trim().length === 0) {
    return { score: 0, positive: 0, negative: 0, neutral: 1 };
  }

  const lang = detectLanguage(text);
  const lexicon = lang === 'ja' ? JAPANESE_LEXICON : ENGLISH_LEXICON;
  const tokens = tokenize(text, lang);

  let totalScore = 0;
  let matchedWords = 0;
  let positiveCount = 0;
  let negativeCount = 0;

  for (const token of tokens) {
    const score = lexicon[token];
    if (score !== undefined) {
      totalScore += score;
      matchedWords++;
      if (score > 0) positiveCount++;
      if (score < 0) negativeCount++;
    }
  }

  // Normalize score to -1.0 to 1.0 range
  const normalizedScore = matchedWords > 0 ? totalScore / matchedWords : 0;
  const clampedScore = Math.max(-1, Math.min(1, normalizedScore / 3));

  return {
    score: clampedScore,
    positive: positiveCount,
    negative: negativeCount,
    neutral: tokens.length - matchedWords,
  };
}

/**
 * Analyze multiple texts and return aggregated daily score
 */
export function analyzeBatchSentiment(texts: string[]): {
  averageScore: number;
  totalPositive: number;
  totalNegative: number;
  totalNeutral: number;
  count: number;
} {
  if (texts.length === 0) {
    return {
      averageScore: 0,
      totalPositive: 0,
      totalNegative: 0,
      totalNeutral: 0,
      count: 0,
    };
  }

  let totalScore = 0;
  let totalPositive = 0;
  let totalNegative = 0;
  let totalNeutral = 0;

  for (const text of texts) {
    const result = analyzeSentiment(text);
    totalScore += result.score;
    totalPositive += result.positive;
    totalNegative += result.negative;
    totalNeutral += result.neutral;
  }

  return {
    averageScore: totalScore / texts.length,
    totalPositive,
    totalNegative,
    totalNeutral,
    count: texts.length,
  };
}

/**
 * Load sentiment lexicon from external source
 * This is a placeholder for future implementation
 */
export async function loadSentimentLexicon(language: string): Promise<SentimentLexicon> {
  // TODO: Load from file or database
  // For now, return built-in lexicons
  if (language === 'ja') return JAPANESE_LEXICON;
  return ENGLISH_LEXICON;
}
