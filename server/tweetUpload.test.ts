import { describe, expect, it } from 'vitest';
import { parseCSV, analyzeTweetBatch } from './tweetUpload';

describe('tweetUpload', () => {
  describe('parseCSV', () => {
    it('should parse valid CSV with date and text columns', () => {
      const csvContent = `date,text
2025-01-01,"Happy New Year!"
2025-01-02,"Great day today"
2025-01-03,"Feeling sad"`;

      const result = parseCSV(csvContent);

      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({
        date: '2025-01-01',
        text: 'Happy New Year!',
      });
      expect(result[1]).toEqual({
        date: '2025-01-02',
        text: 'Great day today',
      });
      expect(result[2]).toEqual({
        date: '2025-01-03',
        text: 'Feeling sad',
      });
    });

    it('should handle CSV with created_at and full_text columns', () => {
      const csvContent = `created_at,full_text,user_id
2025-01-01T10:00:00Z,"Hello world",123
2025-01-02T15:30:00Z,"Another tweet",456`;

      const result = parseCSV(csvContent);

      expect(result).toHaveLength(2);
      expect(result[0].date).toBe('2025-01-01');
      expect(result[0].text).toBe('Hello world');
      expect(result[1].date).toBe('2025-01-02');
      expect(result[1].text).toBe('Another tweet');
    });

    it('should throw error for CSV without required columns', () => {
      const csvContent = `id,user_name
1,john
2,jane`;

      expect(() => parseCSV(csvContent)).toThrow('CSV must contain date and text columns');
    });

    it('should throw error for empty CSV', () => {
      const csvContent = '';

      expect(() => parseCSV(csvContent)).toThrow('CSV file is empty or invalid');
    });

    it('should skip rows with invalid dates', () => {
      const csvContent = `date,text
2025-01-01,"Valid tweet"
invalid-date,"Invalid tweet"
2025-01-03,"Another valid tweet"`;

      const result = parseCSV(csvContent);

      expect(result).toHaveLength(2);
      expect(result[0].date).toBe('2025-01-01');
      expect(result[1].date).toBe('2025-01-03');
    });

    it('should handle quoted fields with commas', () => {
      const csvContent = `date,text
2025-01-01,"Hello, world! This is a test."
2025-01-02,"Another tweet, with commas"`;

      const result = parseCSV(csvContent);

      expect(result).toHaveLength(2);
      expect(result[0].text).toBe('Hello, world! This is a test.');
      expect(result[1].text).toBe('Another tweet, with commas');
    });
  });

  describe('analyzeTweetBatch', () => {
    it('should aggregate tweets by date', async () => {
      const tweets = [
        { date: '2025-01-01', text: 'I love this!' },
        { date: '2025-01-01', text: 'Great day' },
        { date: '2025-01-02', text: 'Terrible weather' },
      ];

      const result = await analyzeTweetBatch(tweets);

      expect(result.size).toBe(2);
      expect(result.has('2025-01-01')).toBe(true);
      expect(result.has('2025-01-02')).toBe(true);

      const jan01 = result.get('2025-01-01')!;
      expect(jan01.count).toBe(2);
      expect(jan01.totalScore).toBeGreaterThan(0); // Positive sentiment

      const jan02 = result.get('2025-01-02')!;
      expect(jan02.count).toBe(1);
    });

    it('should categorize sentiments correctly', async () => {
      const tweets = [
        { date: '2025-01-01', text: 'I love this amazing day!' }, // Positive
        { date: '2025-01-01', text: 'This is okay' }, // Neutral
        { date: '2025-01-01', text: 'I hate this terrible situation' }, // Negative
      ];

      const result = await analyzeTweetBatch(tweets);

      const jan01 = result.get('2025-01-01')!;
      expect(jan01.count).toBe(3);
      expect(jan01.positiveCount).toBeGreaterThan(0);
      expect(jan01.neutralCount).toBeGreaterThan(0);
      expect(jan01.negativeCount).toBeGreaterThan(0);
    });

    it('should handle empty tweet array', async () => {
      const tweets: any[] = [];

      const result = await analyzeTweetBatch(tweets);

      expect(result.size).toBe(0);
    });

    it('should report progress', async () => {
      const tweets = Array.from({ length: 250 }, (_, i) => ({
        date: '2025-01-01',
        text: `Tweet ${i}`,
      }));

      const progressReports: number[] = [];
      
      await analyzeTweetBatch(tweets, (progress) => {
        progressReports.push(progress);
      });

      // Should report progress at least once
      expect(progressReports.length).toBeGreaterThan(0);
      // Final report should be total count
      expect(progressReports[progressReports.length - 1]).toBe(250);
    });
  });
});
