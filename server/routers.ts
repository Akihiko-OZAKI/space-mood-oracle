import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  sentiment: router({
    analyze: publicProcedure
      .input(z.object({ text: z.string() }))
      .mutation(async ({ input }) => {
        const { analyzeSentiment } = await import('./sentiment');
        return analyzeSentiment(input.text);
      }),
    
    getDailyScores: publicProcedure
      .input(z.object({
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      }))
      .query(async ({ input }) => {
        const { getDailySentimentScores } = await import('./db');
        return getDailySentimentScores(input.startDate, input.endDate);
      }),
    
    getScoreByDate: publicProcedure
      .input(z.object({ date: z.string() }))
      .query(async ({ input }) => {
        const { getDailySentimentScoreByDate } = await import('./db');
        return getDailySentimentScoreByDate(input.date);
      }),
    
    uploadDailyScore: protectedProcedure
      .input(z.object({
        date: z.string(),
        score: z.string(),
        tweetCount: z.number(),
        positiveCount: z.number(),
        negativeCount: z.number(),
        neutralCount: z.number(),
      }))
      .mutation(async ({ input }) => {
        const { upsertDailySentimentScore } = await import('./db');
        await upsertDailySentimentScore(input);
        return { success: true };
      }),
  }),

  spaceWeather: router({
    getData: publicProcedure
      .input(z.object({
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      }))
      .query(async ({ input }) => {
        const { getSpaceWeatherData } = await import('./db');
        return getSpaceWeatherData(input.startDate, input.endDate);
      }),
    
    getDataByDate: publicProcedure
      .input(z.object({ date: z.string() }))
      .query(async ({ input }) => {
        const { getSpaceWeatherDataByDate } = await import('./db');
        return getSpaceWeatherDataByDate(input.date);
      }),
    
    fetchLatest: publicProcedure
      .mutation(async () => {
        const { fetchRealSpaceWeatherData, saveRealDataToDatabase } = await import('./realSpaceWeather');
        
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30); // Last 30 days
        
        const data = await fetchRealSpaceWeatherData(startDate, endDate);
        await saveRealDataToDatabase(data);
        
        return { success: true, count: data.length };
      }),
    
    fetchRealData: protectedProcedure
      .input(z.object({
        startDate: z.string(),
        endDate: z.string(),
      }))
      .mutation(async ({ input }) => {
        const { fetchRealSpaceWeatherData, saveRealDataToDatabase } = await import('./realSpaceWeather');
        
        const start = new Date(input.startDate);
        const end = new Date(input.endDate);
        
        const data = await fetchRealSpaceWeatherData(start, end);
        await saveRealDataToDatabase(data);
        
        return {
          success: true,
          count: data.length,
          data,
        };
      }),
    
    generateMockData: protectedProcedure
      .input(z.object({
        startDate: z.string(),
        endDate: z.string(),
      }))
      .mutation(async ({ input }) => {
        const { generateMockSpaceWeatherData } = await import('./spaceWeather');
        const { upsertSpaceWeatherData } = await import('./db');
        
        const data = generateMockSpaceWeatherData(
          new Date(input.startDate),
          new Date(input.endDate)
        );
        
        for (const item of data) {
          await upsertSpaceWeatherData(item);
        }
        
        return { success: true, count: data.length };
      }),
  }),

  predictions: router({
    getLatest: publicProcedure
      .input(z.object({ limit: z.number().optional() }))
      .query(async ({ input }) => {
        const { getPredictions } = await import('./db');
        return getPredictions(input.limit);
      }),
    
    getByDate: publicProcedure
      .input(z.object({ date: z.string() }))
      .query(async ({ input }) => {
        const { getLatestPredictionByDate } = await import('./db');
        return getLatestPredictionByDate(input.date);
      }),

    // Train simple correlation model from historical data and
    // predict today's sentiment based only on space weather.
    trainFromHistory: publicProcedure
      .input(z.object({
        days: z.number().min(7).max(365).optional(),
      }))
      .mutation(async ({ input }) => {
        const days = input.days ?? 90;

        const today = new Date();
        const endDate = today.toISOString().split("T")[0];
        const start = new Date(today);
        start.setDate(start.getDate() - (days - 1));
        const startDate = start.toISOString().split("T")[0];

        const {
          getDailySentimentScores,
          getSpaceWeatherData,
          getSpaceWeatherDataByDate,
          insertPrediction,
        } = await import("./db");
        const { predictSentiment } = await import("./prediction");

        // Load historical data
        const [sentiments, spaceWeather] = await Promise.all([
          getDailySentimentScores(startDate, endDate),
          getSpaceWeatherData(startDate, endDate),
        ]);

        // Join by date
        const spaceByDate = new Map<string, any>(
          spaceWeather.map((sw: any) => [sw.date, sw]),
        );

        const trainingData = sentiments
          .map((s: any) => {
            const sw = spaceByDate.get(s.date);
            if (!sw) return null;

            const sentimentScore = parseFloat(s.score ?? "0");
            const kpIndexMax = parseFloat(sw.kpIndexMax ?? "0");
            const xClassFlareCount = sw.xClassFlareCount ?? 0;
            const mClassFlareCount = sw.mClassFlareCount ?? 0;

            if (Number.isNaN(sentimentScore) || Number.isNaN(kpIndexMax)) {
              return null;
            }

            return {
              date: s.date,
              sentimentScore,
              kpIndexMax,
              xClassFlareCount,
              mClassFlareCount,
            };
          })
          .filter((x: any) => x !== null);

        if (trainingData.length < 5) {
          return {
            success: false as const,
            reason: "not-enough-training-data" as const,
            trainingSize: trainingData.length,
          };
        }

        // Today's space weather
        const todaySpaceWeather =
          await getSpaceWeatherDataByDate(endDate);

        if (!todaySpaceWeather) {
          return {
            success: false as const,
            reason: "no-space-weather-today" as const,
            trainingSize: trainingData.length,
          };
        }

        const spaceInput = {
          kpIndexMax: parseFloat(todaySpaceWeather.kpIndexMax ?? "0"),
          xClassFlareCount: todaySpaceWeather.xClassFlareCount ?? 0,
          mClassFlareCount: todaySpaceWeather.mClassFlareCount ?? 0,
        };

        const prediction = predictSentiment(trainingData as any, spaceInput);

        await insertPrediction({
          date: endDate,
          predictedScore: prediction.predictedScore.toFixed(6),
          confidence: prediction.confidence.toFixed(6),
          modelVersion: `simple-correlation-v1`,
        });

        return {
          success: true as const,
          trainingSize: trainingData.length,
          prediction,
        };
      }),
  }),

  tweetUpload: router({
    uploadCSV: publicProcedure
      .input(z.object({
        csvContent: z.string(),
      }))
      .mutation(async ({ input }) => {
        const { processUploadedCSV } = await import('./tweetUpload');
        
        const result = await processUploadedCSV(input.csvContent);
        
        return result;
      }),
  }),

  oracle: router({
    getTodayFortune: publicProcedure
      .query(async () => {
        const today = new Date().toISOString().split('T')[0];
        const { getDailySentimentScoreByDate, getSpaceWeatherDataByDate, getLatestPredictionByDate } = await import('./db');
        
        const [sentiment, spaceWeather, prediction] = await Promise.all([
          getDailySentimentScoreByDate(today),
          getSpaceWeatherDataByDate(today),
          getLatestPredictionByDate(today),
        ]);
        
        return {
          date: today,
          sentiment,
          spaceWeather,
          prediction,
        };
      }),
    
    getFortuneByDate: publicProcedure
      .input(z.object({ date: z.string() }))
      .query(async ({ input }) => {
        const { getDailySentimentScoreByDate, getSpaceWeatherDataByDate, getLatestPredictionByDate } = await import('./db');
        
        const [sentiment, spaceWeather, prediction] = await Promise.all([
          getDailySentimentScoreByDate(input.date),
          getSpaceWeatherDataByDate(input.date),
          getLatestPredictionByDate(input.date),
        ]);
        
        return {
          date: input.date,
          sentiment,
          spaceWeather,
          prediction,
        };
      }),
  }),

  trends: router({
    // Get today's mood judgment (good day / bad day)
    getTodayMood: publicProcedure
      .query(async () => {
        const { getTodayMoodJudgment } = await import('./trendAnalysisService');
        return await getTodayMoodJudgment();
      }),
    
    // Get mood judgment for a specific date
    getMoodByDate: publicProcedure
      .input(z.object({ date: z.string() }))
      .query(async ({ input }) => {
        const { getDailyMoodJudgmentByDate } = await import('./db');
        const judgment = await getDailyMoodJudgmentByDate(input.date);
        
        if (judgment) {
          return {
            success: true,
            judgment,
            cached: true,
          };
        }
        
        // If not exists, analyze and create
        const { analyzeAndJudgeMood } = await import('./trendAnalysisService');
        return await analyzeAndJudgeMood(input.date);
      }),
    
    // Update/refresh mood judgment for a date
    updateMoodJudgment: protectedProcedure
      .input(z.object({ date: z.string() }))
      .mutation(async ({ input }) => {
        const { updateMoodJudgment } = await import('./trendAnalysisService');
        return await updateMoodJudgment(input.date);
      }),
    
    // Get Google Trends data
    getGoogleTrends: publicProcedure
      .input(z.object({
        date: z.string().optional(),
        keyword: z.string().optional(),
      }))
      .query(async ({ input }) => {
        const { getGoogleTrendData } = await import('./db');
        return await getGoogleTrendData(input.date, input.keyword);
      }),
    
    // Get Twitter Trends data
    getTwitterTrends: publicProcedure
      .input(z.object({
        date: z.string().optional(),
        keyword: z.string().optional(),
      }))
      .query(async ({ input }) => {
        const { getTwitterTrendData } = await import('./db');
        return await getTwitterTrendData(input.date, input.keyword);
      }),
    
    // Get all mood judgments in date range
    getMoodJudgments: publicProcedure
      .input(z.object({
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      }))
      .query(async ({ input }) => {
        const { getDailyMoodJudgments } = await import('./db');
        return await getDailyMoodJudgments(input.startDate, input.endDate);
      }),
  }),
});

export type AppRouter = typeof appRouter;
