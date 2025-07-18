import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import LabMeshiPage from './page';

// react-katex のモック
vi.mock('react-katex', () => {
  return {
    InlineMath: ({ children }: { children: React.ReactNode }) => <span className="katex-mock">{children}</span>,
  };
});


describe('LabMeshi Page', () => {
  it('should render the page title', () => {
    render(<LabMeshiPage />);
    const heading = screen.getByRole('heading', {
      level: 1,
      name: /当研究室における非公式調理活動（通称：ラボ飯）の定量的評価と格付けに関する包括的報告書/i,
    });
    expect(heading).toBeInTheDocument();
  });

  it('should render the formula with KaTeX', () => {
    render(<LabMeshiPage />);
    // "最終スコア計算式:" のテキストを持つ要素を取得
    const formulaTitle = screen.getByText('最終スコア計算式:');
    // その親のpタグの、さらに次の兄弟要素（数式をラップするpタグ）の中身をテスト
    const formulaWrapper = formulaTitle.parentElement?.nextElementSibling;
    expect(formulaWrapper).not.toBeNull();
    // @ts-expect-error: formulaWrapper is checked for nullity
    expect(formulaWrapper.querySelector('.katex-mock')).toBeInTheDocument();
  });

  it('should render a list of dishes', () => {
    render(<LabMeshiPage />);
    const dishName = screen.getByText('究極のペペロンチーノ');
    expect(dishName).toBeInTheDocument();
  });

  it('should add a new dish to the list when the form is submitted', async () => {
    render(<LabMeshiPage />);
    const user = userEvent.setup();

    const dishNameInput = screen.getByLabelText('料理名');
    const chefNameInput = screen.getByLabelText('ハンドルネーム');
    const commentInput = screen.getByLabelText('コメント');
    const submitButton = screen.getByRole('button', { name: '評価を投稿' });

    await user.type(dishNameInput, '新作ラボ飯');
    await user.type(chefNameInput, '新人研究員');
    await user.type(commentInput, '美味しかったです！');
    await user.click(submitButton);

    const newDishName = await screen.findByText('新作ラボ飯');
    expect(newDishName).toBeInTheDocument();
  });
});
