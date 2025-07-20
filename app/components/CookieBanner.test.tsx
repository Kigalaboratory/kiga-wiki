import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import CookieBanner from './CookieBanner';

describe('CookieBanner', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should render the cookie banner with the specified text', () => {
    render(<CookieBanner />);
    expect(screen.getByText('全てのクッキーを喜んで受け入れる（教授のまずいクッキーも愛でる）')).toBeInTheDocument();
    expect(screen.getByText('断固拒否する（クッキーの存在を生涯認めない）')).toBeInTheDocument();
    expect(screen.getByText('超詳細カスタマイズ')).toBeInTheDocument();
  });

  it('should show 100 checkboxes when customize button is clicked', () => {
    render(<CookieBanner />);
    const customizeButton = screen.getByText('超詳細カスタマイズ');
    fireEvent.click(customizeButton);
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBe(100);
  });

  it('should not render if cookie consent is already given', () => {
    localStorage.setItem('cookieConsent', 'true');
    const { container } = render(<CookieBanner />);
    expect(container.firstChild).toBeNull();
  });

  it('should be visible to the user', () => {
    render(<CookieBanner />);
    const banner = screen.getByTestId('cookie-banner');
    expect(banner).toBeVisible();
  });

  it('should hide and set consent in localStorage when accept button is clicked', () => {
    render(<CookieBanner />);
    const acceptButton = screen.getByText('全てのクッキーを喜んで受け入れる（教授のまずいクッキーも愛でる）');
    fireEvent.click(acceptButton);
    expect(screen.queryByText('全てのクッキーを喜んで受け入れる（教授のまずいクッキーも愛でる）')).not.toBeInTheDocument();
    expect(localStorage.getItem('cookieConsent')).toBe('true');
  });
});
