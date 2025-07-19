import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import VisitorCounter from './VisitorCounter';

// isKiribanをモック化
vi.mock('../lib/kiriban', () => ({
  isKiriban: vi.fn(),
}));

describe('VisitorCounter', () => {
  it('should show a scroll button when it is a kiriban number', async () => {
    const { isKiriban } = await import('../lib/kiriban');
    (isKiriban as any).mockReturnValue(true);

    // モックAPI
    global.fetch = vi.fn()
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ count: 99 }) }) // 初期カウント
      .mockResolvedValueOnce({ ok: true }); // POST

    const handleScroll = vi.fn();
    render(<VisitorCounter onScrollToComment={handleScroll} />);

    await waitFor(() => {
      const scrollButton = screen.getByRole('button', { name: 'コメントする' });
      expect(scrollButton).toBeInTheDocument();
      fireEvent.click(scrollButton);
      expect(handleScroll).toHaveBeenCalledTimes(1);
    });
  });

  it('should not show a scroll button when it is not a kiriban number', async () => {
    const { isKiriban } = await import('../lib/kiriban');
    (isKiriban as any).mockReturnValue(false);

    // モックAPI
    global.fetch = vi.fn()
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ count: 10 }) }) // 初期カウント
      .mockResolvedValueOnce({ ok: true }); // POST

    render(<VisitorCounter onScrollToComment={() => {}} />);

    await waitFor(() => {
      const scrollButton = screen.queryByRole('button', { name: 'コメントする' });
      expect(scrollButton).not.toBeInTheDocument();
    });
  });
});
