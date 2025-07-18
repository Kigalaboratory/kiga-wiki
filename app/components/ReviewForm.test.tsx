import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ReviewForm from './ReviewForm';

describe('ReviewForm', () => {
  it('renders the form with silly labels and placeholders', () => {
    const mockOnSubmit = vi.fn();
    render(<ReviewForm onSubmit={mockOnSubmit} />);

    // Check for silly labels
    expect(screen.getByLabelText('拙者が作りし料理の名を言ってみよ')).toBeInTheDocument();
    expect(screen.getByLabelText('お主の名を名乗るがよい')).toBeInTheDocument();
    expect(screen.getByLabelText('この料理への熱き想いを語るのじゃ！')).toBeInTheDocument();

    // Check for the submit button with a silly text
    expect(screen.getByRole('button', { name: 'この評価、天に届け！' })).toBeInTheDocument();
  });

  it('applies the fly-away class on successful submission', async () => {
    const mockOnSubmit = vi.fn().mockResolvedValue(undefined);
    render(<ReviewForm onSubmit={mockOnSubmit} />);

    const dishNameInput = screen.getByLabelText('拙者が作りし料理の名を言ってみよ');
    const chefNameInput = screen.getByLabelText('お主の名を名乗るがよい');
    const commentInput = screen.getByLabelText('この料理への熱き想いを語るのじゃ！');
    const submitButton = screen.getByRole('button', { name: 'この評価、天に届け！' });

    // Fill out the form
    fireEvent.change(dishNameInput, { target: { value: 'テスト料理' } });
    fireEvent.change(chefNameInput, { target: { value: 'テストシェフ' } });
    fireEvent.change(commentInput, { target: { value: 'テストコメント' } });

    // Submit the form
    fireEvent.click(submitButton);

    // Wait for the form to get the 'fly-away' class
    await waitFor(() => {
      const form = screen.getByRole('form');
      expect(form).toHaveClass('fly-away');
    });
  });
});
