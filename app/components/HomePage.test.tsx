import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import HomePage from './HomePage';
import { CommentWithChildren } from '../types';

// VisitorCounterコンポーネントをモック化
vi.mock('./VisitorCounter', () => ({
  default: () => <div data-testid="visitor-counter-mock">Visitor Counter Mock</div>,
}));

describe('HomePage', () => {
  it('renders a heading', () => {
    render(<HomePage initialComments={[]} />);

    const heading = screen.getByRole('heading', {
      name: /スーパーすごいプロジェクト Wiki へようこそ！/i,
    });

    expect(heading).toBeInTheDocument();
  });

  it('should display initial comments', () => {
    const mockComments: CommentWithChildren[] = [
      { id: 1, author: 'Test Author', content: 'This is a test comment', createdAt: new Date(), parentId: null, children: [] },
    ];
    
    render(<HomePage initialComments={mockComments} />);

    expect(screen.getByText('This is a test comment')).toBeInTheDocument();
  });
});
