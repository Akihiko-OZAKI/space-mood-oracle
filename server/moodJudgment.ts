/**
 * Daily Mood Judgment Engine
 * Integrates Google Trends, Twitter Trends, and Space Weather data
 * to determine if "today is a good day or bad day"
 */

export interface TrendData {
  google: {
    positiveKeywords: number; // Number of positive keywords with high scores
    negativeKeywords: number; // Number of negative keywords with high scores
    overallScore: number; // -1.0 to 1.0
  };
  twitter: {
    averageSentiment: number; // Average sentiment from trend tweets
    positiveTrends: number; // Number of positive trends
    negativeTrends: number; // Number of negative trends
  };
  spaceWeather: {
    kpIndex: number;
    flareCount: number;
    impact: number; // -1.0 to 1.0 (negative impact from space weather)
  };
}

export interface MoodJudgmentResult {
  judgment: "good" | "bad" | "neutral";
  score: number; // -1.0 to 1.0
  confidence: number; // 0.0 to 1.0
  breakdown: {
    google: number;
    twitter: number;
    space: number;
  };
  explanation: string;
}

/**
 * Calculate space weather impact on mood
 * Higher Kp index and more flares = negative impact
 */
export function calculateSpaceWeatherImpact(
  kpIndex: number,
  flareCount: number
): number {
  // Kp index ranges from 0-9, higher = more geomagnetic activity
  // More flares = more solar activity
  // Both have negative correlation with human mood
  const kpImpact = -(kpIndex / 9) * 0.4; // Max -0.4
  const flareImpact = -(Math.min(flareCount, 10) / 10) * 0.3; // Max -0.3

  // Combine impacts
  const totalImpact = kpImpact + flareImpact;
  
  // Normalize to -1.0 to 1.0
  return Math.max(-1.0, Math.min(1.0, totalImpact));
}

/**
 * Judge daily mood based on integrated trend data
 */
export function judgeDailyMood(trendData: TrendData): MoodJudgmentResult {
  // Weight for each data source
  const googleWeight = 0.35;
  const twitterWeight = 0.40;
  const spaceWeight = 0.25;

  const googleScore = trendData.google.overallScore;
  const twitterScore = trendData.twitter.averageSentiment;
  const spaceScore = trendData.spaceWeather.impact;

  // Calculate weighted total score
  const totalScore =
    googleScore * googleWeight +
    twitterScore * twitterWeight +
    spaceScore * spaceWeight;

  // Normalize to -1.0 to 1.0
  const normalizedScore = Math.max(-1.0, Math.min(1.0, totalScore));

  // Determine judgment
  let judgment: "good" | "bad" | "neutral";
  if (normalizedScore > 0.2) {
    judgment = "good";
  } else if (normalizedScore < -0.2) {
    judgment = "bad";
  } else {
    judgment = "neutral";
  }

  // Calculate confidence based on data availability
  const dataPoints = [
    trendData.google.positiveKeywords + trendData.google.negativeKeywords > 0 ? 1 : 0,
    trendData.twitter.positiveTrends + trendData.twitter.negativeTrends > 0 ? 1 : 0,
    trendData.spaceWeather.kpIndex > 0 ? 1 : 0,
  ];
  const availableDataSources = dataPoints.filter(p => p > 0).length;
  const confidence = Math.min(1.0, availableDataSources / 3);

  // Generate explanation
  let explanation = "";
  if (judgment === "good") {
    explanation = "今日は良い日です。世の中の雰囲気がポジティブで、宇宙からの影響も穏やかです。";
  } else if (judgment === "bad") {
    explanation = "今日は少し調子が悪いかもしれません。世の中の雰囲気や宇宙からの影響がネガティブに働いています。でも、これはあなたのせいではありません。";
  } else {
    explanation = "今日は普通の日です。特に大きな影響は見られません。";
  }

  return {
    judgment,
    score: normalizedScore,
    confidence,
    breakdown: {
      google: googleScore,
      twitter: twitterScore,
      space: spaceScore,
    },
    explanation,
  };
}

/**
 * Aggregate Google Trends data into sentiment score
 */
export function aggregateGoogleTrendSentiment(
  positiveKeywordCount: number,
  negativeKeywordCount: number,
  positiveScores: number[],
  negativeScores: number[]
): number {
  const avgPositive = positiveScores.length > 0
    ? positiveScores.reduce((a, b) => a + b, 0) / positiveScores.length / 100
    : 0;

  const avgNegative = negativeScores.length > 0
    ? negativeScores.reduce((a, b) => a + b, 0) / negativeScores.length / 100
    : 0;

  // Normalize: more positive keywords and higher scores = positive sentiment
  const score = avgPositive - avgNegative;
  
  return Math.max(-1.0, Math.min(1.0, score));
}

/**
 * Aggregate Twitter Trends data into sentiment score
 */
export function aggregateTwitterTrendSentiment(
  positiveTrendCount: number,
  negativeTrendCount: number,
  averageSentiment: number
): number {
  // Combine count ratio and average sentiment
  const totalTrends = positiveTrendCount + negativeTrendCount;
  const trendRatio = totalTrends > 0
    ? (positiveTrendCount - negativeTrendCount) / totalTrends
    : 0;

  // Weight: 60% average sentiment, 40% trend ratio
  const score = averageSentiment * 0.6 + trendRatio * 0.4;
  
  return Math.max(-1.0, Math.min(1.0, score));
}


