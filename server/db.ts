import { eq, desc, asc, and, gte, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { 
  InsertUser, 
  users,
  dailySentimentScores,
  InsertDailySentimentScore,
  spaceWeatherData,
  InsertSpaceWeatherData,
  predictions,
  InsertPrediction,
  tweets,
  InsertTweet,
  googleTrendData,
  InsertGoogleTrendData,
  twitterTrendData,
  InsertTwitterTrendData,
  dailyMoodJudgment,
  InsertDailyMoodJudgment
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (_db) return _db;

  const urlStr = process.env.DATABASE_URL;
  if (!urlStr) {
    console.warn("[Database] DATABASE_URL is not set. Cannot create connection.");
    return null;
  }

  try {
    const url = new URL(urlStr);
    const host = url.hostname;
    const port = parseInt(url.port || "4000", 10);
    const user = decodeURIComponent(url.username);
    const password = decodeURIComponent(url.password);
    const database = url.pathname.replace(/^\//, "") || undefined;

    const safeInfo = `${url.protocol}//${host}:${port}/${database ?? ""}`;
    console.log("[Database] Initializing MySQL pool with TLS to", safeInfo);

    const pool = await mysql.createPool({
      host,
      port,
      user,
      password,
      database,
      ssl: {
        minVersion: "TLSv1.2",
        rejectUnauthorized: false, // Dev: allow TiDB Cloud certificate without local CA file
      },
    });

    _db = drizzle(pool);
    console.log("[Database] Connection object created successfully.");
    return _db;
  } catch (error) {
    console.warn("[Database] Failed to connect:", error);
    _db = null;
    return null;
  }
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// === Daily Sentiment Scores ===

export async function upsertDailySentimentScore(data: InsertDailySentimentScore) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(dailySentimentScores).values(data).onDuplicateKeyUpdate({
    set: {
      score: data.score,
      tweetCount: data.tweetCount,
      positiveCount: data.positiveCount,
      negativeCount: data.negativeCount,
      neutralCount: data.neutralCount,
      updatedAt: new Date(),
    },
  });
}

export async function getDailySentimentScores(startDate?: string, endDate?: string) {
  const db = await getDb();
  if (!db) return [];

  let query = db.select().from(dailySentimentScores);

  if (startDate && endDate) {
    query = query.where(and(gte(dailySentimentScores.date, startDate), lte(dailySentimentScores.date, endDate))) as any;
  } else if (startDate) {
    query = query.where(gte(dailySentimentScores.date, startDate)) as any;
  } else if (endDate) {
    query = query.where(lte(dailySentimentScores.date, endDate)) as any;
  }

  return query.orderBy(desc(dailySentimentScores.date));
}

export async function getDailySentimentScoreByDate(date: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(dailySentimentScores).where(eq(dailySentimentScores.date, date)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// === Space Weather Data ===

export async function upsertSpaceWeatherData(data: InsertSpaceWeatherData) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(spaceWeatherData).values(data).onDuplicateKeyUpdate({
    set: {
      kpIndexMax: data.kpIndexMax,
      xClassFlareCount: data.xClassFlareCount,
      mClassFlareCount: data.mClassFlareCount,
      solarWindSpeed: data.solarWindSpeed,
      protonFlux: data.protonFlux,
      updatedAt: new Date(),
    },
  });
}

export async function getSpaceWeatherData(startDate?: string, endDate?: string) {
  const db = await getDb();
  if (!db) return [];

  let query = db.select().from(spaceWeatherData);

  if (startDate && endDate) {
    query = query.where(and(gte(spaceWeatherData.date, startDate), lte(spaceWeatherData.date, endDate))) as any;
  } else if (startDate) {
    query = query.where(gte(spaceWeatherData.date, startDate)) as any;
  } else if (endDate) {
    query = query.where(lte(spaceWeatherData.date, endDate)) as any;
  }

  return query.orderBy(desc(spaceWeatherData.date));
}

export async function getSpaceWeatherDataByDate(date: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(spaceWeatherData).where(eq(spaceWeatherData.date, date)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// === Predictions ===

export async function insertPrediction(data: InsertPrediction) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(predictions).values(data);
}

export async function getPredictions(limit: number = 30) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(predictions).orderBy(desc(predictions.date)).limit(limit);
}

export async function getLatestPredictionByDate(date: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(predictions)
    .where(eq(predictions.date, date))
    .orderBy(desc(predictions.createdAt))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// === Tweets ===

export async function insertTweet(data: InsertTweet) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(tweets).values(data).onDuplicateKeyUpdate({
    set: { sentimentScore: data.sentimentScore, processedAt: new Date() },
  });
}

export async function getTweetsByDateRange(startDate: Date, endDate: Date, limit: number = 1000) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(tweets)
    .where(and(gte(tweets.createdAt, startDate), lte(tweets.createdAt, endDate)))
    .orderBy(asc(tweets.createdAt))
    .limit(limit);
}

// === Google Trend Data ===

export async function upsertGoogleTrendData(data: InsertGoogleTrendData) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(googleTrendData).values(data).onDuplicateKeyUpdate({
    set: {
      score: data.score,
      category: data.category,
    },
  });
}

export async function getGoogleTrendData(date?: string, keyword?: string) {
  const db = await getDb();
  if (!db) return [];

  let query = db.select().from(googleTrendData);

  const conditions = [];
  if (date) conditions.push(eq(googleTrendData.date, date));
  if (keyword) conditions.push(eq(googleTrendData.keyword, keyword));

  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as any;
  }

  return query.orderBy(desc(googleTrendData.date));
}

