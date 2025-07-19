import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import Page from './page';

// fetch APIのモック
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('Page', () => {
  beforeEach(() => {
    // 各テストの前にfetchモックをリセットし、成功したレスポンスをデフォルトで返すように設定
    mockFetch.mockReset().mockResolvedValue({
      ok: true,
      json: async () => [], // デフォルトでは空の配列を返す
    });
  });

  it('renders a heading', () => {
    render(<Page />);

    const heading = screen.getByRole('heading', {
      name: /スーパーすごいプロジェクト Kiga Wiki へようこそ！/i,
    });

    expect(heading).toBeInTheDocument();
  });
});
