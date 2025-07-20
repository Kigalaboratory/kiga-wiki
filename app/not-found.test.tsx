import { render, screen } from '@testing-library/react';
import NotFound from './not-found';

describe('NotFound Page', () => {
  it('renders the not found message', () => {
    render(<NotFound />);
    const message = screen.getByText('お探しのページは実験に失敗しました。');
    expect(message).toBeInTheDocument();
  });

  it('renders the professor image', () => {
    render(<NotFound />);
    const image = screen.getByRole('img');
    const src = image.getAttribute('src');
    expect(src).not.toBeNull();
    if (src) {
      expect(decodeURIComponent(src).includes('/404.png')).toBeTruthy();
    }
    expect(image).toHaveAttribute('alt', '実験に失敗した教授');
  });
});
