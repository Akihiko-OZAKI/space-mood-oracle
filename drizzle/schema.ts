import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Daily sentiment scores aggregated from X (Twitter) posts
 */
export const dailySentimentScores = mysqlTable("daily_sentiment_scores", {
  id: int("id").autoincrement().primaryKey(),
  date: varchar("date", { length: 10 }).notNull().unique(), // YYYY-MM-DD format
  score: varchar("score", { length: 20 }).notNull(), // Decimal stored as string for precision
  tweetCount: int("tweet_count").notNull().default(0),
  positiveCount: int("positive_count").notNull().default(0),
  negativeCount: int("negative_count").notNull().default(0),
  neutralCount: int("neutral_count").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DailySentimentScore = typeof dailySentimentScores.$inferSelect;
export type InsertDailySentimentScore = typeof dailySentimentScores.$inferInsert;

/**
 * Space weather data (solar flares, geomagnetic storms)
 */
export const spaceWeatherData = mysqlTable("space_weather_data", {
  id: int("id").autoincrement().primaryKey(),
  date: varchar("date", { length: 10 }).notNull().unique(), // YYYY-MM-DD format
  kpIndexMax: varchar("kp_index_max", { length: 10 }), // Maximum Kp index for the day
  xClassFlareCount: int("x_class_flare_count").notNull().default(0),
  mClassFlareCount: int("m_class_flare_count").notNull().default(0),
  solarWindSpeed: varchar("solar_wind_speed", { length: 20 }), // km/s
  protonFlux: varchar("proton_flux", { length: 20 }), // particles/cm²/s/sr
  solarRadiationScale: int("solar_radiation_scale").notNull().default(0), // S-scale: 0-5 (0=none, 1=minor, 5=extreme)
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SpaceWeatherData = typeof spaceWeatherData.$inferSelect;
export type InsertSpaceWeatherData = typeof spaceWeatherData.$inferInsert;

/**
 * ML model predictions
 */
export const predictions = mysqlTable("predictions", {
  id: int("id").autoincrement().primaryKey(),
  date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD format
  predictedScore: varchar("predicted_score", { length: 20 }).notNull(),
  confidence: varchar("confidence", { length: 20 }), // 0.0 to 1.0
  modelVersion: varchar("model_version", { length: 50 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Prediction = typeof predictions.$inferSelect;
export type InsertPrediction = typeof predictions.$inferInsert;

/**
 * Raw tweet data for analysis (optional storage)
 */
export const tweets = mysqlTable("tweets", {
  id: int("id").autoincrement().primaryKey(),
  tweetId: varchar("tweet_id", { length: 64 }).notNull().unique(),
  text: text("text").notNull(),
  lang: varchar("lang", { length: 10 }),
  sentimentScore: varchar("sentiment_score", { length: 20 }),
  createdAt: timestamp("createdAt").notNull(),
  processedAt: timestamp("processedAt").defaultNow().notNull(),
});

export type Tweet = typeof tweets.$inferSelect;
export type InsertTweet = typeof tweets.$inferInsert;

/**
 * Google Trends data
 */
export const googleTrendData = mysqlTable("google_trend_data", {
  id: int("id").autoincrement().primaryKey(),
  date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD format
  keyword: varchar("keyword", { length: 100 }).notNull(),
  score: int("score"), // Trend score (0-100 relative value)
  region: varchar("region", { length: 10 }).default("JP"), // "JP", "US" etc
  category: varchar("category", { length: 50 }), // "sentiment", "general" etc
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type GoogleTrendData = typeof googleTrendData.$inferSelect;
export type InsertGoogleTrendData = typeof googleTrendData.$inferInsert;

/**
 * Twitter Trends data
 */
export const twitterTrendData = mysqlTable("twitter_trend_data", {
  id: int("id").autoincrement().primaryKey(),
  date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD format
  keyword: varchar("keyword", { length: 100 }).notNull(),
  tweetVolume: int("tweet_volume"), // Number of tweets
  sentimentScore: varchar("sentiment_score", { length: 20 }), // -1.0 to 1.0
  region: varchar("region", { length: 10 }).default("JP"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TwitterTrendData = typeof twitterTrendData.$inferSelect;
export type InsertTwitterTrendData = typeof twitterTrendData.$inferInsert;

/**
 * Daily mood judgment (統合判定: "今日は良い日/悪い日")
 */
export const dailyMoodJudgment = mysqlTable("daily_mood_judgment", {
  id: int("id").autoincrement().primaryKey(),
  date: varchar("date", { length: 10 }).notNull().unique(), // YYYY-MM-DD format
  judgment: varchar("judgment", { length: 20 }).notNull(), // "good", "bad", "neutral"
  score: varchar("score", { length: 20 }).notNull(), // -1.0 to 1.0
  googleTrendScore: varchar("google_score", { length: 20 }),
  twitterTrendScore: varchar("twitter_score", { length: 20 }),
  spaceWeatherScore: varchar("space_weather_score", { length: 20 }),
  confidence: varchar("confidence", { length: 20 }), // 0.0 to 1.0
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DailyMoodJudgment = typeof dailyMoodJudgment.$inferSelect;
export type InsertDailyMoodJudgment = typeof dailyMoodJudgment.$inferInsert;