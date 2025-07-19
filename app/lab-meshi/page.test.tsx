import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import LabMeshiPage from './page';

// fetch API のモック
const mockFetch = vi.fn();
global.fetch = mockFetch;

// react-katex のモック
vi.mock('react-katex', () => ({
  InlineMath: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}));

describe('LabMeshiPage Integration Test', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('should display a new dish with its first comment after submission', async () => {
    // 1. 初回レンダリング時のGETリクエストをモック
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<LabMeshiPage />);

    // 2. 初回はリストが空であることを確認
    await waitFor(() => {
      const dishList = screen.getByTestId('dish-list');
      expect(within(dishList).queryByRole('listitem')).toBeNull();
    });

    // 3. POSTリクエストと、その後のGETリクエストをモック
    const newDishData = { name: '新作テスト料理', author: 'テスト担当', content: 'テストコメント' };
    const newDishResponse = { 
      id: 1, 
      name: newDishData.name, 
      createdAt: new Date().toISOString(),
      comments: [
        { id: 1, author: newDishData.author, content: newDishData.content, createdAt: new Date().toISOString(), parentId: null }
      ]
    };
    mockFetch
      .mockResolvedValueOnce({ // POST
        ok: true,
        json: async () => newDishResponse,
      })
      .mockResolvedValueOnce({ // GET after POST
        ok: true,
        json: async () => [newDishResponse],
      });

    // 4. フォーム入力と送信
    const user = userEvent.setup();
    await user.type(screen.getByLabelText('拙者が作りし料理の名を言ってみよ'), newDishData.name);
    await user.type(screen.getByLabelText('お主の名を名乗るがよい'), newDishData.author);
    await user.type(screen.getByLabelText('この料理への熱き想いを語るのじゃ！'), newDishData.content);
    await user.click(screen.getByRole('button', { name: 'この評価、天に届け！' }));

    // 5. 新しい料理とコメントがリストに表示されるのを待つ
    await waitFor(() => {
      expect(screen.getByText(newDishData.name)).toBeInTheDocument();
      // コメントも最初から表示されているはず
      expect(screen.getByText(newDishData.content)).toBeInTheDocument();
    });

    // 6. fetchが期待通りに呼ばれたか確認
    expect(mockFetch).toHaveBeenCalledTimes(3);
    const postCall = mockFetch.mock.calls.find(call => call[1]?.method === 'POST');
    expect(postCall).toBeDefined();
    expect(postCall?.[0]).toBe('/api/dishes');
    expect(JSON.parse(postCall?.[1]?.body as string)).toEqual(newDishData);
  });
});
