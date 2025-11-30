import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

export function TweetUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; daysProcessed: number; tweetsAnalyzed: number; error?: string } | null>(null);

  const uploadMutation = trpc.tweetUpload.uploadCSV.useMutation({
    onSuccess: (data) => {
      setResult(data);
      setUploading(false);
      
      if (data.success) {
        toast.success(`成功: ${data.tweetsAnalyzed}件のツイートを分析し、${data.daysProcessed}日分のデータを保存しました`);
      } else {
        toast.error(`エラー: ${data.error}`);
      }
    },
    onError: (error) => {
      setUploading(false);
      toast.error(`エラー: ${error.message}`);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.csv')) {
        toast.error('CSVファイルを選択してください');
        return;
      }
      setFile(selectedFile);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('ファイルを選択してください');
      return;
    }

    setUploading(true);
    
    try {
      const text = await file.text();
      await uploadMutation.mutateAsync({ csvContent: text });
    } catch (error) {
      console.error('Upload error:', error);
      setUploading(false);
    }
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          ツイートデータアップロード
        </CardTitle>
        <CardDescription>
          CSVファイルをアップロードして、実際のツイートデータから感情分析を行います
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">CSVファイル</label>
          <div className="flex gap-2">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="flex-1 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              disabled={uploading}
            />
          </div>
          {file && (
            <p className="text-xs text-muted-foreground">
              選択されたファイル: {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </p>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            <strong>必要なカラム:</strong> date (日付), text (ツイート本文)
          </p>
          <p className="text-xs text-muted-foreground">
            ※ Pushshift Torrent、Twitter API、カスタムCSVに対応しています
          </p>
        </div>

        <Button 
          onClick={handleUpload} 
          disabled={!file || uploading}
          className="w-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          {uploading ? 'アップロード中...' : 'アップロードして分析'}
        </Button>

        {result && (
          <div className={`p-4 rounded-lg border ${result.success ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
            <div className="flex items-start gap-2">
              {result.success ? (
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
              )}
              <div className="flex-1">
                {result.success ? (
                  <>
                    <p className="font-medium text-green-500">アップロード成功</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {result.tweetsAnalyzed}件のツイートを分析し、{result.daysProcessed}日分のデータを保存しました
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-medium text-red-500">アップロード失敗</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {result.error}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
