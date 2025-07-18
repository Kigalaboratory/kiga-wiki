import { render, screen } from '@testing-library/react';
import Page from './page';

describe('Page', () => {
  it('renders a heading', () => {
    render(<Page />);

    const heading = screen.getByRole('heading', {
      name: /スーパーすごいプロジェクト Kiga Wiki へようこそ！/i,
    });

    expect(heading).toBeInTheDocument();
  });
});
