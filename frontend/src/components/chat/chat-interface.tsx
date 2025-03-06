import React, { useState, useEffect, useRef } from 'react';
import { Message } from '@/lib/types';
import { ChatMessage } from './message';
import { ChatInput } from './chat-input';
import { randomUUID } from 'crypto';

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: randomUUID(),
      role: 'user',
      content,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    // For now, simulate AI response after a delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: randomUUID(),
        role: 'assistant',
        content: getSimulatedResponse(content),
        timestamp: new Date(),
        references: [
          {
            id: 'doc1',
            title: 'RAG システム概要',
            content: 'RAGはRetrieval Augmented Generationの略で、検索拡張生成と呼ばれます。大規模言語モデルの知識と最新の外部データを組み合わせる手法です。',
            relevanceScore: 0.95
          }
        ]
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };
  
  // Simple response simulation
  const getSimulatedResponse = (query: string): string => {
    if (query.toLowerCase().includes('rag')) {
      return 'RAGはRetrieval Augmented Generationの略で、検索拡張生成と呼ばれています。\n\nこの手法は大規模言語モデル（LLM）の生成能力と、外部知識源からの情報検索を組み合わせることで、より正確で最新の情報に基づいた応答を生成します。';
    }
    
    return 'こんにちは！どのようなことについて知りたいですか？RAGシステムについて質問があればお気軽にどうぞ。';
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <p>会話を始めましょう。下のフォームからメッセージを送信してください。</p>
          </div>
        ) : (
          messages.map(message => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t">
        <ChatInput onSend={handleSendMessage} isDisabled={isLoading} />
        {isLoading && (
          <div className="text-sm text-muted-foreground mt-2">
            AIが返答を生成中...
          </div>
        )}
      </div>
    </div>
  );
}