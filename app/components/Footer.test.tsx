import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Footer from './Footer';

describe('Footer', () => {
  it('should render the disclaimer', () => {
    render(<Footer />);

    const disclaimer = screen.getByText(
      /本ウェブサイトに掲載されている事象、登場する人物、団体、名称、事件、場所などはすべて架空のものであり、/
    );
    const disclaimerStrong = screen.getByText(/実在のものとは一切関係ありません/);

    expect(disclaimer).toBeInTheDocument();
    expect(disclaimerStrong).toBeInTheDocument();
    expect(disclaimerStrong.tagName).toBe('STRONG');
  });
});
