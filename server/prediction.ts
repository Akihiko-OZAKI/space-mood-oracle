/**
 * Machine Learning Prediction Module
 * Simplified correlation analysis and prediction without external ML libraries
 */

export interface TrainingData {
  date: string;
  sentimentScore: number;
  kpIndexMax: number;
  xClassFlareCount: number;
  mClassFlareCount: number;
}

export interface PredictionResult {
  date: string;
  predictedScore: number;
  confidence: number;
  factors: {
    kpIndex: number;
    solarFlares: number;
    historicalTrend: number;
  };
}

/**
 * Calculate correlation between two arrays
 */
function calculateCorrelation(x: number[], y: number[]): number {
  if (x.length !== y.length || x.length === 0) return 0;

  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
  const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

  if (denominator === 0) return 0;
  return numerator / denominator;
}

/**
 * Calculate moving average
 */
function movingAverage(data: number[], window: number): number[] {
  const result: number[] = [];
  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - window + 1);
    const slice = data.slice(start, i + 1);
    const avg = slice.reduce((a, b) => a + b, 0) / slice.length;
    result.push(avg);
  }
  return result;
}

/**
 * Analyze correlation between space weather and sentiment
 */
export function analyzeCorrelation(trainingData: TrainingData[]): {
  kpCorrelation: number;
  xFlareCorrelation: number;
  mFlareCorrelation: number;
  overallCorrelation: number;
} {
  if (trainingData.length < 2) {
    return {
      kpCorrelation: 0,
      xFlareCorrelation: 0,
      mFlareCorrelation: 0,
      overallCorrelation: 0,
    };
  }

  const sentimentScores = trainingData.map(d => d.sentimentScore);
  const kpIndices = trainingData.map(d => d.kpIndexMax);
  const xFlares = trainingData.map(d => d.xClassFlareCount);
  const mFlares = trainingData.map(d => d.mClassFlareCount);

  const kpCorrelation = calculateCorrelation(kpIndices, sentimentScores);
  const xFlareCorrelation = calculateCorrelation(xFlares, sentimentScores);
  const mFlareCorrelation = calculateCorrelation(mFlares, sentimentScores);

  // Overall correlation is weighted average
  const overallCorrelation = (kpCorrelation * 0.5 + xFlareCorrelation * 0.3 + mFlareCorrelation * 0.2);

  return {
    kpCorrelation,
    xFlareCorrelation,
    mFlareCorrelation,
    overallCorrelation,
  };
}

/**
 * Simple linear regression prediction
 */
export function predictSentiment(
  trainingData: TrainingData[],
  spaceWeatherInput: {
    kpIndexMax: number;
    xClassFlareCount: number;
    mClassFlareCount: number;
  }
): PredictionResult {
  if (trainingData.length === 0) {
    return {
      date: new Date().toISOString().split('T')[0],
      predictedScore: 0,
      confidence: 0,
      factors: { kpIndex: 0, solarFlares: 0, historicalTrend: 0 },
    };
  }

  // Calculate baseline sentiment (historical average)
  const sentimentScores = trainingData.map(d => d.sentimentScore);
  const baseline = sentimentScores.reduce((a, b) => a + b, 0) / sentimentScores.length;

  // Calculate impact factors
  const correlations = analyzeCorrelation(trainingData);

  // Normalize input values
  const avgKp = trainingData.reduce((sum, d) => sum + d.kpIndexMax, 0) / trainingData.length;
  const avgXFlare = trainingData.reduce((sum, d) => sum + d.xClassFlareCount, 0) / trainingData.length;
  const avgMFlare = trainingData.reduce((sum, d) => sum + d.mClassFlareCount, 0) / trainingData.length;

  // Calculate deviations from average
  const kpDeviation = (spaceWeatherInput.kpIndexMax - avgKp) / (avgKp || 1);
  const xFlareDeviation = (spaceWeatherInput.xClassFlareCount - avgXFlare) / (avgXFlare || 1);
  const mFlareDeviation = (spaceWeatherInput.mClassFlareCount - avgMFlare) / (avgMFlare || 1);

  // Calculate impact on sentiment (negative correlation means higher space weather = lower sentiment)
  const kpImpact = -correlations.kpCorrelation * kpDeviation * 0.1;
  const xFlareImpact = -correlations.xFlareCorrelation * xFlareDeviation * 0.15;
  const mFlareImpact = -correlations.mFlareCorrelation * mFlareDeviation * 0.1;

  // Calculate trend from recent data
  const recentData = trainingData.slice(-7); // Last 7 days
  const recentAvg = recentData.reduce((sum, d) => sum + d.sentimentScore, 0) / recentData.length;
  const trendImpact = (recentAvg - baseline) * 0.3;

  // Final prediction
  const predictedScore = baseline + kpImpact + xFlareImpact + mFlareImpact + trendImpact;
  const clampedScore = Math.max(-1, Math.min(1, predictedScore));

  // Calculate confidence based on data quality and correlation strength
  const dataQualityFactor = Math.min(1, trainingData.length / 30);
  const correlationStrength = Math.abs(correlations.overallCorrelation);
  const confidence = dataQualityFactor * correlationStrength;

  return {
    date: new Date().toISOString().split('T')[0],
    predictedScore: clampedScore,
    confidence: Math.max(0, Math.min(1, confidence)),
    factors: {
      kpIndex: kpImpact,
      solarFlares: xFlareImpact + mFlareImpact,
      historicalTrend: trendImpact,
    },
  };
}

