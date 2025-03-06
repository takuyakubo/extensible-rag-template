import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChatMessage } from './message';
import { Message } from '@/lib/types';

describe('ChatMessage', () => {
  it('renders user message', () => {
    const message: Message = {
      id: '1',
      role: 'user',
      content: 'Hello, world!',
      timestamp: new Date('2023-01-01T12:00:00Z')
    };
    
    render(<ChatMessage message={message} />);
    
    expect(screen.getByText('Hello, world!')).toBeInTheDocument();
    expect(screen.getByText('You')).toBeInTheDocument();
  });

  it('renders assistant message', () => {
    const message: Message = {
      id: '2',
      role: 'assistant',
      content: 'I am an AI assistant.',
      timestamp: new Date('2023-01-01T12:01:00Z')
    };
    
    render(<ChatMessage message={message} />);
    
    expect(screen.getByText('I am an AI assistant.')).toBeInTheDocument();
    expect(screen.getByText('AI')).toBeInTheDocument();
  });

  it('renders references when provided', () => {
    const message: Message = {
      id: '3',
      role: 'assistant',
      content: 'Based on the document...',
      timestamp: new Date('2023-01-01T12:02:00Z'),
      references: [
        {
          id: 'doc1',
          title: 'Sample Document',
          content: 'This is a sample content from the document.',
          relevanceScore: 0.92
        }
      ]
    };
    
    render(<ChatMessage message={message} />);
    
    expect(screen.getByText('Sample Document')).toBeInTheDocument();
    expect(screen.getByText('This is a sample content from the document.')).toBeInTheDocument();
  });
});