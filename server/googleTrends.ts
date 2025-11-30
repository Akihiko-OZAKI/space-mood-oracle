/**
 * Google Trends Data Fetcher
 * Fetches Google Trends data for sentiment analysis
 */

import axios from 'axios';

export interface GoogleTrendResult {
  keyword: string;
  score: number; // 0-100 relative score
  date: string; // YYYY-MM-DD
  region?: string;
}

/**
 * Fetch Google Trends data using unofficial API
 * For PoC, we'll use a simple approach to get trend scores
 */
export async function fetchGoogleTrends(
  keywords: string[],
  startDate: Date,
  endDate: Date,
  region: string = 'JP'
): Promise<GoogleTrendResult[]> {
  const results: GoogleTrendResult[] = [];
  
  // For PoC, we'll simulate trend data based on date
  // In production, this would use Google Trends API or scraping
  const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  for (let i = 0; i <= daysDiff; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + i);
    const dateStr = currentDate.toISOString().split('T')[0];
    
    for (const keyword of keywords) {
      // Simulate trend score (0-100)
      // In real implementation, fetch from Google Trends API
      const baseScore = 50 + Math.sin(i / 7) * 20; // Weekly cycle
      const keywordVariation = keyword.length * 2;
      const score = Math.max(0, Math.min(100, baseScore + keywordVariation + (Math.random() - 0.5) * 10));
      
      results.push({
        keyword,
        score: Math.round(score),
        date: dateStr,
        region,
      });
    }
  }
  
  return results;
}

/**
 * Categorize keywords into positive/negative sentiment
 */
export function categorizeKeywords(keywords: string[]): {
  positive: string[];
  negative: string[];
  neutral: string[];
} {
  const positiveKeywords = [
    '幸せ', 'ハッピー', '良い', '素晴らしい', '最高', '嬉しい', '楽しい',
    'happy', 'good', 'great', 'excellent', 'wonderful', 'joy'
  ];
  
  const negativeKeywords = [
    '不安', 'ストレス', '疲れた', '悪い', '最悪', '悲しい', '苦しい',
    'anxiety', 'stress', 'tired', 'bad', 'worst', 'sad', 'depressed'
  ];
  
  const positive: string[] = [];
  const negative: string[] = [];
  const neutral: string[] = [];
  
  for (const keyword of keywords) {
    const lowerKeyword = keyword.toLowerCase();
    if (positiveKeywords.some(p => lowerKeyword.includes(p.toLowerCase()))) {
      positive.push(keyword);
    } else if (negativeKeywords.some(n => lowerKeyword.includes(n.toLowerCase()))) {
      negative.push(keyword);
    } else {
      neutral.push(keyword);
    }
  }
  
  return { positive, negative, neutral };
}

/**
 * Calculate overall sentiment score from Google Trends data
 */
export function calculateGoogleTrendSentiment(
  trendData: GoogleTrendResult[],
  date: string
): {
  overallScore: number; // -1.0 to 1.0
  positiveScore: number;
  negativeScore: number;
} {
  const dateData = trendData.filter(t => t.date === date);
  
  const { positive, negative } = categorizeKeywords(
    [...new Set(dateData.map(d => d.keyword))]
  );
  
  const positiveData = dateData.filter(d => positive.includes(d.keyword));
  const negativeData = dateData.filter(d => negative.includes(d.keyword));
  
  const positiveScore = positiveData.length > 0
    ? positiveData.reduce((sum, d) => sum + d.score, 0) / positiveData.length / 100
    : 0;
  
  const negativeScore = negativeData.length > 0
    ? negativeData.reduce((sum, d) => sum + d.score, 0) / negativeData.length / 100
    : 0;
  
  // Normalize: positive increases score, negative decreases
  const overallScore = positiveScore - negativeScore;
  
  return {
    overallScore: Math.max(-1, Math.min(1, overallScore)),
    positiveScore,
    negativeScore,
  };
}

