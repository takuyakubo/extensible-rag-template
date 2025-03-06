'use client';

import React from 'react';
import { Message } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  
  return (
    <div className={cn(
      'flex flex-col space-y-2 p-4 rounded-lg',
      isUser ? 'bg-primary text-primary-foreground ml-12' : 'bg-muted mr-12'
    )}>
      <div className="flex items-center space-x-2">
        <div className="font-semibold">
          {isUser ? 'You' : 'AI'}
        </div>
        <div className="text-xs text-muted-foreground">
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>
      <div className="whitespace-pre-wrap">{message.content}</div>
      
      {message.references && message.references.length > 0 && (
        <div className="mt-4 border-t pt-2">
          <h4 className="text-sm font-medium mb-2">参照ドキュメント:</h4>
          <div className="space-y-2">
            {message.references.map((ref) => (
              <div key={ref.id} className="text-sm bg-background p-2 rounded border">
                <div className="font-medium">{ref.title}</div>
                <div className="text-xs text-muted-foreground mt-1">{ref.content}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}