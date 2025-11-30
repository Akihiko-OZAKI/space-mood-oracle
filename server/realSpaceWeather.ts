/**
 * Real Space Weather Data Fetcher
 * Fetches actual data from NOAA Space Weather Prediction Center
 * All APIs are free and require no authentication
 */

import axios from 'axios';

const NOAA_BASE_URL = 'https://services.swpc.noaa.gov/json';

interface NOAAFlareEvent {
  begin_datetime: string;
  max_datetime: string;
  end_datetime: string;
  type: string;
  particulars1: string; // Flare class (e.g., "C5.1", "M2.3", "X1.5")
  particulars2: string; // Peak flux
}

interface NOAAKpIndex {
  time_tag: string;
  kp_index: number;
  estimated_kp: number;
}

interface NOAAProtonFlux {
  time_tag: string;
  satellite: number;
  flux: number;
  energy: string;
}

export interface ProcessedSpaceWeatherData {
  date: string;
  kpIndexMax: number;
  xClassFlareCount: number;
  mClassFlareCount: number;
  solarWindSpeed: number | null;
  protonFlux: number | null;
  solarRadiationScale: number; // S-scale: 0-5
}

/**
 * Calculate S-scale from proton flux (>=10 MeV)
 * S1 (Minor): >= 10 pfu
 * S2 (Moderate): >= 100 pfu
 * S3 (Strong): >= 1,000 pfu
 * S4 (Severe): >= 10,000 pfu
 * S5 (Extreme): >= 100,000 pfu
 */
function calculateSScale(protonFlux: number): number {
  if (protonFlux >= 100000) return 5;
  if (protonFlux >= 10000) return 4;
  if (protonFlux >= 1000) return 3;
  if (protonFlux >= 100) return 2;
  if (protonFlux >= 10) return 1;
  return 0;
}

/**
 * Fetch solar flare events from NOAA
 */
export async function fetchSolarFlares(startDate: Date, endDate: Date): Promise<NOAAFlareEvent[]> {
  try {
    const response = await axios.get(`${NOAA_BASE_URL}/edited_events.json`, {
      timeout: 30000,
    });
    
    const events: NOAAFlareEvent[] = response.data;
    
    // Filter by date range and type (XRA = X-ray flares)
    return events.filter(event => {
      if (event.type !== 'XRA') return false;
      
      const eventDate = new Date(event.begin_datetime);
      return eventDate >= startDate && eventDate <= endDate;
    });
  } catch (error) {
    console.error('Failed to fetch solar flares from NOAA:', error);
    return [];
  }
}

/**
 * Fetch Kp index data from NOAA
 */
export async function fetchKpIndex(): Promise<NOAAKpIndex[]> {
  try {
    const response = await axios.get(`${NOAA_BASE_URL}/planetary_k_index_1m.json`, {
      timeout: 30000,
    });
    
    return response.data;
  } catch (error) {
    console.error('Failed to fetch Kp index from NOAA:', error);
    return [];
  }
}

/**
 * Fetch proton flux data from NOAA GOES satellite
 */
export async function fetchProtonFlux(): Promise<NOAAProtonFlux[]> {
  try {
    const response = await axios.get(`${NOAA_BASE_URL}/goes/primary/integral-protons-1-day.json`, {
      timeout: 30000,
    });
    
    return response.data;
  } catch (error) {
    console.error('Failed to fetch proton flux from NOAA:', error);
    return [];
  }
}

/**
 * Process and aggregate space weather data by date
 */
