/**
 * Twitter Trends Data Fetcher
 * Fetches Twitter trend data and analyzes sentiment
 */

import { analyzeSentiment } from './sentiment';

export interface TwitterTrendResult {
  keyword: string;
  tweetVolume?: number;
  sentimentScore: number; // -1.0 to 1.0
  date: string; // YYYY-MM-DD
  region?: string;
}

/**
 * Simulate Twitter trends for PoC
 * In production, this would fetch from Twitter API or scrape
 * 
 * For now, we accept manually provided trend keywords
 */
export async function fetchTwitterTrends(
  keywords: string[],
  date: string = new Date().toISOString().split('T')[0],
  region: string = 'JP'
): Promise<TwitterTrendResult[]> {
  const results: TwitterTrendResult[] = [];

  for (const keyword of keywords) {
    // Analyze sentiment of the trend keyword itself
    const sentiment = analyzeSentiment(keyword);
    
    // Simulate tweet volume (in real implementation, get from API)
    const tweetVolume = Math.floor(Math.random() * 100000) + 1000;

    results.push({
      keyword,
      tweetVolume,
      sentimentScore: sentiment.score,
      date,
      region,
    });
  }

  return results;
}

/**
 * Fetch and analyze sentiment for trend keywords
 * This simulates getting trending topics and analyzing their sentiment
 */
export async function analyzeTrendKeywords(
  keywords: string[],
  date: string = new Date().toISOString().split('T')[0]
): Promise<{
  averageSentiment: number;
  positiveTrends: number;
  negativeTrends: number;
  trends: TwitterTrendResult[];
}> {
  const trends = await fetchTwitterTrends(keywords, date);

  let totalSentiment = 0;
  let positiveCount = 0;
  let negativeCount = 0;

  for (const trend of trends) {
    totalSentiment += trend.sentimentScore;
    if (trend.sentimentScore > 0.1) {
      positiveCount++;
    } else if (trend.sentimentScore < -0.1) {
      negativeCount++;
    }
  }

  return {
    averageSentiment: trends.length > 0 ? totalSentiment / trends.length : 0,
    positiveTrends: positiveCount,
    negativeTrends: negativeCount,
    trends,
  };
}

/**
 * Get sample trend keywords for testing
 * In production, these would come from actual Twitter trends API
 */
export function getSampleTrendKeywords(): string[] {
  return [
    // Positive trends
    '幸せ',
    '楽しい',
    '良いニュース',
    // Negative trends
    '不安',
    '疲れた',
    'ストレス',
    // Neutral trends
    '今日',
    '天気',
    'ニュース',
  ];
}

