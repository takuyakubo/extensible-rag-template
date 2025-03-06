'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, File, X } from 'lucide-react';
import { createDocument } from '@/lib/api/documents';

export function UploadDocument({ onSuccess }: { onSuccess?: () => void }) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files));
      setError(null);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (files.length === 0) {
      setError('ファイルを選択してください');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      
      files.forEach(file => {
        formData.append('files', file);
      });

      await createDocument(formData);
      
      // アップロード成功後、状態をリセット
      setFiles([]);
      setUploading(false);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('アップロードエラー:', err);
      setError('ドキュメントのアップロードに失敗しました');
      setUploading(false);
    }
  };

  return (
    <div className="p-6 border rounded-lg bg-card">
      <h3 className="text-lg font-medium mb-4">ドキュメントをアップロード</h3>
      
      <form onSubmit={handleSubmit}>
        <div 
          className="border-2 border-dashed rounded-md p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange} 
            className="hidden" 
            multiple 
            accept=".pdf,.doc,.docx,.txt,.md,.html"
          />
          <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground mb-1">
            クリックまたはドラッグ＆ドロップでファイルをアップロード
          </p>
          <p className="text-xs text-muted-foreground">
            PDFやWord、テキストファイルなどに対応
          </p>
        </div>

        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium">選択されたファイル:</p>
            <ul className="space-y-2">
              {files.map((file, index) => (
                <li key={index} className="flex items-center justify-between py-2 px-3 bg-muted rounded-md text-sm">
                  <div className="flex items-center">
                    <File className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate max-w-[240px]">{file.name}</span>
                    <span className="ml-2 text-muted-foreground text-xs">
                      ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="p-1 rounded-full hover:bg-muted-foreground/20"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {error && (
          <div className="mt-4 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <Button type="submit" disabled={uploading || files.length === 0}>
            {uploading ? 'アップロード中...' : 'アップロード'}
          </Button>
        </div>
      </form>
    </div>
  );
}