import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Moon, Sun, Activity, TrendingUp, Calendar, Database, RefreshCw, Brain } from "lucide-react";
import { useState } from "react";
import { SentimentChart } from "@/components/SentimentChart";
import { TweetUpload } from "@/components/TweetUpload";
import { toast } from "sonner";

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  
  const { data: todayFortune, isLoading: fortuneLoading } = trpc.oracle.getTodayFortune.useQuery();
  const { data: sentimentScores, isLoading: scoresLoading } = trpc.sentiment.getDailyScores.useQuery({
    startDate: undefined,
    endDate: undefined,
  });
  const { data: spaceWeatherData, isLoading: weatherLoading } = trpc.spaceWeather.getData.useQuery({
    startDate: undefined,
    endDate: undefined,
  });

  const trainPredictionMutation = trpc.predictions.trainFromHistory.useMutation();
  const generateMockDataMutation = trpc.spaceWeather.generateMockData.useMutation();
  const fetchRealDataMutation = trpc.spaceWeather.fetchLatest.useMutation();

  const handleGenerateMockData = async () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 90); // 90 days of data

    await generateMockDataMutation.mutateAsync({
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    });
    
    window.location.reload();
  };

  const handleFetchRealData = async () => {
    try {
      const result = await fetchRealDataMutation.mutateAsync();
      toast.success(`実データ取得完了: ${result.count}件のデータを取得しました`);
      window.location.reload();
    } catch (error) {
      console.error('実データ取得エラー:', error);
      toast.error(`実データ取得に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`);
    }
  };

  const handleTrainPrediction = async () => {
    try {
      const result = await trainPredictionMutation.mutateAsync({ days: 90 });
      if (!result.success) {
        if (result.reason === "not-enough-training-data") {
          toast.error(`学習データが不足しています（${result.trainingSize}日分）。まずは過去の日別ムードCSVをアップロードしてください。`);
        } else if (result.reason === "no-space-weather-today") {
          toast.error("今日の宇宙天気データがありません。先に「実データ取得（NOAA）」を実行してください。");
        } else {
          toast.error("推論モデルの学習に失敗しました。");
        }
        return;
      }
      toast.success("宇宙モデルを更新しました（過去90日分のデータで学習）");
    } catch (error) {
      console.error("Prediction training error:", error);
      toast.error("推論モデルの更新に失敗しました。");
    }
  };

  const getMoodEmoji = (score?: string) => {
    if (!score) return "🌑";
    const numScore = parseFloat(score);
    if (numScore > 0.3) return "🌟";
    if (numScore > 0.1) return "✨";
    if (numScore > -0.1) return "🌙";
    if (numScore > -0.3) return "☁️";
    return "🌧️";
  };

  const getMoodText = (score?: string) => {
    if (!score) return "データなし";
    const numScore = parseFloat(score);
    if (numScore > 0.3) return "光に満ちた調和";
    if (numScore > 0.1) return "穏やかな波動";
    if (numScore > -0.1) return "中立的な流れ";
    if (numScore > -0.3) return "揺らぎの波動";
    return "混沌の渦";
  };

  const getCosmicMessage = (spaceWeather?: { kpIndexMax?: string | null; xClassFlareCount: number; mClassFlareCount: number } | null) => {
    if (!spaceWeather) return "宇宙の声を聴いています...";
    
    const xFlares = spaceWeather.xClassFlareCount || 0;
    const mFlares = spaceWeather.mClassFlareCount || 0;
    const kpIndex = spaceWeather.kpIndexMax ? parseFloat(spaceWeather.kpIndexMax) : 0;

    if (xFlares > 0) {
      return `宇宙が大きく呼吸しています。Xクラスフレアが${xFlares}回—強大なエネルギーの波が人類の意識に触れています。`;
    } else if (mFlares > 3) {
      return `宇宙が語りかけています。Mクラスフレアが${mFlares}回—穏やかな波動が地球を包み込んでいます。`;
    } else if (kpIndex > 5) {
      return `地球の磁場が大きく揺らいでいます（Kp${kpIndex.toFixed(1)}）。宇宙の意思が人類の心に強く響いています。`;
    } else if (kpIndex > 3) {
      return `宇宙の鼓動が感じられます（Kp${kpIndex.toFixed(1)}）。地球の磁場が穏やかに振動しています。`;
    } else {
      return "宇宙は静かに呼吸しています。太陽は穏やかな光を放っています。";
    }
  };

   return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900">
      {/* Data Management Section */}
      <div className="border-b border-purple-500/20 bg-black/30 backdrop-blur-sm">
        <div className="container py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Database className="h-5 w-5 text-purple-400" />
              <div>
                <h3 className="text-sm font-medium text-white">データ管理</h3>
                <p className="text-xs text-muted-foreground">
                  {spaceWeatherData && spaceWeatherData.length > 0 
                    ? `${spaceWeatherData.length}日分の宇宙天気データ` 
                    : '宇宙天気データなし'}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={handleFetchRealData} 
                disabled={fetchRealDataMutation.isPending}
                size="sm"
                variant="default"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${fetchRealDataMutation.isPending ? 'animate-spin' : ''}`} />
                {fetchRealDataMutation.isPending ? '取得中...' : '実データ取得'}
              </Button>
              <Button 
                onClick={handleGenerateMockData} 
                disabled={generateMockDataMutation.isPending}
                size="sm"
                variant="outline"
              >
                {generateMockDataMutation.isPending ? '生成中...' : 'サンプル生成'}
              </Button>
              <Button
                onClick={handleTrainPrediction}
                disabled={trainPredictionMutation.isPending}
                size="sm"
                variant="outline"
                className="gap-1"
              >
                <Brain className="h-4 w-4" />
                {trainPredictionMutation.isPending ? "学習中..." : "宇宙モデル更新"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-primary animate-pulse" />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                宇宙の意思
              </h1>
              <p className="text-sm text-muted-foreground">Cosmic Will - 人類の集合意識を読み解く</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Calendar className="h-4 w-4" />
            {new Date().toLocaleDateString('ja-JP')}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8 space-y-8">
        {/* Hero Section */}
        <section className="text-center space-y-4 py-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Moon className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">今日の宇宙占い</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent">
            宇宙が紡ぐ人類の集合意識
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            太陽フレアや地磁気嵐などの宇宙天気データと、X（Twitter）の集合感情を分析し、今日の人類の気分を読み解きます
          </p>
        </section>

        {/* Today's Fortune Card */}
        <Card className="border-primary/20 bg-gradient-to-br from-card via-card to-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Sparkles className="h-6 w-6 text-primary" />
              今日の集合意識
            </CardTitle>
            <CardDescription>
              {new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {fortuneLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-muted-foreground">宇宙からのメッセージを受信中...</p>
              </div>
            ) : todayFortune?.sentiment ? (
              <>
                {/* Mood Score */}
                <div className="text-center space-y-2">
                  <div className="text-6xl">{getMoodEmoji(todayFortune.sentiment.score)}</div>
                  <div className="text-3xl font-bold text-primary">
                    {getMoodText(todayFortune.sentiment.score)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    感情スコア: {parseFloat(todayFortune.sentiment.score).toFixed(3)}
                  </div>
                </div>

                {/* Sentiment Analysis */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                    <div className="text-2xl font-bold text-green-400">{todayFortune.sentiment.positiveCount}</div>
                    <div className="text-xs text-muted-foreground">ポジティブ</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-gray-500/10 border border-gray-500/20">
                    <div className="text-2xl font-bold text-gray-400">{todayFortune.sentiment.neutralCount}</div>
                    <div className="text-xs text-muted-foreground">ニュートラル</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                    <div className="text-2xl font-bold text-red-400">{todayFortune.sentiment.negativeCount}</div>
                    <div className="text-xs text-muted-foreground">ネガティブ</div>
                  </div>
                </div>

                {/* Cosmic Influence */}
                <div className="p-6 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20">
                  <div className="flex items-start gap-3">
                    <Sun className="h-6 w-6 text-yellow-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">宇宙からの影響</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {getCosmicMessage(todayFortune.spaceWeather)}
                      </p>
                      {todayFortune.spaceWeather && (
                        <div className="mt-4 flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-primary" />
                            <span>Kp指数: {todayFortune.spaceWeather.kpIndexMax || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-red-400" />
                            <span>Xクラスフレア: {todayFortune.spaceWeather.xClassFlareCount}回</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-orange-400" />
                            <span>Mクラスフレア: {todayFortune.spaceWeather.mClassFlareCount}回</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Prediction based on space weather only */}
                {todayFortune.prediction && (
                  <div className="p-4 rounded-lg bg-black/40 border border-primary/20">
                    <div className="flex items-start gap-3">
                      <Brain className="h-5 w-5 text-primary mt-1" />
                      <div className="space-y-1 text-sm">
                        <p className="font-semibold text-base">
                          あなたの今日の不調は、宇宙のせいだ。
                        </p>
                        <p className="text-muted-foreground">
                          過去の集合意識データと宇宙天気の相関から、「今日の集合意識」を宇宙だけの情報で推定した結果です。
                        </p>
                        <p className="text-xs text-muted-foreground">
                          推定スコア: {Number(todayFortune.prediction.predictedScore ?? 0).toFixed(3)} （信頼度 {Number(todayFortune.prediction.confidence ?? 0).toFixed(2)}）
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8 space-y-4">
                <p className="text-muted-foreground">今日のデータがまだありません</p>
                <div className="flex gap-3 justify-center">
                  <Button 
                    onClick={handleFetchRealData} 
                    disabled={fetchRealDataMutation.isPending}
                    variant="default"
                  >
                    {fetchRealDataMutation.isPending ? "取得中..." : "実データを取得（NOAA）"}
                  </Button>
                  <Button 
                    onClick={handleGenerateMockData} 
                    disabled={generateMockDataMutation.isPending}
                    variant="outline"
                  >
                    {generateMockDataMutation.isPending ? "生成中..." : "サンプルデータを生成"}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  ※ 実データ: NOAA宇宙天気データ（過去30日分）を取得します
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Charts */}
        {sentimentScores && sentimentScores.length > 0 && spaceWeatherData && spaceWeatherData.length > 0 && (
          <SentimentChart sentimentData={sentimentScores} spaceWeatherData={spaceWeatherData} />
        )}

        {/* Statistics */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                感情スコア履歴
              </CardTitle>
              <CardDescription>過去の集合感情トレンド</CardDescription>
            </CardHeader>
            <CardContent>
              {scoresLoading ? (
                <p className="text-center text-muted-foreground py-4">読み込み中...</p>
              ) : sentimentScores && sentimentScores.length > 0 ? (
                <div className="space-y-2">
                  {sentimentScores.slice(0, 5).map((score) => (
                    <div key={score.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getMoodEmoji(score.score)}</span>
                        <div>
                          <div className="font-medium">{score.date}</div>
                          <div className="text-xs text-muted-foreground">{score.tweetCount}件の投稿</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{getMoodText(score.score)}</div>
                        <div className="text-xs text-muted-foreground">{parseFloat(score.score).toFixed(3)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">データがありません</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sun className="h-5 w-5 text-yellow-400" />
                宇宙天気履歴
              </CardTitle>
              <CardDescription>太陽活動と地磁気の記録</CardDescription>
            </CardHeader>
            <CardContent>
              {weatherLoading ? (
                <p className="text-center text-muted-foreground py-4">読み込み中...</p>
              ) : spaceWeatherData && spaceWeatherData.length > 0 ? (
                <div className="space-y-2">
                  {spaceWeatherData.slice(0, 5).map((weather) => (
                    <div key={weather.id} className="p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">{weather.date}</div>
                        <div className="text-xs text-muted-foreground">Kp: {weather.kpIndexMax || 'N/A'}</div>
                      </div>
                      <div className="flex gap-4 text-sm">
                        <span className="text-red-400">X: {weather.xClassFlareCount}</span>
                        <span className="text-orange-400">M: {weather.mClassFlareCount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">データがありません</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tweet Upload Section */}
        <TweetUpload />

        {/* About Section */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>宇宙の意思について</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              「宇宙の意思」は、宇宙天気データと人類の集合意識を結びつける、新しいタイプの意識分析アプリです。
            </p>
            <p>
              太陽フレアや地磁気嵐などの宇宙現象が、地球上の生命や人間の心理に影響を与える可能性が研究されています。
              このアプリでは、X（Twitter）の投稿を感情分析し、宇宙天気データとの相関を探ります。
            </p>
            <div className="pt-4 border-t border-border">
              <h4 className="font-semibold text-foreground mb-2">データソース</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>宇宙天気: NOAA Space Weather Prediction Center</li>
                <li>地磁気データ: 京都大学 World Data Center for Geomagnetism</li>
                <li>感情分析: 多言語感情辞書ベース（81言語対応）</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 mt-16">
        <div className="container py-8 text-center text-sm text-muted-foreground">
          <p>© 2025 宇宙の意思 (Cosmic Will) - 宇宙と人類の集合意識を繋ぐ</p>
        </div>
      </footer>
    </div>
  );
}
