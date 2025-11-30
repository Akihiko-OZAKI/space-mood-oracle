/**
 * Space Weather Data Fetcher
 * Fetches solar flare and geomagnetic storm data from NOAA and Kyoto University
 */

import axios from 'axios';

export interface SolarFlareData {
  date: string;
  xClassCount: number;
  mClassCount: number;
}

export interface KpIndexData {
  date: string;
  kpMax: number;
}

export interface SpaceWeatherResult {
  date: string;
  kpIndexMax?: string;
  xClassFlareCount: number;
  mClassFlareCount: number;
  solarWindSpeed?: string;
  protonFlux?: string;
}

/**
 * Fetch solar flare data from NOAA
 * Note: This is a simplified implementation. In production, use proper NOAA API endpoints.
 */
export async function fetchSolarFlareData(startDate: Date, endDate: Date): Promise<SolarFlareData[]> {
  try {
    // NOAA Space Weather Prediction Center - X-ray Flare data
    // URL: https://services.swpc.noaa.gov/json/goes/primary/xray-flares-latest.json
    const response = await axios.get('https://services.swpc.noaa.gov/json/goes/primary/xray-flares-latest.json', {
      timeout: 10000,
    });

    const flares = response.data;
    const flaresByDate: { [date: string]: { xClass: number; mClass: number } } = {};

    for (const flare of flares) {
      if (!flare.begin_time || !flare.max_class) continue;

      const flareDate = new Date(flare.begin_time);
      if (flareDate < startDate || flareDate > endDate) continue;

      const dateStr = flareDate.toISOString().split('T')[0];
      if (!flaresByDate[dateStr]) {
        flaresByDate[dateStr] = { xClass: 0, mClass: 0 };
      }

      const flareClass = flare.max_class.charAt(0);
      if (flareClass === 'X') {
        flaresByDate[dateStr].xClass++;
      } else if (flareClass === 'M') {
        flaresByDate[dateStr].mClass++;
      }
    }

    return Object.entries(flaresByDate).map(([date, counts]) => ({
      date,
      xClassCount: counts.xClass,
      mClassCount: counts.mClass,
    }));
  } catch (error) {
    console.error('Error fetching solar flare data:', error);
    return [];
  }
}

/**
 * Fetch Kp index data from Kyoto University WDC
 * Note: This is a simplified implementation using mock data for demonstration
 */
export async function fetchKpIndexData(year: number): Promise<KpIndexData[]> {
  try {
    // Kyoto University World Data Center for Geomagnetism
    // URL format: https://wdc.kugi.kyoto-u.ac.jp/kp/data/kpYYYY.dat
    // Note: The actual format is fixed-width text, requires parsing
    
    // For demonstration, we'll use NOAA's Kp index JSON API instead
    const response = await axios.get('https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json', {
      timeout: 10000,
    });

    const kpData = response.data;
    const kpByDate: { [date: string]: number[] } = {};

    // Skip header row
    for (let i = 1; i < kpData.length; i++) {
      const row = kpData[i];
      if (!row || row.length < 2) continue;

      const timestamp = row[0];
      const kpValue = parseFloat(row[1]);

      if (isNaN(kpValue)) continue;

      const date = new Date(timestamp);
      const dateStr = date.toISOString().split('T')[0];

      if (!kpByDate[dateStr]) {
        kpByDate[dateStr] = [];
      }
      kpByDate[dateStr].push(kpValue);
    }

    return Object.entries(kpByDate).map(([date, values]) => ({
      date,
      kpMax: Math.max(...values),
    }));
  } catch (error) {
    console.error('Error fetching Kp index data:', error);
    return [];
  }
}

/**
 * Fetch comprehensive space weather data for a date range
 */
export async function fetchSpaceWeatherDataRange(startDate: Date, endDate: Date): Promise<SpaceWeatherResult[]> {
  const [flareData, kpData] = await Promise.all([
    fetchSolarFlareData(startDate, endDate),
    fetchKpIndexData(startDate.getFullYear()),
  ]);

  // Merge data by date
  const dataByDate: { [date: string]: SpaceWeatherResult } = {};

  // Add flare data
  for (const flare of flareData) {
    dataByDate[flare.date] = {
      date: flare.date,
      xClassFlareCount: flare.xClassCount,
      mClassFlareCount: flare.mClassCount,
    };
  }

  // Add Kp index data
  for (const kp of kpData) {
    if (!dataByDate[kp.date]) {
      dataByDate[kp.date] = {
        date: kp.date,
        xClassFlareCount: 0,
        mClassFlareCount: 0,
      };
    }
    dataByDate[kp.date].kpIndexMax = kp.kpMax.toFixed(2);
  }

  return Object.values(dataByDate).sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Generate mock space weather data for testing
 * This simulates realistic patterns of solar activity
 */
export function generateMockSpaceWeatherData(startDate: Date, endDate: Date): SpaceWeatherResult[] {
  const results: SpaceWeatherResult[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split('T')[0];
    
    // Simulate solar activity with some randomness
    const baseActivity = Math.sin((currentDate.getTime() / (1000 * 60 * 60 * 24)) / 30) * 0.5 + 0.5;
    const random = Math.random();

    const xClassCount = random > 0.95 && baseActivity > 0.6 ? Math.floor(Math.random() * 3) : 0;
    const mClassCount = random > 0.7 && baseActivity > 0.4 ? Math.floor(Math.random() * 5) : 0;
    const kpMax = (baseActivity * 6 + Math.random() * 3).toFixed(2);
    const solarWindSpeed = (300 + baseActivity * 400 + Math.random() * 100).toFixed(0);

    results.push({
      date: dateStr,
      kpIndexMax: kpMax,
      xClassFlareCount: xClassCount,
      mClassFlareCount: mClassCount,
      solarWindSpeed,
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return results;
}
