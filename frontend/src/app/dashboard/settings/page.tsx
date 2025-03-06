'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    llmProvider: 'openai',
    llmModel: 'gpt-4',
    embeddingModel: 'text-embedding-3-small',
    chunkSize: 1000,
    chunkOverlap: 200,
    retrievalCount: 5,
    temperature: 0.7,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'number' ? parseFloat(value) : value;
    
    setSettings(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // API呼び出しをここに実装
    alert('設定が保存されました');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">システム設定</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">LLM設定</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="llmProvider" className="text-sm font-medium">
                LLMプロバイダー
              </label>
              <select
                id="llmProvider"
                name="llmProvider"
                value={settings.llmProvider}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              >
                <option value="openai">OpenAI</option>
                <option value="anthropic">Anthropic</option>
                <option value="mistral">Mistral AI</option>
                <option value="llama">Meta (Llama)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="llmModel" className="text-sm font-medium">
                LLMモデル
              </label>
              <select
                id="llmModel"
                name="llmModel"
                value={settings.llmModel}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              >
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-4o">GPT-4o</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                <option value="claude-3-opus">Claude 3 Opus</option>
                <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                <option value="mixtral-8x7b">Mixtral 8x7B</option>
                <option value="llama-3-70b">Llama 3 70B</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="temperature" className="text-sm font-medium">
                温度（0-1）
              </label>
              <input
                id="temperature"
                name="temperature"
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.temperature}
                onChange={handleChange}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>精確 (0)</span>
                <span>{settings.temperature}</span>
                <span>創造的 (1)</span>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="embeddingModel" className="text-sm font-medium">
                埋め込みモデル
              </label>
              <select
                id="embeddingModel"
                name="embeddingModel"
                value={settings.embeddingModel}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              >
                <option value="text-embedding-3-small">OpenAI Text Embedding 3 Small</option>
                <option value="text-embedding-3-large">OpenAI Text Embedding 3 Large</option>
                <option value="e5-mistral-7b">E5 Mistral 7B</option>
                <option value="bge-large-en">BGE Large English</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold">ドキュメント処理設定</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="chunkSize" className="text-sm font-medium">
                チャンクサイズ（文字数）
              </label>
              <input
                id="chunkSize"
                name="chunkSize"
                type="number"
                min="100"
                max="8000"
                value={settings.chunkSize}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
              <p className="text-xs text-muted-foreground">
                ドキュメントを分割する際のチャンクの最大サイズ
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="chunkOverlap" className="text-sm font-medium">
                チャンクオーバーラップ（文字数）
              </label>
              <input
                id="chunkOverlap"
                name="chunkOverlap"
                type="number"
                min="0"
                max="1000"
                value={settings.chunkOverlap}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
              <p className="text-xs text-muted-foreground">
                連続するチャンク間で重複させる文字数
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="retrievalCount" className="text-sm font-medium">
                検索結果数
              </label>
              <input
                id="retrievalCount"
                name="retrievalCount"
                type="number"
                min="1"
                max="20"
                value={settings.retrievalCount}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
              <p className="text-xs text-muted-foreground">
                クエリ実行時に取得する関連チャンクの数
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            設定を保存
          </Button>
        </div>
      </form>
    </div>
  );
}