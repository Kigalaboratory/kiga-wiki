export type Review = {
  comment: string;
  chef: string;
};

export type Dish = {
  id: number;
  name: string;
  reviews: Review[];
};