/**
 * Generate fortune message based on sentiment score and space weather
 */
export function generateFortuneMessage(
  sentimentScore: number,
  spaceWeather: {
    kpIndexMax?: number;
    xClassFlareCount: number;
    mClassFlareCount: number;
  }
): {
  mood: string;
  message: string;
  advice: string;
  cosmicInfluence: string;
} {
  // Determine mood level
  let mood: string;
  let message: string;
  let advice: string;

  if (sentimentScore > 0.3) {
    mood = "非常に良い";
    message = "今日は集合意識が非常にポジティブです。人々の心は明るく、希望に満ちています。";
    advice = "この良い流れに乗って、新しいことにチャレンジしてみましょう。";
  } else if (sentimentScore > 0.1) {
    mood = "良い";
    message = "今日の集合意識は穏やかでポジティブな傾向にあります。";
    advice = "周りの人とのコミュニケーションを大切にしましょう。";
  } else if (sentimentScore > -0.1) {
    mood = "普通";
    message = "今日の集合意識は中立的です。特に大きな波はありません。";
    advice = "自分のペースで過ごすのが良いでしょう。";
  } else if (sentimentScore > -0.3) {
    mood = "やや注意";
    message = "今日の集合意識は少しネガティブな傾向があります。";
    advice = "無理をせず、リラックスする時間を作りましょう。";
  } else {
    mood = "要注意";
    message = "今日の集合意識はかなりネガティブです。多くの人がストレスを感じているようです。";
    advice = "自分を大切にし、ストレスを避ける工夫をしましょう。";
  }

  // Cosmic influence
  let cosmicInfluence: string;
  const totalFlares = spaceWeather.xClassFlareCount + spaceWeather.mClassFlareCount;
  const kpIndex = spaceWeather.kpIndexMax || 0;

  if (spaceWeather.xClassFlareCount > 0) {
    cosmicInfluence = `強力な太陽フレア(X${spaceWeather.xClassFlareCount}回)が発生しています。宇宙からの強いエネルギーが地球に影響を与えています。`;
  } else if (totalFlares > 3) {
    cosmicInfluence = `複数の太陽フレア(M${spaceWeather.mClassFlareCount}回)が観測されています。太陽活動が活発です。`;
  } else if (kpIndex > 5) {
    cosmicInfluence = `地磁気嵐が発生中です(Kp指数: ${kpIndex.toFixed(1)})。地球の磁場が乱れています。`;
  } else if (kpIndex > 3) {
    cosmicInfluence = `やや地磁気が乱れています(Kp指数: ${kpIndex.toFixed(1)})。`;
  } else {
    cosmicInfluence = "宇宙天気は穏やかです。太陽活動は静かな状態です。";
  }

  return { mood, message, advice, cosmicInfluence };
}
