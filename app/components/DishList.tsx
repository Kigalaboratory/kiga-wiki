import { Dish } from '../types';

type DishListProps = {
  dishes: Dish[];
};

export default function DishList({ dishes }: DishListProps) {
  return (
    <ul>
      {dishes.map((dish) => (
        <li key={dish.id}>{dish.name}</li>
      ))}
    </ul>
  );
}
