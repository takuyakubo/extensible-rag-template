import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ChatInterface } from '@/components/chat/chat-interface';
import { Button } from '@/components/ui/button';

export default function ChatPage() {
  return (
    <div className="flex flex-col h-screen">
      <header className="border-b p-4">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">ホームに戻る</span>
              </Link>
            </Button>
            <h1 className="text-xl font-bold">RAGチャット</h1>
          </div>
        </div>
      </header>
      
      <main className="flex-1 overflow-hidden container py-4">
        <div className="border rounded-lg h-full overflow-hidden">
          <ChatInterface />
        </div>
      </main>
    </div>
  );
}