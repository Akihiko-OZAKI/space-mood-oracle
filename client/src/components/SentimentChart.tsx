import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart, ComposedChart, Bar } from "recharts";
import { Activity, Sun } from "lucide-react";

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
}

interface SentimentChartProps {
  sentimentData: SentimentDataPoint[];
  spaceWeatherData: SpaceWeatherDataPoint[];
}

export function SentimentChart({ sentimentData, spaceWeatherData }: SentimentChartProps) {
  // Merge and format data for chart
  const chartData = sentimentData.map((sentiment) => {
    const spaceWeather = spaceWeatherData.find((sw) => sw.date === sentiment.date);
    return {
      date: new Date(sentiment.date).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' }),
      fullDate: sentiment.date,
      sentiment: parseFloat(sentiment.score),
      kpIndex: spaceWeather?.kpIndexMax ? parseFloat(spaceWeather.kpIndexMax) : 0,
      flares: (spaceWeather?.xClassFlareCount || 0) * 2 + (spaceWeather?.mClassFlareCount || 0),
      tweetCount: sentiment.tweetCount,
    };
  }).reverse().slice(-30); // Last 30 days

  return (
    <div className="space-y-6">
      {/* Sentiment Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            感情スコアトレンド（過去30日）
          </CardTitle>
          <CardDescription>集合感情の時系列変化</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="sentimentGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgb(168, 85, 247)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="rgb(168, 85, 247)" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="date" 
                stroke="rgba(255,255,255,0.5)"
                tick={{ fill: 'rgba(255,255,255,0.7)' }}
              />
              <YAxis 
                domain={[-1, 1]}
                stroke="rgba(255,255,255,0.5)"
                tick={{ fill: 'rgba(255,255,255,0.7)' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'rgba(255,255,255,0.9)' }}
              />
              <Area
                type="monotone"
                dataKey="sentiment"
                stroke="rgb(168, 85, 247)"
                strokeWidth={2}
                fill="url(#sentimentGradient)"
                name="感情スコア"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Correlation Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="h-5 w-5 text-yellow-400" />
            宇宙天気と感情の相関
          </CardTitle>
          <CardDescription>Kp指数・太陽フレアと感情スコアの関係</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
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
                tick={{ fill: 'rgba(255,255,255,0.7)' }}
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
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'rgba(255,255,255,0.9)' }}
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
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="kpIndex"
                stroke="rgb(251, 191, 36)"
                strokeWidth={2}
                fill="url(#kpGradient)"
                name="Kp指数"
              />
              <Bar
                yAxisId="right"
                dataKey="flares"
                fill="rgba(239, 68, 68, 0.5)"
                name="太陽フレア"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tweet Volume Chart */}
      <Card>
        <CardHeader>
          <CardTitle>投稿数トレンド</CardTitle>
          <CardDescription>日次の分析対象投稿数</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="tweetGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgb(59, 130, 246)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="rgb(59, 130, 246)" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="date" 
                stroke="rgba(255,255,255,0.5)"
                tick={{ fill: 'rgba(255,255,255,0.7)' }}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.5)"
                tick={{ fill: 'rgba(255,255,255,0.7)' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'rgba(255,255,255,0.9)' }}
              />
              <Area
                type="monotone"
                dataKey="tweetCount"
                stroke="rgb(59, 130, 246)"
                strokeWidth={2}
                fill="url(#tweetGradient)"
                name="投稿数"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
