import React from 'react';
import { render, screen } from '@testing-library/react';
import ChatPage from './page';

// Mock the ChatInterface component
jest.mock('@/components/chat/chat-interface', () => ({
  ChatInterface: () => <div data-testid="chat-interface-mock">Chat Interface Mock</div>
}));

describe('ChatPage', () => {
  it('renders the chat page with header and interface', () => {
    render(<ChatPage />);
    
    expect(screen.getByText(/RAGチャット/i)).toBeInTheDocument();
    expect(screen.getByTestId('chat-interface-mock')).toBeInTheDocument();
  });

  it('has a back link to home page', () => {
    render(<ChatPage />);
    
    const backLink = screen.getByRole('link', { name: /ホームに戻る/i });
    expect(backLink).toHaveAttribute('href', '/');
  });
});