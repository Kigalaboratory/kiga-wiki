import { render, screen, fireEvent } from '@testing-library/react';
import Header from './Header';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('Header', () => {
  beforeEach(() => {
    // window.location.reloadをモック化
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { ...window.location, reload: vi.fn() },
    });
  });

  it('クッキー設定をリセットするボタンが表示される', () => {
    render(<Header />);
    const button = screen.getByRole('button', { name: /クッキー設定をリセット/i });
    expect(button).toBeInTheDocument();
  });

  it('ボタンクリックでlocalStorageのcookieConsentが削除され、ページがリロードされる', () => {
    // localStorage.removeItemをモック化
    const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem');
    
    render(<Header />);
    const button = screen.getByRole('button', { name: /クッキー設定をリセット/i });
    fireEvent.click(button);

    expect(removeItemSpy).toHaveBeenCalledWith('cookieConsent');
    expect(window.location.reload).toHaveBeenCalled();

    // スパイを解放
    removeItemSpy.mockRestore();
  });
});
