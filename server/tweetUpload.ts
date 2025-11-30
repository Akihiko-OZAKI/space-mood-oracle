/**
 * Tweet Data CSV Upload and Batch Processing
 * Handles CSV file upload, parsing, and sentiment analysis
 */

import { analyzeSentiment } from './sentiment';
import { upsertDailySentimentScore } from './db';

export interface TweetRecord {
  date: string;
  text: string;
  created_at?: string;
  full_text?: string;
}

export interface DailySentimentAggregation {
  date: string;
  totalScore: number;
  count: number;
  positiveCount: number;
  negativeCount: number;
  neutralCount: number;
}

/**
 * Parse CSV content and extract tweet records
 * Supports multiple CSV formats (Pushshift, Twitter API, custom)
 */
export function parseCSV(csvContent: string): TweetRecord[] {
  const lines = csvContent.trim().split('\n');
  
  if (lines.length < 2) {
    throw new Error('CSV file is empty or invalid');
  }

  // Parse header
  const header = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  
  // Find relevant columns
  const dateIndex = header.findIndex(h => 
    h.toLowerCase().includes('date') || 
    h.toLowerCase().includes('created_at') ||
    h.toLowerCase() === 'timestamp'
  );
  
  const textIndex = header.findIndex(h => 
    h.toLowerCase().includes('text') || 
    h.toLowerCase().includes('content') ||
    h.toLowerCase() === 'tweet'
  );

  if (dateIndex === -1 || textIndex === -1) {
    throw new Error('CSV must contain date and text columns');
  }

  // Parse data rows
  const records: TweetRecord[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Simple CSV parsing (handles quoted fields)
    const values: string[] = [];
    let currentValue = '';
    let insideQuotes = false;

    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        values.push(currentValue.trim());
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    values.push(currentValue.trim());

    if (values.length <= Math.max(dateIndex, textIndex)) {
      continue; // Skip invalid rows
    }

    const dateStr = values[dateIndex].replace(/^"|"$/g, '');
    const text = values[textIndex].replace(/^"|"$/g, '');

    if (!dateStr || !text) continue;

    // Parse date (supports ISO format and common date formats)
    let parsedDate: Date;
    try {
      parsedDate = new Date(dateStr);
      if (isNaN(parsedDate.getTime())) {
        continue; // Skip invalid dates
      }
    } catch {
      continue;
    }

    records.push({
      date: parsedDate.toISOString().split('T')[0],
      text,
    });
  }

  return records;
}

/**
 * Analyze sentiment for a batch of tweets and aggregate by date
 */
export async function analyzeTweetBatch(
  tweets: TweetRecord[],
  onProgress?: (progress: number, total: number) => void
): Promise<Map<string, DailySentimentAggregation>> {
  const aggregationMap = new Map<string, DailySentimentAggregation>();

  for (let i = 0; i < tweets.length; i++) {
    const tweet = tweets[i];
    
    try {
      const sentiment = await analyzeSentiment(tweet.text);
      
      if (!aggregationMap.has(tweet.date)) {
        aggregationMap.set(tweet.date, {
          date: tweet.date,
          totalScore: 0,
          count: 0,
          positiveCount: 0,
          negativeCount: 0,
          neutralCount: 0,
        });
      }

      const agg = aggregationMap.get(tweet.date)!;
      agg.totalScore += sentiment.score;
      agg.count++;

      if (sentiment.score > 0.1) {
        agg.positiveCount++;
      } else if (sentiment.score < -0.1) {
        agg.negativeCount++;
      } else {
        agg.neutralCount++;
      }

      // Report progress
      if (onProgress && i % 100 === 0) {
        onProgress(i + 1, tweets.length);
      }
    } catch (error) {
      console.error(`Failed to analyze tweet: ${error}`);
      // Continue with next tweet
    }
  }

  // Final progress report
  if (onProgress) {
    onProgress(tweets.length, tweets.length);
  }

  return aggregationMap;
}

/**
 * Save aggregated sentiment data to database
 */
export async function saveSentimentAggregation(
  aggregationMap: Map<string, DailySentimentAggregation>
): Promise<number> {
  let savedCount = 0;

  for (const [date, agg] of Array.from(aggregationMap.entries())) {
    const averageScore = agg.count > 0 ? agg.totalScore / agg.count : 0;

    await upsertDailySentimentScore({
      date,
      score: averageScore.toFixed(6),
      tweetCount: agg.count,
      positiveCount: agg.positiveCount,
      negativeCount: agg.negativeCount,
      neutralCount: agg.neutralCount,
    });

    savedCount++;
  }

  return savedCount;
}

/**
 * Process uploaded CSV file: parse, analyze, and save
 */
export async function processUploadedCSV(
  csvContent: string,
  onProgress?: (stage: string, progress: number, total: number) => void
): Promise<{ success: boolean; daysProcessed: number; tweetsAnalyzed: number; error?: string }> {
  try {
    // Stage 1: Parse CSV
    if (onProgress) onProgress('parsing', 0, 100);
    const tweets = parseCSV(csvContent);
    
    if (tweets.length === 0) {
      return {
        success: false,
        daysProcessed: 0,
        tweetsAnalyzed: 0,
        error: 'No valid tweets found in CSV',
      };
    }

    if (onProgress) onProgress('parsing', 100, 100);

    // Stage 2: Analyze sentiments
    if (onProgress) onProgress('analyzing', 0, tweets.length);
    
    const aggregationMap = await analyzeTweetBatch(tweets, (progress, total) => {
      if (onProgress) onProgress('analyzing', progress, total);
    });

    // Stage 3: Save to database
    if (onProgress) onProgress('saving', 0, aggregationMap.size);
    const daysProcessed = await saveSentimentAggregation(aggregationMap);
    if (onProgress) onProgress('saving', daysProcessed, aggregationMap.size);

    return {
      success: true,
      daysProcessed,
      tweetsAnalyzed: tweets.length,
    };
  } catch (error) {
    console.error('Failed to process CSV:', error);
    return {
      success: false,
      daysProcessed: 0,
      tweetsAnalyzed: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
