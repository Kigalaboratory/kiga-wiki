'use client';

import { DishWithComments } from '../types';
import CommentList from './CommentList';
import CommentForm from './CommentForm';

type DishListProps = {
  dishes: DishWithComments[];
  onCommentSubmit: (data: { author?: string; content: string; parentId?: number; replyAuthor?: string, dishId?: number }) => Promise<void>;
};

export default function DishList({ dishes, onCommentSubmit }: DishListProps) {
  return (
    <ul data-testid="dish-list">
      {dishes.map((dish) => (
        <li key={dish.id} className="dish-item">
          <h3>
            {dish.name}
          </h3>
          <div className="dish-comments-container">
            <CommentList 
              comments={dish.comments} 
              onReply={(data) => onCommentSubmit({...data, dishId: dish.id})}
              title={`${dish.name}へのコメント`}
            />
            <CommentForm 
              onSubmit={(data) => onCommentSubmit({...data, dishId: dish.id})} 
              labels={{
                author: 'お主の名を名乗るがよい',
                content: 'この料理への熱き想いを語るのじゃ！',
                button: 'この評価、天に届け！'
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
