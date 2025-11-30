/**
 * Trend Analysis Service
 * Orchestrates data collection from Google Trends, Twitter Trends,
 * and Space Weather, then performs integrated mood judgment
 */

import { fetchGoogleTrends, calculateGoogleTrendSentiment, categorizeKeywords } from './googleTrends';
import { fetchTwitterTrends, analyzeTrendKeywords } from './twitterTrends';
import {
  judgeDailyMood,
  calculateSpaceWeatherImpact,
  aggregateGoogleTrendSentiment,
  aggregateTwitterTrendSentiment,
  type TrendData,
} from './moodJudgment';
import {
  upsertGoogleTrendData,
  getGoogleTrendDataByDate,
  upsertTwitterTrendData,
  getTwitterTrendDataByDate,
  upsertDailyMoodJudgment,
  getDailyMoodJudgmentByDate,
} from './db';
import { getSpaceWeatherDataByDate } from './db';

/**
 * Sentiment keywords for Google Trends analysis
 */
const POSITIVE_KEYWORDS = [
  '幸せ', 'ハッピー', '楽しい', '嬉しい', '良い', '素晴らしい', '最高',
  'happy', 'joy', 'good', 'great', 'wonderful', 'excellent',
];

const NEGATIVE_KEYWORDS = [
  '不安', 'ストレス', '疲れた', '悪い', '最悪', '悲しい', '苦しい',
  'anxiety', 'stress', 'tired', 'bad', 'worst', 'sad', 'depressed',
];

/**
 * Analyze trends and judge mood for a specific date
 */
export async function analyzeAndJudgeMood(date: string): Promise<{
  success: boolean;
  judgment?: any;
  error?: string;
}> {
  try {
    // Step 1: Get or fetch Google Trends data
    const googleTrendResults = await fetchGoogleTrends(
      [...POSITIVE_KEYWORDS, ...NEGATIVE_KEYWORDS],
      new Date(date),
      new Date(date),
      'JP'
    );

    // Save Google Trends data
    for (const trend of googleTrendResults) {
      const { positive, negative, neutral } = categorizeKeywords([trend.keyword]);
      const category = positive.length > 0 ? 'sentiment_positive'
        : negative.length > 0 ? 'sentiment_negative'
        : 'general';

      await upsertGoogleTrendData({
        date: trend.date,
        keyword: trend.keyword,
        score: trend.score,
        region: trend.region || 'JP',
        category,
      });
    }

    // Aggregate Google Trends sentiment
    const dateGoogleTrends = await getGoogleTrendDataByDate(date);
    const positiveTrends = dateGoogleTrends.filter(t => t.category === 'sentiment_positive');
    const negativeTrends = dateGoogleTrends.filter(t => t.category === 'sentiment_negative');

    const googleSentimentData = calculateGoogleTrendSentiment(
      googleTrendResults,
      date
    );
    
    // Get positive/negative keyword counts and scores for trendData
    const positiveScores = positiveTrends.map(t => t.score || 0);
    const negativeScores = negativeTrends.map(t => t.score || 0);

    // Step 2: Get or fetch Twitter Trends data
    // For PoC, use sample keywords (in production, fetch from Twitter API)
    const twitterKeywords = [
      ...POSITIVE_KEYWORDS.slice(0, 5),
      ...NEGATIVE_KEYWORDS.slice(0, 5),
    ];

    const twitterAnalysis = await analyzeTrendKeywords(twitterKeywords, date);

    // Save Twitter Trends data
    for (const trend of twitterAnalysis.trends) {
      await upsertTwitterTrendData({
        date: trend.date,
        keyword: trend.keyword,
        tweetVolume: trend.tweetVolume || null,
        sentimentScore: trend.sentimentScore.toFixed(6),
        region: trend.region || 'JP',
      });
    }

    // Step 3: Get Space Weather data
    const spaceWeather = await getSpaceWeatherDataByDate(date);

    let spaceWeatherImpact = 0;
    if (spaceWeather) {
      const kpIndex = parseFloat(spaceWeather.kpIndexMax || '0');
      const flareCount = (spaceWeather.xClassFlareCount || 0) + (spaceWeather.mClassFlareCount || 0);
      spaceWeatherImpact = calculateSpaceWeatherImpact(kpIndex, flareCount);
    }

    // Step 4: Aggregate data for judgment
    const trendData: TrendData = {
      google: {
        positiveKeywords: positiveTrends.length,
        negativeKeywords: negativeTrends.length,
        overallScore: googleSentimentData.overallScore,
      },
      twitter: {
        averageSentiment: twitterAnalysis.averageSentiment,
        positiveTrends: twitterAnalysis.positiveTrends,
        negativeTrends: twitterAnalysis.negativeTrends,
      },
      spaceWeather: {
        kpIndex: spaceWeather ? parseFloat(spaceWeather.kpIndexMax || '0') : 0,
        flareCount: spaceWeather ? (spaceWeather.xClassFlareCount || 0) + (spaceWeather.mClassFlareCount || 0) : 0,
        impact: spaceWeatherImpact,
      },
    };

    // Step 5: Judge mood
    const judgment = judgeDailyMood(trendData);

    // Step 6: Save judgment result
    await upsertDailyMoodJudgment({
      date,
      judgment: judgment.judgment,
      score: judgment.score.toFixed(6),
      googleTrendScore: judgment.breakdown.google.toFixed(6),
      twitterTrendScore: judgment.breakdown.twitter.toFixed(6),
      spaceWeatherScore: judgment.breakdown.space.toFixed(6),
      confidence: judgment.confidence.toFixed(6),
    });

    return {
      success: true,
      judgment: {
        ...judgment,
        date,
        trendData,
      },
    };
  } catch (error) {
    console.error('Failed to analyze and judge mood:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get or create mood judgment for today
 */
export async function getTodayMoodJudgment() {
  const today = new Date().toISOString().split('T')[0];
  
  // Check if judgment already exists
  const existing = await getDailyMoodJudgmentByDate(today);
  if (existing) {
    return {
      success: true,
      judgment: existing,
      cached: true,
    };
  }

  // Create new judgment
  return await analyzeAndJudgeMood(today);
}

/**
 * Update mood judgment for a specific date
 */
export async function updateMoodJudgment(date: string) {
  return await analyzeAndJudgeMood(date);
}

