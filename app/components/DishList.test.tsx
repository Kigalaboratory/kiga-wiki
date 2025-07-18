import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import DishList from './DishList';
import { Dish } from '../types';

describe('DishList', () => {
  it('should render dishes with their reviews in a nested list', () => {
    const mockDishes: Dish[] = [
      {
        id: 1,
        name: '特製ラーメン',
        reviews: [
          { comment: '美味しい！', chef: '和田' },
          { comment: 'また食べたい', chef: '鈴木' },
        ],
      },
      {
        id: 2,
        name: '絶品カレー',
        reviews: [
          { comment: 'スパイスが効いている', chef: '佐藤' },
        ],
      },
    ];

    const mockOnSelectDish = () => {};
    render(<DishList dishes={mockDishes} onSelectDish={mockOnSelectDish} selectedDishId={null} />);

    // 料理名が表示されていることを確認
    expect(screen.getByText('特製ラーメン')).toBeInTheDocument();
    expect(screen.getByText('絶品カレー')).toBeInTheDocument();

    // 査読コメントが "コメント - 名前" の形式で表示されていることを確認
    expect(screen.getByText('美味しい！ - 和田')).toBeInTheDocument();
    expect(screen.getByText('また食べたい - 鈴木')).toBeInTheDocument();
    expect(screen.getByText('スパイスが効いている - 佐藤')).toBeInTheDocument();
  });
});
