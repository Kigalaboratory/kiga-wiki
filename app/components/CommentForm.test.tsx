import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CommentForm from './CommentForm';

describe('CommentForm', () => {
  it('should render the form and submit a new comment', async () => {
    const mockOnSubmit = vi.fn();
    render(<CommentForm onSubmit={mockOnSubmit} />);

    const authorInput = screen.getByLabelText('お主の名を名乗るがよい');
    const contentTextarea = screen.getByLabelText('この掲示板への熱き想いを語るのじゃ！');
    const submitButton = screen.getByRole('button', { name: 'この想い、天に届け！' });

    expect(authorInput).toBeInTheDocument();
    expect(contentTextarea).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();

    fireEvent.change(authorInput, { target: { value: 'テストユーザー' } });
    fireEvent.change(contentTextarea, { target: { value: 'テストコメント' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        author: 'テストユーザー',
        content: 'テストコメント',
      });
    });
  });

  it('should render the form and submit a new reply with a reply author', async () => {
    const mockOnSubmit = vi.fn();
    render(<CommentForm onSubmit={mockOnSubmit} parentId={1} />);

    const authorInput = screen.queryByLabelText('お主の名を名乗るがよい');
    expect(authorInput).not.toBeInTheDocument();

    const replyAuthorInput = screen.getByLabelText('返信者名を名乗るがよい');
    const contentTextarea = screen.getByLabelText('この掲示板への熱き想いを語るのじゃ！');
    const submitButton = screen.getByRole('button', { name: 'この想い、天に届け！' });

    expect(replyAuthorInput).toBeInTheDocument();
    expect(contentTextarea).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();

    fireEvent.change(replyAuthorInput, { target: { value: '返信テストユーザー' } });
    fireEvent.change(contentTextarea, { target: { value: '返信テストコメント' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        content: '返信テストコメント',
        parentId: 1,
        replyAuthor: '返信テストユーザー',
      });
    });
  });
});
