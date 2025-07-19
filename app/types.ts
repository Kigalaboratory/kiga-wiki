export type Comment = {
  id: number;
  author: string;
  replyAuthor?: string | null;
  content: string;
  createdAt: Date;
  parentId: number | null;
};

export type CommentWithChildren = Comment & {
  children: CommentWithChildren[];
};

export type Dish = {
  id: number;
  name: string;
  createdAt: Date;
  comments: CommentWithChildren[];
};

export type DishWithComments = Dish;
