'use client';

import { ChatInterface } from '@/components/chat/chat-interface';
import { useState, useEffect } from 'react';
import { getCollections } from '@/lib/api/documents';
import { Collection } from '@/lib/types';

export default function DashboardChatPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const data = await getCollections();
        setCollections(data);
      } catch (error) {
        console.error('コレクション取得エラー:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">RAGチャット</h1>
          
          <div className="flex items-center">
            <label htmlFor="collection" className="text-sm mr-2">
              コレクション:
            </label>
            <select
              id="collection"
              className="border rounded-md px-3 py-1 text-sm"
              value={selectedCollectionId}
              onChange={(e) => setSelectedCollectionId(e.target.value)}
              disabled={loading}
            >
              <option value="all">すべて</option>
              {collections.map((collection) => (
                <option key={collection.id} value={collection.id}>
                  {collection.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <ChatInterface />
      </div>
    </div>
  );
}