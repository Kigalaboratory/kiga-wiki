import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from './Header';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('Header', () => {
  const GITHUB_URL = 'https://github.com/Kigalaboratory/kiga-wiki/tree/main';

  // window.locationとalert、console.logをモック化
  const originalLocation = window.location;
  beforeEach(() => {
    // JSDOMのlocationは読み取り専用なので、モックで上書き可能にする
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { ...originalLocation, href: '', reload: vi.fn() },
    });
    vi.spyOn(window, 'alert').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    // 各テスト後にスパイとモックを解放
    vi.restoreAllMocks();
    Object.defineProperty(window, 'location', {
      writable: true,
      value: originalLocation,
    });
  });

  it('クッキー設定をリセットするボタンが表示される', () => {
    render(<Header />);
    const button = screen.getByRole('button', { name: /クッキー設定をリセット/i });
    expect(button).toBeInTheDocument();
  });

  it('ボタンクリックでlocalStorageのcookieConsentが削除され、ページがリロードされる', () => {
    const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem');
    
    render(<Header />);
    const button = screen.getByRole('button', { name: /クッキー設定をリセット/i });
    fireEvent.click(button);

    expect(removeItemSpy).toHaveBeenCalledWith('cookieConsent');
    expect(window.location.reload).toHaveBeenCalled();
  });

  describe('編集ボタン', () => {
    it('ボタンクリックでコンソールログとアラートが表示され、GitHubに遷移する', () => {
      render(<Header />);
      const editButton = screen.getByRole('button', { name: /編集/i });
      fireEvent.click(editButton);

      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('神の啓示'));
      expect(window.alert).toHaveBeenCalledWith(
        '見ちゃったね？ 見ちゃったね？ このボタンは『押すな』と書いてあるのと同じなんだぜ。編集権限？ そんなものはない。代わりに、我々の秘密結社の古文書（GitHub）への道を示してやろう。'
      );
      expect(window.location.href).toBe(GITHUB_URL);
    });
  });

  describe('履歴ボタン', () => {
    it('ボタンクリックでコンソールログとアラートが表示され、GitHubに遷移する', () => {
      render(<Header />);
      const historyButton = screen.getByRole('button', { name: /履歴/i });
      fireEvent.click(historyButton);

      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('タイムマシン'));
      expect(window.alert).toHaveBeenCalledWith(
        '過去に戻りたいだと？ 残念だったな、タイムマシンはまだ開発中だ。このWikiの黒歴史（コミットログ）なら見せてやってもいいが...見る覚悟はできているか？'
      );
      expect(window.location.href).toBe(GITHUB_URL);
    });
  });
});
