'use client';

import { useState } from 'react';

type ReviewFormProps = {
  onSubmit: (data: { name?: string; chef: string; comment: string; dishId?: number }) => Promise<void>;
  dishId?: number;
  dishName?: string;
};

export default function ReviewForm({ onSubmit, dishId, dishName }: ReviewFormProps) {
  const [chef, setChef] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [newDishName, setNewDishName] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const data: { name?: string; chef: string; comment: string; dishId?: number } = {
      chef,
      comment,
    };

    if (dishId) {
      data.dishId = dishId;
    } else {
      data.name = newDishName;
    }

    try {
      await onSubmit(data);
      setChef('');
      setComment('');
      setNewDishName('');
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`review-form ${isSubmitted ? 'fly-away' : ''}`}
      role="form"
    >
      {!dishId && (
        <div className="form-group">
          <label htmlFor="dishName">拙者が作りし料理の名を言ってみよ</label>
          <input
            id="dishName"
            type="text"
            value={newDishName}
            onChange={(e) => setNewDishName(e.target.value)}
            placeholder="例：伝説のカレー"
            required
          />
        </div>
      )}
      {dishName && <h3 className="review-target-dish">評価対象: {dishName}</h3>}
      <div className="form-group">
        <label htmlFor="chefName">お主の名を名乗るがよい</label>
        <input
          id="chefName"
          type="text"
          value={chef}
          onChange={(e) => setChef(e.target.value)}
          placeholder="例：厨房の魔術師"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="comment">この料理への熱き想いを語るのじゃ！</label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="例：この一皿に宇宙を見た…"
          required
        />
      </div>
      <button type="submit" disabled={isSubmitting} className="silly-button">
        {isSubmitting ? '天に届け中...' : 'この評価、天に届け！'}
      </button>
    </form>
  );
}
