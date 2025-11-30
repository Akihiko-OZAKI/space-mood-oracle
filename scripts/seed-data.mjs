/**
 * Seed initial data for Space Mood Oracle
 * Generates 90 days of sample space weather and sentiment data
 */

import { drizzle } from 'drizzle-orm/mysql2';
import { eq } from 'drizzle-orm';
import mysql from 'mysql2/promise';
import { dailySentimentScores, spaceWeatherData, predictions } from '../drizzle/schema.js';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL environment variable is not set');
  process.exit(1);
}

const connection = await mysql.createConnection(DATABASE_URL);
const db = drizzle(connection);

console.log('🌟 Starting data generation...');

// Generate dates for the past 90 days
const endDate = new Date();
const startDate = new Date();
startDate.setDate(startDate.getDate() - 90);

const dates = [];
const currentDate = new Date(startDate);
while (currentDate <= endDate) {
  dates.push(currentDate.toISOString().split('T')[0]);
  currentDate.setDate(currentDate.getDate() + 1);
}

console.log(`📅 Generating data for ${dates.length} days (${dates[0]} to ${dates[dates.length - 1]})`);

// Generate space weather data
console.log('🌞 Generating space weather data...');
for (const date of dates) {
  const dayIndex = dates.indexOf(date);
  
  // Simulate solar activity with some randomness
  const baseActivity = Math.sin((dayIndex / dates.length) * Math.PI * 4) * 0.5 + 0.5;
  const random = Math.random();

  const xClassCount = random > 0.95 && baseActivity > 0.6 ? Math.floor(Math.random() * 3) : 0;
  const mClassCount = random > 0.7 && baseActivity > 0.4 ? Math.floor(Math.random() * 5) : 0;
  const kpMax = (baseActivity * 6 + Math.random() * 3).toFixed(2);
  const solarWindSpeed = (300 + baseActivity * 400 + Math.random() * 100).toFixed(0);
  const protonFlux = (baseActivity * 100 + Math.random() * 50).toFixed(2);

  await db.insert(spaceWeatherData).values({
    date,
    kpIndexMax: kpMax,
    xClassFlareCount: xClassCount,
    mClassFlareCount: mClassCount,
    solarWindSpeed,
    protonFlux,
  }).onDuplicateKeyUpdate({
    set: {
      kpIndexMax: kpMax,
      xClassFlareCount: xClassCount,
      mClassFlareCount: mClassCount,
      solarWindSpeed,
      protonFlux,
    },
  });
}

console.log('✅ Space weather data generated');

// Generate sentiment data with correlation to space weather
console.log('💭 Generating sentiment data...');
for (const date of dates) {
  const dayIndex = dates.indexOf(date);
  
  // Get space weather for this date
  const spaceWeatherResult = await db.select().from(spaceWeatherData).where(eq(spaceWeatherData.date, date)).limit(1);

  const sw = spaceWeatherResult[0];
  const kpIndex = parseFloat(sw.kpIndexMax || '0');
  const totalFlares = (sw.xClassFlareCount || 0) + (sw.mClassFlareCount || 0);

  // Base sentiment with weekly cycle
  const weekCycle = Math.sin((dayIndex / 7) * Math.PI * 2) * 0.2;
  const baseSentiment = 0.1 + weekCycle;

  // Space weather impact (negative correlation)
  const kpImpact = -(kpIndex / 9) * 0.15;
  const flareImpact = -(totalFlares / 5) * 0.1;

  // Random daily variation
  const randomVariation = (Math.random() - 0.5) * 0.2;

  // Final sentiment score
  let sentimentScore = baseSentiment + kpImpact + flareImpact + randomVariation;
  sentimentScore = Math.max(-1, Math.min(1, sentimentScore));

  // Generate tweet counts
  const tweetCount = Math.floor(5000 + Math.random() * 5000);
  const positiveRatio = sentimentScore > 0 ? 0.4 + sentimentScore * 0.3 : 0.3;
  const negativeRatio = sentimentScore < 0 ? 0.4 - sentimentScore * 0.3 : 0.3;
  const neutralRatio = 1 - positiveRatio - negativeRatio;

  const positiveCount = Math.floor(tweetCount * positiveRatio);
  const negativeCount = Math.floor(tweetCount * negativeRatio);
  const neutralCount = tweetCount - positiveCount - negativeCount;

  await db.insert(dailySentimentScores).values({
    date,
    score: sentimentScore.toFixed(6),
    tweetCount,
    positiveCount,
    negativeCount,
    neutralCount,
  }).onDuplicateKeyUpdate({
    set: {
      score: sentimentScore.toFixed(6),
      tweetCount,
      positiveCount,
      negativeCount,
      neutralCount,
    },
  });
}

console.log('✅ Sentiment data generated');

// Generate some predictions for recent dates
console.log('🔮 Generating predictions...');
const recentDates = dates.slice(-7); // Last 7 days
for (const date of recentDates) {
  const sentimentResult = await db.select().from(dailySentimentScores).where(eq(dailySentimentScores.date, date)).limit(1);

  if (sentimentResult.length > 0) {
    const actualScore = parseFloat(sentimentResult[0].score);
    const predictedScore = actualScore + (Math.random() - 0.5) * 0.1; // Add small prediction error
    const confidence = 0.6 + Math.random() * 0.3;

    await db.insert(predictions).values({
      date,
      predictedScore: predictedScore.toFixed(6),
      confidence: confidence.toFixed(3),
      modelVersion: 'v1.0-correlation',
    });
  }
}

console.log('✅ Predictions generated');

await connection.end();

console.log('🎉 Data generation complete!');
console.log(`📊 Generated:`);
console.log(`   - ${dates.length} days of space weather data`);
console.log(`   - ${dates.length} days of sentiment scores`);
console.log(`   - ${recentDates.length} predictions`);
