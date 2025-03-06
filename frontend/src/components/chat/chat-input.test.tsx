import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatInput } from './chat-input';

describe('ChatInput', () => {
  it('renders textarea and submit button', () => {
    render(<ChatInput onSend={jest.fn()} />);
    
    expect(screen.getByPlaceholderText(/メッセージを入力/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /送信/i })).toBeInTheDocument();
  });

  it('disables submit button when textarea is empty', () => {
    render(<ChatInput onSend={jest.fn()} />);
    
    expect(screen.getByRole('button', { name: /送信/i })).toBeDisabled();
  });

  it('enables submit button when text is entered', async () => {
    const user = userEvent.setup();
    render(<ChatInput onSend={jest.fn()} />);
    
    const textarea = screen.getByPlaceholderText(/メッセージを入力/i);
    await user.type(textarea, 'Hello');
    
    expect(screen.getByRole('button', { name: /送信/i })).toBeEnabled();
  });

  it('calls onSend with input text when submitted', async () => {
    const handleSend = jest.fn();
    const user = userEvent.setup();
    render(<ChatInput onSend={handleSend} />);
    
    const textarea = screen.getByPlaceholderText(/メッセージを入力/i);
    await user.type(textarea, 'Hello, AI!');
    
    const submitButton = screen.getByRole('button', { name: /送信/i });
    await user.click(submitButton);
    
    expect(handleSend).toHaveBeenCalledWith('Hello, AI!');
    expect(textarea).toHaveValue(''); // Should clear input after submission
  });

  it('submits on Shift+Enter', async () => {
    const handleSend = jest.fn();
    render(<ChatInput onSend={handleSend} />);
    
    const textarea = screen.getByPlaceholderText(/メッセージを入力/i);
    fireEvent.change(textarea, { target: { value: 'Hello with Enter' } });
    
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: true });
    
    expect(handleSend).toHaveBeenCalledWith('Hello with Enter');
  });
});