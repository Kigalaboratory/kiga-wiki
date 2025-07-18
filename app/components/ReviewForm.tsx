'use client';

import { useState } from 'react';
import { Dish } from '../types';

type ReviewFormProps = {
  onAddDish: (dish: Dish) => void;
};

export default function ReviewForm({ onAddDish }: ReviewFormProps) {
  const [newDishName, setNewDishName] = useState('');
  const [newChefName, setNewChefName] = useState('');
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newDish: Dish = {
      id: Date.now(),
      name: newDishName,
      chef: newChefName,
    };
    onAddDish(newDish);
    setNewDishName('');
    setNewChefName('');
    setNewComment('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="dishName">料理名</label>
        <input
          id="dishName"
          type="text"
          value={newDishName}
          onChange={(e) => setNewDishName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="chefName">ハンドルネーム</label>
        <input
          id="chefName"
          type="text"
          value={newChefName}
          onChange={(e) => setNewChefName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="comment">コメント</label>
        <textarea
          id="comment"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          required
        />
      </div>
      <button type="submit">評価を投稿</button>
    </form>
  );
}
