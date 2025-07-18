import { Dish } from '../types';

type DishListProps = {
  dishes: Dish[];
  onSelectDish: (dishId: number | null) => void;
  selectedDishId: number | null;
};

export default function DishList({ dishes, onSelectDish, selectedDishId }: DishListProps) {
  return (
    <ul data-testid="dish-list">
      {dishes.map((dish) => (
        <li key={dish.id}>
          <span onClick={() => onSelectDish(selectedDishId === dish.id ? null : dish.id)} style={{ cursor: 'pointer', fontWeight: 'bold' }}>
            {dish.name}
          </span>
          {dish.reviews && dish.reviews.length > 0 && (
            <ul className="review-list">
              {dish.reviews.map((review, index) => (
                <li key={index}>
                  {review.comment} - {review.chef}
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}
