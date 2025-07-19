import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DishList from './DishList';
import { DishWithComments } from '../types';

// CommentListとCommentFormをモック化
vi.mock('./CommentList', () => ({
  default: ({ comments }: { comments: { content: string }[] }) => (
    <div data-testid="comment-list">
      {comments.map((c, i) => <p key={i}>{c.content}</p>)}
    </div>
  ),
}));

vi.mock('./CommentForm', () => ({
  default: () => <form data-testid="comment-form"></form>,
}));

describe('DishList', () => {
  const mockDishes: DishWithComments[] = [
    {
      id: 1,
      name: '特製ラーメン',
      createdAt: new Date(),
      comments: [
        { id: 1, author: '和田', content: '美味しい！', createdAt: new Date(), parentId: null, children: [] },
      ],
    },
    {
      id: 2,
      name: '絶品カレー',
      createdAt: new Date(),
      comments: [],
    },
  ];

  it('should render dish names', () => {
    render(<DishList dishes={mockDishes} onCommentSubmit={vi.fn()} />);
    expect(screen.getByText('特製ラーメン')).toBeInTheDocument();
    expect(screen.getByText('絶品カレー')).toBeInTheDocument();
  });

  it('should always show comments and form', () => {
    render(<DishList dishes={mockDishes} onCommentSubmit={vi.fn()} />);

    // コメントリストとフォームが常に表示されていることを確認
    expect(screen.getAllByTestId('comment-list').length).toBe(2);
    expect(screen.getAllByTestId('comment-form').length).toBe(2);

    // コメント内容が表示されていることを確認
    expect(screen.getByText('美味しい！')).toBeInTheDocument();
  });
});
