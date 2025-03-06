import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center text-center">
        <h1 className="text-4xl font-bold mb-4">拡張性高いRAGシステム</h1>
        <p className="text-xl mb-8">
          様々なドキュメント形式に対応し、柔軟なカスタマイズが可能なRAG機能を提供します
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link href="/chat">チャットを始める</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/login">ログイン</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}