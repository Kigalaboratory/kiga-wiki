export type Review = {
  comment: string;
  chef: string;
};

export type Dish = {
  id: number;
  name: string;
  reviews: Review[];
};

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
