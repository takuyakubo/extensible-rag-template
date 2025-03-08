'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { isAuthenticated } from '@/lib/api/auth';

export default function Home() {
  const [authenticated, setAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setAuthenticated(isAuthenticated());
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-2">読み込み中...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center text-center">
        <h1 className="text-4xl font-bold mb-4">拡張性高いRAGシステム</h1>
        <p className="text-xl mb-8">
          様々なドキュメント形式に対応し、柔軟なカスタマイズが可能なRAG機能を提供します
        </p>
        <div className="flex gap-4 justify-center">
          {authenticated ? (
            <Button asChild>
              <Link href="/dashboard/chat">チャットを始める</Link>
            </Button>
          ) : (
            <>
              <Button asChild>
                <Link href="/login">ログイン</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/register">新規登録</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}