export async function fetchRealSpaceWeatherData(
  startDate: Date,
  endDate: Date
): Promise<ProcessedSpaceWeatherData[]> {
  try {
    // Fetch all datasets in parallel
    const [flares, kpData, protonData] = await Promise.all([
      fetchSolarFlares(startDate, endDate),
      fetchKpIndex(),
      fetchProtonFlux(),
    ]);

    // Group data by date
    const dataByDate = new Map<string, ProcessedSpaceWeatherData>();

    // Initialize dates
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      dataByDate.set(dateStr, {
        date: dateStr,
        kpIndexMax: 0,
        xClassFlareCount: 0,
        mClassFlareCount: 0,
        solarWindSpeed: null,
        protonFlux: null,
        solarRadiationScale: 0,
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Process flare data
    for (const flare of flares) {
      const dateStr = flare.begin_datetime.split('T')[0];
      const data = dataByDate.get(dateStr);
      
      if (data) {
        const flareClass = flare.particulars1.charAt(0).toUpperCase();
        
        if (flareClass === 'X') {
          data.xClassFlareCount++;
        } else if (flareClass === 'M') {
          data.mClassFlareCount++;
        }
      }
    }

    // Process Kp index data (aggregate by day)
    const kpByDate = new Map<string, number[]>();
    
    for (const kp of kpData) {
      const dateStr = kp.time_tag.split('T')[0];
      
      if (!kpByDate.has(dateStr)) {
        kpByDate.set(dateStr, []);
      }
      
      kpByDate.get(dateStr)!.push(kp.estimated_kp);
    }

    // Calculate daily Kp statistics
    for (const [dateStr, kpValues] of Array.from(kpByDate.entries())) {
      const data = dataByDate.get(dateStr);
      
      if (data && kpValues.length > 0) {
        data.kpIndexMax = Math.max(...kpValues);
      }
    }

    // Process proton flux data (>=10 MeV for S-scale)
    const protonByDate = new Map<string, number[]>();
    
    for (const proton of protonData) {
      // Only use >=10 MeV data for S-scale calculation
      if (proton.energy === '>=10 MeV') {
        const dateStr = proton.time_tag.split('T')[0];
        
        if (!protonByDate.has(dateStr)) {
          protonByDate.set(dateStr, []);
        }
        
        protonByDate.get(dateStr)!.push(proton.flux);
      }
    }

    // Calculate daily proton flux max and S-scale
    for (const [dateStr, fluxValues] of Array.from(protonByDate.entries())) {
      const data = dataByDate.get(dateStr);
      
      if (data && fluxValues.length > 0) {
        const maxFlux = Math.max(...fluxValues);
        data.protonFlux = maxFlux;
        data.solarRadiationScale = calculateSScale(maxFlux);
      }
    }

    // Convert to array and sort by date
    return Array.from(dataByDate.values()).sort((a, b) => 
      a.date.localeCompare(b.date)
    );
  } catch (error) {
    console.error('Failed to fetch real space weather data:', error);
    throw error;
  }
}

/**
 * Get today's space weather data
 */
export async function getTodaySpaceWeather(): Promise<ProcessedSpaceWeatherData | null> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const data = await fetchRealSpaceWeatherData(today, tomorrow);
  
  return data.length > 0 ? data[0] : null;
}

/**
 * Save real space weather data to database
 */
export async function saveRealDataToDatabase(data: ProcessedSpaceWeatherData[]) {
  const { getDb } = await import('./db');
  const { spaceWeatherData } = await import('../drizzle/schema');
  const { eq } = await import('drizzle-orm');
  
  const db = await getDb();
  if (!db) {
    throw new Error('Database not available');
  }

  for (const item of data) {
    // Check if data already exists
    const existing = await db
      .select()
      .from(spaceWeatherData)
      .where(eq(spaceWeatherData.date, item.date))
      .limit(1);

    if (existing.length > 0) {
      // Update existing record
      await db
        .update(spaceWeatherData)
        .set({
          kpIndexMax: item.kpIndexMax.toFixed(2),
          xClassFlareCount: item.xClassFlareCount,
          mClassFlareCount: item.mClassFlareCount,
          solarWindSpeed: item.solarWindSpeed?.toFixed(2) || null,
          protonFlux: item.protonFlux?.toFixed(2) || null,
          solarRadiationScale: item.solarRadiationScale,
          updatedAt: new Date(),
        })
        .where(eq(spaceWeatherData.date, item.date));
    } else {
      // Insert new record
      await db.insert(spaceWeatherData).values({
        date: item.date,
        kpIndexMax: item.kpIndexMax.toFixed(2),
        xClassFlareCount: item.xClassFlareCount,
        mClassFlareCount: item.mClassFlareCount,
        solarWindSpeed: item.solarWindSpeed?.toFixed(2) || null,
        protonFlux: item.protonFlux?.toFixed(2) || null,
        solarRadiationScale: item.solarRadiationScale,
      });
    }
  }

  console.log(`✅ Saved ${data.length} days of real space weather data to database`);
}
