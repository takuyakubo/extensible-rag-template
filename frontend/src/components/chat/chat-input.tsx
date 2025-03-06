import React, { useState, useRef, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  isDisabled?: boolean;
}

export function ChatInput({ onSend, isDisabled = false }: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (input.trim() && !isDisabled) {
      onSend(input);
      setInput('');
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto resize textarea
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    setInput(textarea.value);
    
    // Reset height to calculate the new height
    textarea.style.height = 'auto';
    
    // Set new height based on scrollHeight (content height)
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  };

  return (
    <div className="border rounded-lg p-2 flex items-end">
      <textarea
        ref={textareaRef}
        value={input}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        placeholder="メッセージを入力してください..."
        className="flex-1 outline-none resize-none max-h-[200px] min-h-[60px] p-2"
        disabled={isDisabled}
      />
      <Button 
        onClick={handleSubmit}
        disabled={!input.trim() || isDisabled}
        size="icon"
        className="ml-2"
      >
        <Send className="h-4 w-4" />
        <span className="sr-only">送信</span>
      </Button>
    </div>
  );
}