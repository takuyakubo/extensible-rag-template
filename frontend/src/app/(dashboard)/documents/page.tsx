'use client';

import { useState } from 'react';
import { UploadDocument } from '@/components/documents/upload-document';
import { DocumentList } from '@/components/documents/document-list';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';

export default function DocumentsPage() {
  const [showUploadForm, setShowUploadForm] = useState(false);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">ドキュメント管理</h1>
        <Button onClick={() => setShowUploadForm(!showUploadForm)}>
          {showUploadForm ? (
            <>
              <X className="mr-2 h-4 w-4" />
              キャンセル
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              アップロード
            </>
          )}
        </Button>
      </div>

      {showUploadForm && (
        <UploadDocument 
          onSuccess={() => {
            setShowUploadForm(false);
            // ドキュメントリストを更新するためにリロード
            window.location.reload();
          }} 
        />
      )}

      <DocumentList />
    </div>
  );
}