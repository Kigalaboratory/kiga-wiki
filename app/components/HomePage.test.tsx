import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import HomePage from './HomePage';
import { CommentWithChildren } from '../types';

describe('HomePage', () => {
  it('renders a heading', () => {
    render(<HomePage initialComments={[]} />);

    const heading = screen.getByRole('heading', {
      name: /スーパーすごいプロジェクト Kiga Wiki へようこそ！/i,
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
