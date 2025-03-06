'use client';

import { useState, useEffect } from 'react';
import { 
  FileText, 
  FileArchive, 
  FileCog,
  FileWarning,
  Search,
  MoreVertical,
  Trash
} from 'lucide-react';
import { Document } from '@/lib/types';
import { getDocuments, deleteDocument } from '@/lib/api/documents';
import { Button } from '@/components/ui/button';
import { formatFileSize, formatDate } from '@/lib/utils';

export function DocumentList() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const data = await getDocuments();
      setDocuments(data);
      setError(null);
    } catch (err) {
      console.error('ドキュメント取得エラー:', err);
      setError('ドキュメントの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDocument = async (id: string) => {
    if (!confirm('このドキュメントを削除してもよろしいですか？')) {
      return;
    }

    try {
      await deleteDocument(id);
      setDocuments(prevDocs => prevDocs.filter(doc => doc.id !== id));
    } catch (err) {
      console.error('ドキュメント削除エラー:', err);
      alert('ドキュメントの削除に失敗しました');
    }
  };

  const filteredDocuments = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.fileName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <FileCog className="h-4 w-4 text-blue-500" />;
      case 'indexed':
        return <FileText className="h-4 w-4 text-green-500" />;
      case 'error':
        return <FileWarning className="h-4 w-4 text-red-500" />;
      case 'deleted':
        return <Trash className="h-4 w-4 text-gray-500" />;
      default:
        return <FileArchive className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'processing':
        return '処理中';
      case 'indexed':
        return 'インデックス済み';
      case 'error':
        return 'エラー';
      case 'deleted':
        return '削除済み';
      default:
        return '不明';
    }
  };

  if (loading) {
    return <div className="flex justify-center py-8">読み込み中...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={fetchDocuments}>再試行</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="ドキュメントを検索..."
          className="pl-10 pr-4 py-2 w-full border rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredDocuments.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          {searchTerm ? 'ドキュメントが見つかりませんでした' : 'ドキュメントがありません'}
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">ドキュメント</th>
                <th className="px-4 py-3 text-left text-sm font-medium">ステータス</th>
                <th className="px-4 py-3 text-left text-sm font-medium">サイズ</th>
                <th className="px-4 py-3 text-left text-sm font-medium">更新日</th>
                <th className="px-4 py-3 text-left text-sm font-medium w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredDocuments.map((doc) => (
                <tr key={doc.id} className="hover:bg-muted/50">
                  <td className="px-4 py-3">
                    <div className="flex items-start">
                      <FileText className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{doc.title}</div>
                        <div className="text-xs text-muted-foreground">{doc.fileName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      {getStatusIcon(doc.status)}
                      <span className="text-sm ml-1.5">{getStatusLabel(doc.status)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">{formatFileSize(doc.fileSize)}</td>
                  <td className="px-4 py-3 text-sm">{formatDate(doc.updatedAt)}</td>
                  <td className="px-4 py-3">
                    <div className="relative">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setSelectedDocument(selectedDocument?.id === doc.id ? null : doc)}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                      
                      {selectedDocument?.id === doc.id && (
                        <div className="absolute right-0 z-10 mt-1 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <div className="py-1">
                            <button
                              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-muted"
                              onClick={() => handleDeleteDocument(doc.id)}
                            >
                              削除
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}