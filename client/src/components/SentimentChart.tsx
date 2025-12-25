import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart, ComposedChart, Bar } from "recharts";
import { Sun, Activity, Zap } from "lucide-react";

interface SentimentDataPoint {
  date: string;
  score: string;
  tweetCount: number;
}

interface SpaceWeatherDataPoint {
  date: string;
  kpIndexMax?: string | null;
  xClassFlareCount: number;
  mClassFlareCount: number;
  protonFlux?: string | null;
}

interface SentimentChartProps {
  sentimentData: SentimentDataPoint[];
  spaceWeatherData: SpaceWeatherDataPoint[];
}

export function SentimentChart({ sentimentData, spaceWeatherData }: SentimentChartProps) {
  // Create a map for quick lookup
  const sentimentByDate = new Map(sentimentData.map(s => [s.date, s]));
  const spaceWeatherByDate = new Map(spaceWeatherData.map(sw => [sw.date, sw]));
  
  // Get all unique dates and merge data
  const allDates = Array.from(new Set([
    ...sentimentData.map(s => s.date),
    ...spaceWeatherData.map(sw => sw.date)
  ])).sort();

  // Create chart data with sentiment and space weather merged
  const chartData = allDates.map(date => {
    const sentiment = sentimentByDate.get(date);
    const spaceWeather = spaceWeatherByDate.get(date);
    
    return {
      date: new Date(date).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' }),
      fullDate: date,
      sentiment: sentiment ? parseFloat(sentiment.score) : null,
      kpIndex: spaceWeather?.kpIndexMax ? parseFloat(spaceWeather.kpIndexMax) : null,
      flares: spaceWeather ? (spaceWeather.xClassFlareCount || 0) + (spaceWeather.mClassFlareCount || 0) : null,
      protonFlux: spaceWeather?.protonFlux ? parseFloat(spaceWeather.protonFlux) : null,
    };
  }).reverse().slice(-30); // Last 30 days

  // Calculate max values for scaling
  const maxFlares = Math.max(...chartData.map(d => d.flares || 0), 1);
  const maxProtonFlux = Math.max(...chartData.map(d => d.protonFlux || 0), 100);

  // 個別のグラフ要素を返す（グリッドレイアウト用）
  const kpChart = (
    <Card key="kp-chart">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-yellow-400" />
            地磁気活動（Kp指数）と感情スコア
          </CardTitle>
          <CardDescription>過去30日間のKp指数と集合意識の相関</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={chartData}>
              <defs>
                <linearGradient id="kpGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgb(251, 191, 36)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="rgb(251, 191, 36)" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="date" 
                stroke="rgba(255,255,255,0.5)"
                tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
              />
              <YAxis 
                yAxisId="left"
                domain={[-1, 1]}
                stroke="rgba(255,255,255,0.5)"
                tick={{ fill: 'rgba(255,255,255,0.7)' }}
                label={{ value: '感情スコア', angle: -90, position: 'insideLeft', fill: 'rgba(255,255,255,0.7)' }}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                domain={[0, 9]}
                stroke="rgba(255,255,255,0.5)"
                tick={{ fill: 'rgba(255,255,255,0.7)' }}
                label={{ value: 'Kp指数', angle: 90, position: 'insideRight', fill: 'rgba(255,255,255,0.7)' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.9)',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'rgba(255,255,255,0.9)' }}
                formatter={(value: any, name: string) => {
                  if (name === '感情スコア') {
                    return [value !== null ? value.toFixed(4) : 'N/A', name];
                  }
                  if (name === 'Kp指数') {
                    return [value !== null ? value.toFixed(2) : 'N/A', name];
                  }
                  return [value, name];
                }}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="sentiment"
                stroke="rgb(168, 85, 247)"
                strokeWidth={2}
                dot={{ fill: 'rgb(168, 85, 247)', r: 3 }}
                name="感情スコア"
                connectNulls={false}
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="kpIndex"
                stroke="rgb(251, 191, 36)"
                strokeWidth={2}
                fill="url(#kpGradient)"
                name="Kp指数"
                connectNulls={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
  );

  const flareChart = (
    <Card key="flare-chart">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="h-5 w-5 text-orange-400" />
            太陽フレアと感情スコア
          </CardTitle>
          <CardDescription>過去30日間のX/Mクラスフレア発生回数と集合意識の相関</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="date" 
                stroke="rgba(255,255,255,0.5)"
                tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
              />
              <YAxis 
                yAxisId="left"
                domain={[-1, 1]}
                stroke="rgba(255,255,255,0.5)"
                tick={{ fill: 'rgba(255,255,255,0.7)' }}
                label={{ value: '感情スコア', angle: -90, position: 'insideLeft', fill: 'rgba(255,255,255,0.7)' }}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                domain={[0, Math.ceil(maxFlares * 1.2)]}
                stroke="rgba(255,255,255,0.5)"
                tick={{ fill: 'rgba(255,255,255,0.7)' }}
                label={{ value: 'フレア回数', angle: 90, position: 'insideRight', fill: 'rgba(255,255,255,0.7)' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.9)',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'rgba(255,255,255,0.9)' }}
                formatter={(value: any, name: string) => {
                  if (name === '感情スコア') {
                    return [value !== null ? value.toFixed(4) : 'N/A', name];
                  }
                  if (name === '太陽フレア') {
                    return [value !== null ? value + '回' : 'N/A', name];
                  }
                  return [value, name];
                }}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="sentiment"
                stroke="rgb(168, 85, 247)"
                strokeWidth={2}
                dot={{ fill: 'rgb(168, 85, 247)', r: 3 }}
                name="感情スコア"
                connectNulls={false}
              />
              <Bar
                yAxisId="right"
                dataKey="flares"
                fill="rgba(239, 68, 68, 0.6)"
                name="太陽フレア"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
  );

  const protonChart = (
    <Card key="proton-chart">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-400" />
            プロトンフラックスと感情スコア
          </CardTitle>
          <CardDescription>過去30日間の高エネルギー陽子フラックス（{">="}10 MeV）と集合意識の相関</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={chartData}>
              <defs>
                <linearGradient id="protonGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgb(59, 130, 246)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="rgb(59, 130, 246)" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="date" 
                stroke="rgba(255,255,255,0.5)"
                tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
              />
              <YAxis 
                yAxisId="left"
                domain={[-1, 1]}
                stroke="rgba(255,255,255,0.5)"
                tick={{ fill: 'rgba(255,255,255,0.7)' }}
                label={{ value: '感情スコア', angle: -90, position: 'insideLeft', fill: 'rgba(255,255,255,0.7)' }}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                domain={[0, Math.ceil(maxProtonFlux * 1.2)]}
                stroke="rgba(255,255,255,0.5)"
                tick={{ fill: 'rgba(255,255,255,0.7)' }}
                label={{ value: 'プロトンフラックス (pfu)', angle: 90, position: 'insideRight', fill: 'rgba(255,255,255,0.7)' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.9)',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'rgba(255,255,255,0.9)' }}
                formatter={(value: any, name: string) => {
                  if (name === '感情スコア') {
                    return [value !== null ? value.toFixed(4) : 'N/A', name];
                  }
                  if (name === 'プロトンフラックス') {
                    return [value !== null ? value.toFixed(2) + ' pfu' : 'N/A', name];
                  }
                  return [value, name];
                }}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="sentiment"
                stroke="rgb(168, 85, 247)"
                strokeWidth={2}
                dot={{ fill: 'rgb(168, 85, 247)', r: 3 }}
                name="感情スコア"
                connectNulls={false}
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="protonFlux"
                stroke="rgb(59, 130, 246)"
                strokeWidth={2}
                fill="url(#protonGradient)"
                name="プロトンフラックス"
                connectNulls={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
  );

  return (
    <>
      {kpChart}
      {flareChart}
      {protonChart}
    </>
  );
}