export async function getGoogleTrendDataByDate(date: string) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(googleTrendData)
    .where(eq(googleTrendData.date, date))
    .orderBy(desc(googleTrendData.score));
}

// === Twitter Trend Data ===

export async function upsertTwitterTrendData(data: InsertTwitterTrendData) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(twitterTrendData).values(data).onDuplicateKeyUpdate({
    set: {
      tweetVolume: data.tweetVolume,
      sentimentScore: data.sentimentScore,
    },
  });
}

export async function getTwitterTrendData(date?: string, keyword?: string) {
  const db = await getDb();
  if (!db) return [];

  let query = db.select().from(twitterTrendData);

  const conditions = [];
  if (date) conditions.push(eq(twitterTrendData.date, date));
  if (keyword) conditions.push(eq(twitterTrendData.keyword, keyword));

  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as any;
  }

  return query.orderBy(desc(twitterTrendData.date));
}

export async function getTwitterTrendDataByDate(date: string) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(twitterTrendData)
    .where(eq(twitterTrendData.date, date))
    .orderBy(desc(twitterTrendData.tweetVolume));
}

// === Daily Mood Judgment ===

export async function upsertDailyMoodJudgment(data: InsertDailyMoodJudgment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(dailyMoodJudgment).values(data).onDuplicateKeyUpdate({
    set: {
      judgment: data.judgment,
      score: data.score,
      googleTrendScore: data.googleTrendScore,
      twitterTrendScore: data.twitterTrendScore,
      spaceWeatherScore: data.spaceWeatherScore,
      confidence: data.confidence,
      updatedAt: new Date(),
    },
  });
}

export async function getDailyMoodJudgmentByDate(date: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select()
    .from(dailyMoodJudgment)
    .where(eq(dailyMoodJudgment.date, date))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getDailyMoodJudgments(startDate?: string, endDate?: string) {
  const db = await getDb();
  if (!db) return [];

  let query = db.select().from(dailyMoodJudgment);

  if (startDate && endDate) {
    query = query.where(and(gte(dailyMoodJudgment.date, startDate), lte(dailyMoodJudgment.date, endDate))) as any;
  } else if (startDate) {
    query = query.where(gte(dailyMoodJudgment.date, startDate)) as any;
  } else if (endDate) {
    query = query.where(lte(dailyMoodJudgment.date, endDate)) as any;
  }

  return query.orderBy(desc(dailyMoodJudgment.date));
}
