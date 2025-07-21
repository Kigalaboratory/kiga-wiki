import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect } from 'vitest';
import LabMeshiPage from './page';

// react-katex のモック
vi.mock('react-katex', () => ({
  InlineMath: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}));

describe('LabMeshiPage Integration Test', () => {
  it('should display a new dish with its first comment after submission', async () => {
    render(<LabMeshiPage />);

    // フォーム入力と送信
    const user = userEvent.setup();
    const newDishData = { name: '新作テスト料理', author: 'テスト担当', content: 'テストコメント' };
    
    await user.type(screen.getByLabelText('拙者が作りし料理の名を言ってみよ'), newDishData.name);
    await user.type(screen.getByLabelText('お主の名を名乗るがよい'), newDishData.author);
    await user.type(screen.getByLabelText('この料理への熱き想いを語るのじゃ！'), newDishData.content);
    await user.click(screen.getByRole('button', { name: 'この評価、天に届け！' }));

    // 新しい料理とコメントがリストに表示されるのを待つ
    const newDishElement = await screen.findByText(newDishData.name, {}, { timeout: 5000 });
    expect(newDishElement).toBeInTheDocument();

    // 新しく追加された料理のセクション内でコメントを検索
    const dishArticle = newDishElement.closest('article');
    expect(dishArticle).not.toBeNull();
    if (dishArticle) {
      const commentElement = within(dishArticle).getByText(newDishData.content);
      expect(commentElement).toBeInTheDocument();
    }
  });
});
