import { render, screen, waitFor } from '@testing-library/react';
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

  it('should display a new dish after submission', async () => {
    // 1. 初回レンダリング時のGETリクエストをモック
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<LabMeshiPage />);

    // 2. 初回はリストが空であることを確認
    const list = screen.getByTestId('dish-list');
    expect(list.querySelector('li')).toBeNull();

    // 3. POSTリクエストと、その後のGETリクエストをモック
    const newDish = { id: 1, name: '新作テスト料理', chef: 'テスト担当', comment: 'テストコメント', createdAt: new Date().toISOString() };
    mockFetch
      .mockResolvedValueOnce({ // POST
        ok: true,
        json: async () => newDish,
      })
      .mockResolvedValueOnce({ // GET after POST
        ok: true,
        json: async () => [newDish],
      });

    // 4. フォーム入力と送信
    const user = userEvent.setup();
    await user.type(screen.getByLabelText('拙者が作りし料理の名を言ってみよ'), newDish.name);
    await user.type(screen.getByLabelText('お主の名を名乗るがよい'), newDish.chef);
    await user.type(screen.getByLabelText('この料理への熱き想いを語るのじゃ！'), newDish.comment || '');
    await user.click(screen.getByRole('button', { name: 'この評価、天に届け！' }));

    // 5. 新しい料理がリストに表示されるのを待つ
    await waitFor(() => {
      const list = screen.getByTestId('dish-list');
      expect(list.querySelector('li')).not.toBeNull();
      expect(screen.getByText(newDish.name)).toBeInTheDocument();
    });

    // 6. fetchが期待通りに呼ばれたか確認
    expect(mockFetch).toHaveBeenCalledTimes(3); // Initial GET, POST, GET after add
    expect(mockFetch).toHaveBeenCalledWith('/api/dishes', expect.objectContaining({ method: 'POST' }));
  });
});
