import { describe, expect, it } from "vitest";
import { analyzeCorrelation, predictSentiment, generateFortuneMessage } from "./prediction";
import type { TrainingData } from "./prediction";

describe("Prediction Module", () => {
  describe("analyzeCorrelation", () => {
    it("should return zero correlations for empty data", () => {
      const result = analyzeCorrelation([]);
      expect(result.kpCorrelation).toBe(0);
      expect(result.xFlareCorrelation).toBe(0);
      expect(result.mFlareCorrelation).toBe(0);
      expect(result.overallCorrelation).toBe(0);
    });

    it("should calculate correlations for sample data", () => {
      const trainingData: TrainingData[] = [
        { date: "2025-01-01", sentimentScore: 0.5, kpIndexMax: 2, xClassFlareCount: 0, mClassFlareCount: 1 },
        { date: "2025-01-02", sentimentScore: 0.3, kpIndexMax: 4, xClassFlareCount: 0, mClassFlareCount: 2 },
        { date: "2025-01-03", sentimentScore: -0.2, kpIndexMax: 6, xClassFlareCount: 1, mClassFlareCount: 3 },
        { date: "2025-01-04", sentimentScore: -0.4, kpIndexMax: 7, xClassFlareCount: 2, mClassFlareCount: 4 },
      ];

      const result = analyzeCorrelation(trainingData);
      
      // Correlation should be negative (higher space weather = lower sentiment)
      expect(result.kpCorrelation).toBeLessThan(0);
      expect(result.overallCorrelation).toBeDefined();
      expect(result.overallCorrelation).toBeGreaterThan(-1);
      expect(result.overallCorrelation).toBeLessThan(1);
    });
  });

  describe("predictSentiment", () => {
    it("should return zero prediction for empty training data", () => {
      const result = predictSentiment([], {
        kpIndexMax: 5,
        xClassFlareCount: 1,
        mClassFlareCount: 2,
      });

      expect(result.predictedScore).toBe(0);
      expect(result.confidence).toBe(0);
    });

    it("should predict sentiment based on space weather", () => {
      const trainingData: TrainingData[] = [
        { date: "2025-01-01", sentimentScore: 0.5, kpIndexMax: 2, xClassFlareCount: 0, mClassFlareCount: 1 },
        { date: "2025-01-02", sentimentScore: 0.4, kpIndexMax: 3, xClassFlareCount: 0, mClassFlareCount: 1 },
        { date: "2025-01-03", sentimentScore: 0.3, kpIndexMax: 4, xClassFlareCount: 0, mClassFlareCount: 2 },
        { date: "2025-01-04", sentimentScore: 0.2, kpIndexMax: 5, xClassFlareCount: 1, mClassFlareCount: 2 },
        { date: "2025-01-05", sentimentScore: 0.1, kpIndexMax: 6, xClassFlareCount: 1, mClassFlareCount: 3 },
      ];

      const result = predictSentiment(trainingData, {
        kpIndexMax: 7,
        xClassFlareCount: 2,
        mClassFlareCount: 4,
      });

      expect(result.predictedScore).toBeGreaterThanOrEqual(-1);
      expect(result.predictedScore).toBeLessThanOrEqual(1);
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
      expect(result.factors).toBeDefined();
      expect(result.factors.kpIndex).toBeDefined();
      expect(result.factors.solarFlares).toBeDefined();
      expect(result.factors.historicalTrend).toBeDefined();
    });

    it("should clamp predicted score to valid range", () => {
      const trainingData: TrainingData[] = Array(30).fill(null).map((_, i) => ({
        date: `2025-01-${String(i + 1).padStart(2, '0')}`,
        sentimentScore: 0.8,
        kpIndexMax: 1,
        xClassFlareCount: 0,
        mClassFlareCount: 0,
      }));

      const result = predictSentiment(trainingData, {
        kpIndexMax: 0,
        xClassFlareCount: 0,
        mClassFlareCount: 0,
      });

      expect(result.predictedScore).toBeGreaterThanOrEqual(-1);
      expect(result.predictedScore).toBeLessThanOrEqual(1);
    });
  });

  describe("generateFortuneMessage", () => {
    it("should generate positive fortune for high sentiment", () => {
      const result = generateFortuneMessage(0.5, {
        kpIndexMax: 2,
        xClassFlareCount: 0,
        mClassFlareCount: 0,
      });

      expect(result.mood).toContain("良い");
      expect(result.message).toBeDefined();
      expect(result.advice).toBeDefined();
      expect(result.cosmicInfluence).toBeDefined();
    });

    it("should generate negative fortune for low sentiment", () => {
      const result = generateFortuneMessage(-0.5, {
        kpIndexMax: 2,
        xClassFlareCount: 0,
        mClassFlareCount: 0,
      });

      expect(result.mood).toContain("注意");
      expect(result.message).toBeDefined();
      expect(result.advice).toBeDefined();
    });

    it("should mention X-class flares in cosmic influence", () => {
      const result = generateFortuneMessage(0, {
        kpIndexMax: 3,
        xClassFlareCount: 2,
        mClassFlareCount: 1,
      });

      expect(result.cosmicInfluence).toContain("太陽フレア");
      expect(result.cosmicInfluence).toContain("X");
    });

    it("should mention geomagnetic storm for high Kp index", () => {
      const result = generateFortuneMessage(0, {
        kpIndexMax: 7,
        xClassFlareCount: 0,
        mClassFlareCount: 0,
      });

      expect(result.cosmicInfluence).toContain("地磁気");
    });

    it("should indicate calm space weather", () => {
      const result = generateFortuneMessage(0, {
        kpIndexMax: 1,
        xClassFlareCount: 0,
        mClassFlareCount: 0,
      });

      expect(result.cosmicInfluence).toContain("穏やか");
    });
  });
});
