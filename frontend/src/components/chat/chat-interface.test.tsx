import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatInterface } from './chat-interface';

// Mock random ID generation for predictable tests
jest.mock('crypto', () => ({
  randomUUID: () => 'test-uuid'
}));

describe('ChatInterface', () => {
  it('renders empty chat interface', () => {
    render(<ChatInterface />);
    
    expect(screen.getByText(/会話を始めましょう/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/メッセージを入力/i)).toBeInTheDocument();
  });

  it('adds user message when sent via input', async () => {
    const user = userEvent.setup();
    render(<ChatInterface />);
    
    const input = screen.getByPlaceholderText(/メッセージを入力/i);
    await user.type(input, 'Hello, AI!');
    
    const sendButton = screen.getByRole('button', { name: /送信/i });
    await user.click(sendButton);
    
    expect(screen.getByText('Hello, AI!')).toBeInTheDocument();
    expect(screen.getByText('You')).toBeInTheDocument();
  });

  it('simulates AI response after user message', async () => {
    const user = userEvent.setup();
    render(<ChatInterface />);
    
    // Send a user message
    const input = screen.getByPlaceholderText(/メッセージを入力/i);
    await user.type(input, 'Tell me about RAG');
    const sendButton = screen.getByRole('button', { name: /送信/i });
    await user.click(sendButton);
    
    // Wait for AI response
    await waitFor(() => {
      expect(screen.getByText(/RAGはRetrieval Augmented Generation/i)).toBeInTheDocument();
    });
  });
});