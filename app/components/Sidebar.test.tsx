import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import Sidebar from './Sidebar';

// next/link のモック
vi.mock('next/link', () => {
  return {
    default: ({ children, href }: { children: React.ReactNode; href: string }) => {
      return <a href={href}>{children}</a>;
    },
  };
});

describe('Sidebar', () => {
  it('should have a link to the Lab-Meshi page', () => {
    render(<Sidebar />);
    const link = screen.getByRole('link', { name: /胃袋への挑戦状/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/lab-meshi');
  });

  it('should apply rainbow and marquee styles to the special item', () => {
    render(<Sidebar />);
    const link = screen.getByRole('link', { name: /胃袋への挑戦状/i });
    const span = link.querySelector('span');
    expect(span).not.toBeNull();
    if (span) {
      expect(span).toHaveClass('special');
      expect(span).toHaveClass('rainbow-text');
      expect(span).toHaveClass('marquee-text');
    }
  });

});
