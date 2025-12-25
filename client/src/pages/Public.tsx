import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SentimentChart } from "@/components/SentimentChart";
import { Sparkles, Sun, Activity, TrendingUp, Calendar } from "lucide-react";

export default function Public() {
  const { data: todayFortune, isLoading, error: fortuneError } = trpc.oracle.getTodayFortune.useQuery();

  const today = new Date();
  const endDate = today.toISOString().split("T")[0];
  const start = new Date(today);
  start.setDate(start.getDate() - 29); // 過去30日分をグラフに表示
  const startDate = start.toISOString().split("T")[0];

  const { data: sentimentScores, isLoading: scoresLoading, error: scoresError } =
    trpc.sentiment.getDailyScores.useQuery({
      startDate,
      endDate,
    });

  const { data: spaceWeatherData, isLoading: weatherLoading, error: weatherError } =
    trpc.spaceWeather.getData.useQuery({
      startDate,
      endDate,
    });

  const prediction = todayFortune?.prediction;
  const space = todayFortune?.spaceWeather;

  const predictedScore = prediction
    ? Number(prediction.predictedScore ?? 0)
    : 0;
  const confidence = prediction
    ? Number(prediction.confidence ?? 0)
    : 0;

  const kpIndex = space?.kpIndexMax ? parseFloat(space.kpIndexMax) : undefined;
  const xFlares = space?.xClassFlareCount ?? 0;
  const mFlares = space?.mClassFlareCount ?? 0;

  const getCosmicImpactText = () => {
    if (!space) {
      return "宇宙の声を受信しています...";
    }
    if (xFlares > 0) {
      return `強力な太陽フレア（Xクラス）が${xFlares}回発生しています。宇宙からのエネルギーが、世界の気分を大きく揺らしています。`;
    }
    if (mFlares > 3) {
      return `Mクラスフレアが${mFlares}回観測されています。太陽活動がやや高まり、集合意識にも微妙なノイズが走っています。`;
    }
    if (kpIndex !== undefined && kpIndex > 5) {
      return `地磁気嵐レベルの宇宙天気（Kp ${kpIndex.toFixed(
        1,
      )}）。眠気・頭痛・集中しづらさなど、不調が出ても「宇宙のせい」にしていい日です。`;
    }
    if (kpIndex !== undefined && kpIndex > 3) {
      return `やや地磁気が乱れた状態（Kp ${kpIndex.toFixed(
        1,
      )}）。心や体のリズムがいつもと違っても、それは宇宙の揺らぎと同調しているだけかもしれません。`;
    }
    return "今日は宇宙は比較的穏やかです。それでももし不調を感じるなら、その一部はきっと宇宙の静かな波のせいです。";
  };

  const getScoreLabel = () => {
    if (!prediction) return "データ準備中";
    if (predictedScore > 0.2) return "世界全体のムードは、やや上向き。";
    if (predictedScore < -0.2) return "世界全体のムードは、少し重たく揺らいでいます。";
    return "世界全体のムードは、大きな山も谷もないフラットな状態です。";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 text-white">
      <header className="border-b border-purple-500/30 bg-black/40 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="h-7 w-7 text-primary animate-pulse" />
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent">
                宇宙の意思 – Cosmic Mood Today
              </h1>
              <p className="text-xs text-muted-foreground">
                太陽と地磁気のデータだけから、人類の「今日の気分」を読む実験サイト
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {new Date().toLocaleDateString("ja-JP", {
              year: "numeric",
              month: "long",
              day: "numeric",
              weekday: "short",
            })}
          </div>
        </div>
      </header>

      <main className="container mx-auto py-10 space-y-10">
        <section className="max-w-3xl mx-auto text-center space-y-3">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-200 via-pink-200 to-blue-200 bg-clip-text text-transparent">
            あなたの今日の不調は、宇宙のせいだ。
          </h2>
          <p className="text-xs text-muted-foreground">
            過去の集合意識データと宇宙天気の相関から、「もし人類の気分が宇宙だけで決まるとしたら、今日はどう見えるか？」を推定しています。
          </p>
        </section>

        <section className="max-w-3xl mx-auto">
          <Card className="border-primary/30 bg-gradient-to-br from-black/60 via-purple-950/60 to-blue-950/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                宇宙だけから見た今日の集合意識
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                  <p className="text-lg font-semibold text-purple-300">宇宙からの信号を解析中...</p>
                  <p className="text-sm text-muted-foreground">しばらくお待ちください</p>
                </div>
              ) : fortuneError ? (
                <div className="space-y-2">
                  <p className="text-sm text-red-400 font-semibold">データ取得エラー</p>
                  <p className="text-xs text-muted-foreground">
                    APIサーバーに接続できませんでした。しばらくしてから再度お試しください。
                  </p>
                  <p className="text-[10px] text-muted-foreground/60 font-mono">
                    {fortuneError.message || "Unknown error"}
                  </p>
                </div>
              ) : !prediction || !space ? (
                <div className="space-y-3 py-6">
                  <div className="flex items-center gap-3">
                    <div className="animate-pulse rounded-full h-3 w-3 bg-yellow-500"></div>
                    <p className="text-base font-semibold text-yellow-400">
                      データを準備中です...
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    今日の宇宙天気データと推論モデルを自動取得しています。数秒後にページを再読み込みしてください。
                  </p>
                  {space && !prediction && (
                    <p className="text-xs text-yellow-400/80 mt-2">
                      💡 ヒント: 推論モデルの学習には、過去の集合意識データ（Hacker Newsの感情スコア）が必要です。
                    </p>
                  )}
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    <p className="text-lg font-semibold">{getScoreLabel()}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-xs text-muted-foreground/70 block mb-1">推定スコア（-1〜1）</span>
                        <p className="text-base font-medium">{predictedScore.toFixed(3)}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground/70 block mb-1">信頼度（0〜1）</span>
                        <p className="text-base font-medium">{confidence.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-black/30 border border-purple-500/30 space-y-3 text-sm">
                    <div className="flex items-center gap-2 text-purple-200">
                      <Sun className="h-4 w-4" />
                      <span className="font-semibold">今日の宇宙天気</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-xs md:text-sm">
                      <div>
                        <span className="text-muted-foreground/70 block mb-1">地磁気活動（Kp指数）</span>
                        <span className="font-medium">{space.kpIndexMax ?? "N/A"}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground/70 block mb-1">Xクラスフレア回数</span>
                        <span className="font-medium">{xFlares}回</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground/70 block mb-1">Mクラスフレア回数</span>
                        <span className="font-medium">{mFlares}回</span>
                      </div>
                    </div>
                    <p className="text-xs md:text-sm text-muted-foreground mt-2 leading-relaxed">
                      {getCosmicImpactText()}
                    </p>
                  </div>

                  <p className="text-[11px] text-muted-foreground">
                    ※ このサイトは医療・投資などの意思決定を目的としたものではありません。
                    「今日は宇宙のコンディションが悪いから、少し自分に甘くしてもいいかも」と思える口実としてお使いください。
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </section>

        {/* グラフ: 過去30日分の宇宙と集合意識の動き */}
        {(scoresError || weatherError) && (
          <section className="max-w-4xl mx-auto">
            <Card className="border-yellow-500/30 bg-black/40">
              <CardContent className="pt-6">
                <p className="text-sm text-yellow-400/80">
                  グラフデータの取得中にエラーが発生しました。メインの表示は正常に動作しています。
                </p>
              </CardContent>
            </Card>
          </section>
        )}
        {!scoresError && !weatherError && sentimentScores &&
          sentimentScores.length > 0 &&
          spaceWeatherData &&
          spaceWeatherData.length > 0 && (
            <section className="max-w-4xl mx-auto">
              <Card className="border-purple-500/30 bg-black/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    過去30日間の「宇宙」と「集合意識」
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {scoresLoading || weatherLoading ? (
                    <p className="text-sm text-muted-foreground">
                      データを読み込み中です...
                    </p>
                  ) : (
                    <SentimentChart
                      sentimentData={sentimentScores}
                      spaceWeatherData={spaceWeatherData}
                    />
                  )}
                  <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                    <span className="font-medium text-foreground">紫の線（感情スコア）:</span> Hacker News のストーリータイトルを多言語感情辞書で分析した実際の集合意識スコア（-1〜1）。<br/>
                    <span className="font-medium text-foreground">各グラフの指標:</span> 地磁気活動（Kp指数、0〜9）、太陽フレア回数（X/Mクラス）、プロトンフラックス（高エネルギー陽子フラックス、{">="}10 MeV）。<br/>
                    これらの過去データから推論モデルを学習し、<span className="font-medium text-primary">今日の「宇宙だけから見た集合意識」（上記の推定スコア）</span>を生成しています。
                  </p>
                </CardContent>
              </Card>
            </section>
          )}

        {/* サイトとモデルの説明 */}
        <section className="max-w-3xl mx-auto">
          <Card className="border-purple-500/30 bg-black/40">
            <CardHeader>
              <CardTitle>このサイトが示していること</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>
                「宇宙の意思」は、宇宙天気データ（太陽フレアや地磁気活動）と、人類の集合意識の変化のあいだに
                どんな関係があるのかを探るための実験サイトです。
                公開版では、「もし人々の気分が宇宙だけで決まるとしたら、今日はどんな日か？」を推定して表示します。
              </p>
              <div>
                <h3 className="font-semibold text-foreground mb-1">データソース</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    <span className="font-medium text-foreground">地磁気活動（Kp指数）:</span>{" "}
                    NOAA Space Weather Prediction Center が提供する 1分ごとの planetary K-index から、
                    その日の最大値を指標として使用しています。Kp は 0〜9 のスケールで、値が大きいほど
                    地球の磁場の乱れが強く、5 以上になると地磁気嵐レベルとみなされます。
                  </li>
                  <li>
                    <span className="font-medium text-foreground">太陽フレア（X/Mクラス）:</span>{" "}
                    X線フレアのイベント一覧（type = XRA）から、その日に発生した Xクラス・Mクラスのフレア回数を集計し、
                    「Xクラスフレア回数」「Mクラスフレア回数」として記録しています。Xクラスは最も強いフレアで、
                    通信障害や電離層撹乱の原因になるレベルです。
                  </li>
                  <li>
                    <span className="font-medium text-foreground">高エネルギー陽子フラックス:</span>{" "}
                    GOES衛星による積分陽子フラックス（&gt;=10MeV）から日ごとの最大値を取得し、NOAA の Solar
                    Radiation Storm Scale に従って S0〜S5 の「太陽放射嵐スケール（solarRadiationScale）」に変換しています。
                    値が大きいほど、宇宙線によるストレスや電子機器への影響が強い状態を表します。
                  </li>
                  <li>
                    <span className="font-medium text-foreground">集合意識:</span>{" "}
                    Hacker News のストーリータイトルを日付ごとに集計し、多言語感情辞書ベースのエンジンで極性スコア
                    （-1〜1）に変換したものを、日別の「集合ムード」として扱っています。
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">モデルの概要</h3>
                <p>
                  過去90日分のデータから、「宇宙指標（Kp指数・X/Mクラスフレアの回数）」と
                  「日別集合感情スコア」の相関を計算し、単純な線形モデルで
                  「宇宙活動の強さがどれくらいムードを上下させるか」を推定しています。
                  公開版では、そのモデルに今日の宇宙データだけを入力し、集合意識スコアを推論しています。
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">今日の状況の読み方</h3>
                <p>
                  推定スコアが正に近いほど「宇宙的にはポジティブ寄り」、負に近いほど「宇宙的には重たい雰囲気」と解釈できます。
                  信頼度は 0〜1 の範囲で、過去データの量と相関の強さから算出されています。
                  数値はあくまで参考ですが、「今日は宇宙のコンディションのせいで、ちょっと調子が揺らいでいるかも」と
                  受け止めるための、ゆるい指標としてお使いください。
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}


