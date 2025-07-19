import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CommentList from './CommentList';
import { CommentWithChildren } from '../types';

describe('CommentList', () => {
  const mockComments: CommentWithChildren[] = [
    { 
      id: 1, author: '親1', content: '親コメント1', createdAt: new Date(), parentId: null,
      children: [
        { id: 2, author: '子1', content: '子コメント1', createdAt: new Date(), parentId: 1, children: [] }
      ]
    },
    { id: 3, author: '親2', content: '親コメント2', createdAt: new Date(), parentId: null, children: [] }
  ];

  it('should render comments in a nested structure', () => {
    render(<CommentList comments={mockComments} onReply={vi.fn()} />);

    expect(screen.getByText('親コメント1')).toBeInTheDocument();
    // 子コメントはネストされていることを確認
    const childComment = screen.getByText('子コメント1');
    expect(childComment).toBeInTheDocument();
    expect(childComment.closest('.comment-replies')).not.toBeNull();
  });

  it('should show a reply button and a form when clicked', async () => {
    const handleReply = vi.fn();
    render(<CommentList comments={mockComments} onReply={handleReply} />);

    const replyButtons = screen.getAllByRole('button', { name: '返信する' });
    // mockCommentsには親が2つ、子が1つあるので、返信ボタンは3つ
    expect(replyButtons.length).toBe(3);

    // 1つ目のコメントの返信ボタンをクリック
    fireEvent.click(replyButtons[0]);

    // 返信フォームが表示されることを確認
    const authorInput = screen.getByLabelText('返信者名を名乗るがよい');
    const contentTextarea = screen.getByLabelText('この掲示板への熱き想いを語るのじゃ！');
    const submitButton = screen.getByRole('button', { name: 'この想い、天に届け！' });
    
    expect(authorInput).toBeInTheDocument();
    expect(contentTextarea).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
    
    // 返信フォームを送信
    await fireEvent.change(authorInput, { target: { value: 'テスト返信者' } });
    await fireEvent.change(contentTextarea, { target: { value: 'テスト返信です' } });
    await fireEvent.click(submitButton);

    expect(handleReply).toHaveBeenCalledWith({
      content: 'テスト返信です',
      parentId: 1,
      replyAuthor: 'テスト返信者',
    });
  });

  it('should render a message when there are no comments', () => {
    render(<CommentList comments={[]} onReply={vi.fn()} />);
    expect(screen.getByText('まだコメントはありません。一番乗りを目指せ！')).toBeInTheDocument();
  });
});
