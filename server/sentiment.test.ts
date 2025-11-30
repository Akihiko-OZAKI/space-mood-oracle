import { describe, expect, it } from "vitest";
import { analyzeSentiment, analyzeBatchSentiment } from "./sentiment";

describe("Sentiment Analysis", () => {
  describe("analyzeSentiment", () => {
    it("should return neutral score for empty text", () => {
      const result = analyzeSentiment("");
      expect(result.score).toBe(0);
      expect(result.neutral).toBe(1);
    });

    it("should return positive score for positive English text", () => {
      const result = analyzeSentiment("This is a great and wonderful day!");
      expect(result.score).toBeGreaterThan(0);
      expect(result.positive).toBeGreaterThan(0);
    });

    it("should return negative score for negative English text", () => {
      const result = analyzeSentiment("This is terrible and awful!");
      expect(result.score).toBeLessThan(0);
      expect(result.negative).toBeGreaterThan(0);
    });

    it("should return positive score for positive Japanese text", () => {
      const result = analyzeSentiment("今日は素晴らしい日です。とても嬉しい！");
      expect(result.score).toBeGreaterThan(0);
      expect(result.positive).toBeGreaterThan(0);
    });

    it("should return negative score for negative Japanese text", () => {
      const result = analyzeSentiment("最悪の日だ。とても悲しい。");
      expect(result.score).toBeLessThan(0);
      expect(result.negative).toBeGreaterThan(0);
    });

    it("should handle mixed sentiment", () => {
      const result = analyzeSentiment("good but bad");
      expect(result.positive).toBeGreaterThan(0);
      expect(result.negative).toBeGreaterThan(0);
    });
  });

  describe("analyzeBatchSentiment", () => {
    it("should return zero values for empty array", () => {
      const result = analyzeBatchSentiment([]);
      expect(result.averageScore).toBe(0);
      expect(result.count).toBe(0);
    });

    it("should calculate average score correctly", () => {
      const texts = [
        "This is great!",
        "This is terrible!",
        "This is okay.",
      ];
      const result = analyzeBatchSentiment(texts);
      expect(result.count).toBe(3);
      expect(result.totalPositive).toBeGreaterThan(0);
      expect(result.totalNegative).toBeGreaterThan(0);
    });

    it("should handle large batch of texts", () => {
      const texts = Array(100).fill("This is a good day");
      const result = analyzeBatchSentiment(texts);
      expect(result.count).toBe(100);
      expect(result.averageScore).toBeGreaterThan(0);
    });
  });
});
