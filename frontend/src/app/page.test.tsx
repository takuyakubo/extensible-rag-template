import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from './page';

describe('Home', () => {
  it('renders the welcome heading', () => {
    render(<Home />);
    
    expect(screen.getByRole('heading', { name: /拡張性高いRAGシステム/i })).toBeInTheDocument();
  });

  it('displays the description', () => {
    render(<Home />);
    
    expect(screen.getByText(/様々なドキュメント形式に対応し、柔軟なカスタマイズが可能なRAG機能を提供します/i)).toBeInTheDocument();
  });

  it('has links to chat and login', () => {
    render(<Home />);
    
    expect(screen.getByRole('link', { name: /チャットを始める/i })).toHaveAttribute('href', '/chat');
    expect(screen.getByRole('link', { name: /ログイン/i })).toHaveAttribute('href', '/login');
  });
});